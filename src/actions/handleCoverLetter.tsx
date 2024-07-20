"use server";

import { generateText, streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

import { DEFAULT_MODEL } from "~/lib/models";
import {
  coverLetterPrompt,
  coverLetterSystemPrompt,
  pdfReconstructionSystemPrompt,
} from "~/lib/prompts";

import { getPageContents } from "./fetchPage";
import { fetchLinkedInProfile } from "./linkedIn";
import { readPdfText } from "~/actions/pdf";

export async function handleCoverLetter(formData: FormData) {
  const file = formData.get("file") as File | undefined;
  const linkedInUrl = formData.get("linkedInUrl") as string;
  const jobPostingUrl = formData.get("jobPostingUrl") as string;

  const [reconstructedResume, linkedInProfile, jobPostingContents] =
    await Promise.all([
      (async () => {
        const fileContents = file
          ? file.type === "application/pdf"
            ? await readPdfText(file)
            : await file?.text()
          : "No resume was provided.";
        return generateText({
          model: DEFAULT_MODEL,
          system: pdfReconstructionSystemPrompt,
          prompt: fileContents,
        });
      })(),

      (async () => {
        return await fetchLinkedInProfile(linkedInUrl);
      })(),

      (async () => {
        return await getPageContents({ url: jobPostingUrl, enrich: true });
      })(),
    ]);

  const prompt = coverLetterPrompt({
    resume: reconstructedResume.text,
    linkedInProfile: linkedInProfile,
    jobDescription: jobPostingContents,
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
