"use client";

import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useWindowSize from "~/app/hooks/useWindowSize";

export default function UploadFileInput({
  file,
  uploadFile,
}: {
  file: File | null;
  uploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { isMobile } = useWindowSize();
  const [buttonText, setButtonText] = useState("Upload");

  useEffect(() => {
    setButtonText(file?.name ?? "Upload File");
  }, [file]);
  return (
    <div className="relative">
      <Input type="file" id="resume" className="hidden" onChange={uploadFile} />
      <Button
        type="button"
        variant="outline"
        className="absolute inset-0 w-full truncate text-left font-normal text-muted-foreground"
        onClick={() => document.getElementById("resume")?.click()}
      >
        {isMobile ? "Resume" : buttonText}
      </Button>
    </div>
  );
}
