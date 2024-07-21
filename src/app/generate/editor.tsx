"use client";

import { CopyButton } from "~/components/copyButton";
import { DownloadPdfButton } from "~/components/downloadPdfButton";

export function Editor({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) {
  return (
    <div className="flex h-[80vh] flex-col rounded-lg bg-primary py-2 text-white shadow-lg">
      <h2 className="text-md m-4 px-4">Content</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow overflow-y-scroll whitespace-pre-line p-4 text-sm text-black"
      />

      <div className="m-3 ml-auto flex space-x-3 px-8">
        <CopyButton />
        <DownloadPdfButton text={content} fileName="Cover-Letter.pdf" />
      </div>
    </div>
  );
}
