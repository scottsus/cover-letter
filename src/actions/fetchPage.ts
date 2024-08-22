import { generateText } from "ai";

import { getInnerText } from "~/lib/cheerio";
import { DEFAULT_MODEL } from "~/lib/models";
import { htmlPageReconstruction } from "~/lib/prompts";

export async function getPageContents({
  url,
  enrich = false,
}: {
  url: string;
  enrich?: boolean;
}) {
  const htmlSoup = await fetch(url)
    .then((res) => res.text())
    .catch((err) => console.error(err));
  const text = getInnerText(htmlSoup ?? "");
  if (!enrich) {
    return text;
  }
  console.log("Text:", text);

  const jobPostingContents = await generateText({
    model: DEFAULT_MODEL,
    system: htmlPageReconstruction,
    prompt: text,
  });

  return jobPostingContents.text;
}
