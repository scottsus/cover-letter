import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "sonner";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "No clickbait AI cover letter",
  description:
    "AI cover letter, but without the 🐂💩 of sign up and whatever tf clickbait.",
  icons: [
    {
      rel: "icon",
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Toaster className="dark:hidden" position="top-center" />
        <Toaster
          theme="dark"
          className="hidden dark:block"
          position="top-center"
        />
        {children}
      </body>
    </html>
  );
}
