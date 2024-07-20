import * as cheerio from "cheerio";

export const getInnerText = (htmlSoup: string) => {
  const $ = cheerio.load(htmlSoup);
  const innerText = $("body").text().trim();

  return innerText;
};
