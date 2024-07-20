"use server";

import { generateText, streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

import { getInnerText } from "~/lib/cheerio";
import { DEFAULT_MODEL } from "~/lib/models";
import {
  coverLetterPrompt,
  coverLetterSystemPrompt,
  htmlPageReconstruction,
  pdfReconstructionSystemPrompt,
} from "~/lib/prompts";

import { readPdfText } from "~/actions/pdf";

export async function handleCoverLetter(formData: FormData) {
  const file = formData.get("file") as File | undefined;
  const linkedInUrl = formData.get("linkedInUrl") as string;
  const jobPostingUrl = formData.get("jobPostingUrl") as string;

  const [reconstructedResume, jobPostingContents] = await Promise.all([
    (async () => {
      const fileContents = file
        ? file.type === "application/pdf"
          ? await readPdfText(file)
          : await file?.text()
        : "";
      return generateText({
        model: DEFAULT_MODEL,
        system: pdfReconstructionSystemPrompt,
        prompt: fileContents,
      });
    })(),
    (async () => {
      const jobPostingHtmlSoup = await fetch(jobPostingUrl)
        .then((res) => res.text())
        .catch((err) => console.error("handleCoverLetter.jobPosting:", err));
      const jobPostingDirty = getInnerText(jobPostingHtmlSoup ?? "");
      return generateText({
        model: DEFAULT_MODEL,
        system: htmlPageReconstruction,
        prompt: jobPostingDirty,
      });
    })(),
  ]);

  const prompt = coverLetterPrompt({
    resume: reconstructedResume.text,
    jobDescription: jobPostingContents.text,
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
