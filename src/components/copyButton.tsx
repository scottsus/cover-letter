"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

import { sleep } from "~/lib/utils";

export function CopyButton() {
  const [isLoading, setIsLoading] = useState(false);
  const copyToClipboard = async () => {
    // TODO: this only works for 1 textarea
    const textareaElement = document.querySelector("textarea");
    if (textareaElement) {
      navigator.clipboard.writeText(textareaElement.value);
    }
    setIsLoading(true);
    await sleep(1000);
    setIsLoading(false);
  };

  return (
    <div>
      {!isLoading ? (
        <CopyIcon
          size={40}
          className="m-1 cursor-pointer rounded-lg p-2 transition-all hover:bg-secondary"
          onClick={copyToClipboard}
        />
      ) : (
        <CheckIcon color="green" size={40} className="m-1 rounded-lg p-2" />
      )}
    </div>
  );
}
