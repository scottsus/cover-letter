import { fetchLinkedInProfile } from "~/actions/linkedIn";

const linkedInUrl = "https://linkedin.com/in/susantoscott";
fetchLinkedInProfile(linkedInUrl)
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
