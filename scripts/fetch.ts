import { generateText } from "ai";

import { getInnerText } from "~/lib/cheerio";
import { DEFAULT_MODEL } from "~/lib/models";
import { htmlPageReconstruction } from "~/lib/prompts";

(async () => {
  const url =
    "https://jobs.apple.com/en-us/details/200557136/software-engineer?team=SFTWR";
  const htmlSoup = await fetch(url)
    .then((res) => res.text())
    .catch((err) => console.error(err));
  const text = getInnerText(htmlSoup ?? "");
  const jobPostingContents = await generateText({
    model: DEFAULT_MODEL,
    system: htmlPageReconstruction,
    prompt: text,
  });

  console.log(jobPostingContents.text);
})();
