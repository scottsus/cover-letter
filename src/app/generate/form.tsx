"use client";

import { useLocalStorage, useLocalStorageFile } from "../hooks/useLocalStorage";
import useWindowSize from "../hooks/useWindowSize";
import { readStreamableValue } from "ai/rsc";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import UploadFileInput from "~/components/uploadFileInput";

import { recordPageGeneration } from "~/actions/analytics";
import { handleCoverLetter } from "~/actions/handleCoverLetter";

export function Form({
  setCoverLetter,
}: {
  setCoverLetter: (coverLetter: string) => void;
}) {
  const { isMobile } = useWindowSize();
  const [resume, setResume] = useLocalStorageFile("resume");
  const [linkedInUrl, setLinkedInUrl] = useLocalStorage("linkedInUrl", "");
  const [jobPostingUrl, setJobPostingUrl] = useLocalStorage(
    "jobPostingUrl",
    "",
  );
  const [isPending, setIsPending] = useState(false);
  const [hasGeneratedCoverLetter, setHasGeneratedCoverLetter] = useState(false);

  const uploadResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const resume = e.target.files?.[0];
    if (resume) {
      setResume(resume);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume && !linkedInUrl) {
      toast.error("Need at least one of resume or LinkedIn URL!");
      return;
    }

    const formData = new FormData();
    if (resume) {
      formData.append("resume", resume);
    }
    formData.append("linkedInUrl", linkedInUrl);
    formData.append("jobPostingUrl", jobPostingUrl);

    try {
      setIsPending(true);
      setHasGeneratedCoverLetter(true);
      recordPageGeneration();

      const res = await handleCoverLetter(formData);
      if (!res) {
        toast.error(`Unknown error. Please try again.`);
        return;
      }

      const { object } = res;
      for await (const partialObject of readStreamableValue(object)) {
        if (partialObject) {
          setCoverLetter(partialObject.content);
        }
      }
    } catch (err) {
      toast.error(`Error generating cover letter: ${err}. Please try again.`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-3/4 space-y-6 rounded-lg p-8 shadow-xl lg:w-full">
      <div>
        <h2 className="mb-4 text-2xl font-bold">About 🫵</h2>
        <div className="my-2 flex flex-col gap-2 md:gap-3">
          <div className="flex flex-row gap-x-2 md:gap-x-4">
            <div className="w-1/2">
              <Label htmlFor="resume">Resume</Label>
              <UploadFileInput file={resume} uploadFile={uploadResume} />
            </div>
            <div className="w-1/2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                type="text"
                id="linkedin"
                placeholder={isMobile ? "LinkedIn" : "Enter LinkedIn URL"}
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="job-posting">Job Posting</Label>
            <Input
              type="text"
              id="job-posting"
              placeholder="Enter job posting URL"
              value={jobPostingUrl}
              onChange={(e) => setJobPostingUrl(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-end">
          <Button
            className={`${isMobile && "mx-auto"} mt-2`}
            onClick={handleSubmit}
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <ClipLoader size={16} color="white" className="mr-2" />
                Generating...
              </>
            ) : !hasGeneratedCoverLetter ? (
              "Generate Cover Letter ✨"
            ) : (
              "Regenerate Cover Letter ✨"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
