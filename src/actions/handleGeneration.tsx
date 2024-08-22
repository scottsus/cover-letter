"use server";

import { generateText, streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

import { DEFAULT_MODEL } from "~/lib/models";
import {
  coverLetterPrompt,
  coverLetterSystemPrompt,
  emailPrompt,
  pdfReconstructionSystemPrompt,
} from "~/lib/prompts";

import { recordGeneration } from "./analytics";
import { getPageContents } from "./fetchPage";
import {
  fetchLinkedInProfile,
  fetchLinkedInProfileWithCache,
} from "./linkedIn";
import { readPdfText } from "~/actions/pdf";

export async function handleGeneration({
  formData,
  isModeEmail,
}: {
  formData: FormData;
  isModeEmail: boolean;
}) {
  const file = formData.get("resume") as File | null;
  const linkedInUrl = formData.get("linkedInUrl") as string;
  const jobPostingUrl = formData.get("jobPostingUrl") as string;

  const [reconstructedResume, linkedInProfile, jobPostingContents] =
    await Promise.all([
      (async () => {
        let fileContents = file
          ? file.type === "application/pdf"
            ? await readPdfText(file)
            : await file?.text()
          : "No resume was provided.";

        const RESUME_MAX_LEN = 20_000;
        fileContents = fileContents.slice(0, RESUME_MAX_LEN);

        return generateText({
          model: DEFAULT_MODEL,
          system: pdfReconstructionSystemPrompt,
          prompt: fileContents,
        });
      })(),

      (async () => {
        return process.env.NODE_ENV === "development"
          ? await fetchLinkedInProfileWithCache(linkedInUrl)
          : await fetchLinkedInProfile(linkedInUrl);
      })(),

      (async () => {
        return await getPageContents({ url: jobPostingUrl, enrich: true });
      })(),
    ]);

  const resume = reconstructedResume.text;
  const prompt = isModeEmail
    ? emailPrompt({
        resume,
        linkedInProfile,
        jobDescription: jobPostingContents,
      })
    : coverLetterPrompt({
        resume,
        linkedInProfile,
        jobDescription: jobPostingContents,
      });
  recordGeneration({
    resume,
    linkedInProfile,
    jobPosting: jobPostingContents,
    prompt,
  });

  const schema = z.object({ content: z.string() });
  type T = z.infer<typeof schema>;

  const stream = createStreamableValue<T>();
  (async () => {
    const { partialObjectStream } = await streamObject({
      model: DEFAULT_MODEL,
      system: coverLetterSystemPrompt,
      prompt: prompt,
      schema: schema,
    });
    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject as T);
    }
    stream.done();
  })();

  return { object: stream.value };
}
