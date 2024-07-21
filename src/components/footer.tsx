"use client";

export function Footer() {
  const xProfile = "https://x.com/susantoscott";

  return (
    <footer className="flex items-center justify-center p-4 text-muted-foreground">
      <p>
        Built with 🫶 by{" "}
        <a
          href={xProfile}
          target="_blank"
          className="text-black hover:underline"
        >
          scottsus
        </a>{" "}
        in San Francisco.
      </p>
    </footer>
  );
}
