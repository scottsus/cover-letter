"use client";

import { CopyIcon, DownloadIcon } from "lucide-react";

export function CoverLetter({ coverLetter }: { coverLetter: React.ReactNode }) {
  return (
    <div className="text-white flex h-[80vh] flex-col rounded-lg bg-primary py-2 shadow-lg">
      <h2 className="m-4 text-sm font-medium">Cover Letter</h2>

      {coverLetter}

      <div className="m-3 ml-auto flex space-x-3 px-4">
        <CopyIcon />
        <DownloadIcon />
      </div>
    </div>
  );
}
