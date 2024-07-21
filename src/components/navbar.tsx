"use client";

import { GitHubButton } from "./gitHubButton";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 text-black">
      <div className="text-3xl font-bold">🤫</div>
      <GitHubButton />
    </nav>
  );
}
