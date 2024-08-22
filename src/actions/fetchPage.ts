import { generateText } from "ai";
import { chromium } from "playwright";

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
  let pageContents = "";
  if (process.env.NODE_ENV === "development") {
    /**
     * In dev, we can launch a playwright chromium instance
     */
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForLoadState("networkidle");

    const content = await page.content();
    await browser.close();

    pageContents = getInnerText(content);
  } else {
    /**
     * In prod, do a best effort reading of the url
     */
    const htmlSoup = await fetch(url)
      .then((res) => res.text())
      .catch((err) => console.error(err));

    pageContents = getInnerText(htmlSoup ?? "");
  }

  console.log("PageContents:", pageContents);
  if (!enrich) {
    return pageContents;
  }

  const jobPostingContents = await generateText({
    model: DEFAULT_MODEL,
    system: htmlPageReconstruction,
    prompt: pageContents,
  });

  return jobPostingContents.text;
}
