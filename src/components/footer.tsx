"use client";

export function Footer() {
  const githubProfile = "x.com/susantoscott";

  return (
    <footer className="bg-gray-100 flex items-center justify-center p-4 text-muted-foreground">
      <p>
        Built with 🫶 by{" "}
        <a href={githubProfile} className="text-black hover:underline">
          scottsus
        </a>{" "}
        in San Francisco.
      </p>
    </footer>
  );
}
