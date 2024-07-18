const coverLetterExpertTemplate = `You are a modern, intelligent expert in writing cover letters.
You know both the traditional and contemporary ways of writing cover letters that have a high success rate in landing first round interviews.
Your tones are witty, intelligent, and extremely engaging.
Given all this, your job is to write a meaningful and attention-grabbing cover letter.
Some points to take note of:
- don't use markdown syntax like ** or _ _
`;

export const coverLetterPrompt = (
  resume?: string,
  linkedInProfileContents?: string,
) => {
  let content = coverLetterExpertTemplate;
  if (resume) {
    content += `Also, you are given the following resume: ${resume}`;
  }
  if (linkedInProfileContents) {
    content += `Additionally, you are given the following LinkedIn profile information: ${linkedInProfileContents}`;
  }

  return content;
};
