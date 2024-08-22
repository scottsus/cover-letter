"use server";

import { generateObject, streamObject } from "ai";
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

  const [resume, linkedInProfile, jobPosting] = await Promise.all([
    (async () => {
      let fileContents = file
        ? file.type === "application/pdf"
          ? await readPdfText(file)
          : await file?.text()
        : "No resume was provided.";

      const RESUME_MAX_LEN = 20_000;
      fileContents = fileContents.slice(0, RESUME_MAX_LEN);

      return generateObject({
        model: DEFAULT_MODEL,
        system: pdfReconstructionSystemPrompt,
        prompt: fileContents,
        schema: z.object({
          text: z.string(),
          ok: z.boolean(),
        }),
      });
    })(),

    (async () => {
      return process.env.NODE_ENV === "development"
        ? await fetchLinkedInProfileWithCache(linkedInUrl)
        : await fetchLinkedInProfile(linkedInUrl);
    })(),

    (async () => {
      return await getPageContents({ url: jobPostingUrl });
    })(),
  ]);

  if (!resume.object.ok) {
    return { error: "Unable to read resume. Please upload a different one." };
  }
  if (!jobPosting.object.ok) {
    return {
      error:
        "Unable to access job posting. Please try again with a different link.",
    };
  }

  const resumeContents = resume.object.text;
  const jobPostingContents = jobPosting.object.text;
  const prompt = isModeEmail
    ? emailPrompt({
        resume: resumeContents,
        linkedInProfile,
        jobDescription: jobPostingContents,
      })
    : coverLetterPrompt({
        resume: resumeContents,
        linkedInProfile,
        jobDescription: jobPostingContents,
      });
  recordGeneration({
    resume: resumeContents,
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

  return { error: null, object: stream.value };
}
