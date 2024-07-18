"use client";

import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react";
import { useState } from "react";
import { sleep } from "~/lib/utils";

export function CoverLetter({ coverLetter }: { coverLetter: React.ReactNode }) {
  const [copyIsClicked, setCopyIsClicked] = useState(false);
  const [downloadIsClicked, setDownloadIsClicked] = useState(false);

  const copyToClipboard = async () => {
    const textareaElement = document.querySelector("textarea");
    if (textareaElement) {
      navigator.clipboard.writeText(textareaElement.value);
    }
    setCopyIsClicked(true);
    await sleep(2000);
    setCopyIsClicked(false);
  };

  const downloadFile = async () => {
    // TODO: download logic here
    setDownloadIsClicked(true);
    await sleep(2000);
    setDownloadIsClicked(false);
  };

  return (
    <div className="text-white flex h-[80vh] flex-col rounded-lg bg-primary py-2 shadow-lg">
      <h2 className="text-md m-4 px-4">Cover Letter</h2>

      {coverLetter}

      <div className="m-3 ml-auto flex space-x-3 px-8">
        {!copyIsClicked ? (
          <CopyIcon
            size={40}
            className="m-1 cursor-pointer rounded-lg p-2 transition-all hover:bg-secondary"
            onClick={copyToClipboard}
          />
        ) : (
          <CheckIcon color="green" size={40} className="m-1 rounded-lg p-2" />
        )}
        {!downloadIsClicked ? (
          <DownloadIcon
            size={40}
            className="m-1 cursor-pointer rounded-lg p-2 transition-all hover:bg-secondary"
            onClick={downloadFile}
          />
        ) : (
          <CheckIcon color="green" size={40} className="m-1 rounded-lg p-2" />
        )}
      </div>
    </div>
  );
}
