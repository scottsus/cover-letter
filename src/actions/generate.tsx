"use server";

import { openai } from "@ai-sdk/openai";
import { streamUI } from "ai/rsc";
import { readPdfText } from "~/lib/pdf";
import { coverLetterPrompt } from "~/lib/prompts";

export async function getCoverLetterGeneration(formData: FormData) {
  const file = formData.get("file") as File | undefined;
  const linkedInUrl = formData.get("linkedInUrl") as string;
  const jobPostingUrl = formData.get("jobPostingUrl") as string;

  const fileContents =
    file && file.type === "application/pdf"
      ? await readPdfText(file)
      : await file?.text();
  if (!fileContents) {
    console.error("getCoverLetterGeneration: unable to read file.");
    return;
  }

  const prompt = coverLetterPrompt(fileContents);

  const res = await streamUI({
    model: openai("gpt-4o"),
    prompt: prompt,
    text: ({ content }) => (
      <textarea
        defaultValue={content}
        className="text-black flex-grow overflow-y-scroll whitespace-pre-line p-4 text-sm"
      />
    ),
  });

  return res.value;
}
