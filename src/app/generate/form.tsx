"use client";

import { toast } from "sonner";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { getCoverLetterGeneration } from "~/actions/generate";
import { sleep } from "~/lib/utils";

export function Form({
  setCoverLetter,
}: {
  setCoverLetter: (coverLetter: React.ReactNode) => void;
}) {
  const [file, setFile] = useState<File>();
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [jobPostingUrl, setJobPostingUrl] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFile = e.target.files?.[0];
    if (inputFile) {
      setFile(inputFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !linkedInUrl) {
      toast.error("Need at least one of resume or LinkedIn URL!");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("linkedInUrl", linkedInUrl);
    formData.append("jobPostingUrl:", jobPostingUrl);

    setCoverLetter(await getCoverLetterGeneration(formData));

    // TODO: actual pending
    setIsPending(true);
    await sleep(10_000);
    setIsPending(false);
  };

  return (
    <div className="space-y-6 rounded-lg p-8 shadow-xl">
      <div>
        <h2 className="mb-4 text-2xl font-bold">About 🫵</h2>
        <div className="mb-2 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="resume">Resume (& OPTIONAL: other materials)</Label>
            <Input type="file" id="resume" onChange={handleInputFile} />
          </div>
          <div>
            <Label htmlFor="linkedin">OPTIONAL: LinkedIn Profile</Label>
            <Input
              type="text"
              id="linkedin"
              placeholder="Enter LinkedIn URL"
              onChange={(e) => setLinkedInUrl(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="job-posting">Job Posting</Label>
            <Input
              type="text"
              id="job-posting"
              placeholder="Enter job posting URL"
              onChange={(e) => setJobPostingUrl(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} type="submit" disabled={isPending}>
            Generate Cover Letter 🚀
          </Button>
        </div>
      </div>
    </div>
  );
}
