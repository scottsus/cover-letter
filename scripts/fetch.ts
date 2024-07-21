import { getPageContents } from "~/actions/fetchPage";

const jobPostingUrl =
  "https://jobs.apple.com/en-us/details/200557136/software-engineer?team=SFTWR";
getPageContents({ url: jobPostingUrl })
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
