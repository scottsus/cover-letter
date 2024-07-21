export function GitHubButton() {
  const user = "scottsus";
  const repo = "cover-letter";

  return (
    <iframe
      src={`https://ghbtns.com/github-btn.html?user=${user}&repo=${repo}&type=star&count=true&size=large&v=2`}
      width="120"
      height="30"
      title="GitHub"
    ></iframe>
  );
}
