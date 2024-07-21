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
import { handleGeneration } from "~/actions/handleGeneration";

export function Form({
  setContent,
}: {
  setContent: (content: string) => void;
}) {
  const { isMobile, isDesktop } = useWindowSize();
  const [isModeEmail, setIsModeEmail] = useState(false); // email vs cover letter
  const [resume, setResume] = useLocalStorageFile("resume");
  const [linkedInUrl, setLinkedInUrl] = useLocalStorage("linkedInUrl", "");
  const [jobPostingUrl, setJobPostingUrl] = useLocalStorage(
    "jobPostingUrl",
    "",
  );
  const [isPending, setIsPending] = useState(false);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);

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
    formData.append("isModeEmail", isModeEmail.toString());

    try {
      setIsPending(true);
      setHasGeneratedContent(true);
      recordPageGeneration();

      const res = await handleGeneration({ formData, isModeEmail });
      if (!res) {
        toast.error(`Unknown error. Please try again.`);
        return;
      }

      const { object } = res;
      for await (const partialObject of readStreamableValue(object)) {
        if (partialObject) {
          setContent(partialObject.content);
        }
      }
    } catch (err) {
      toast.error(`Error generating cover letter: ${err}. Please try again.`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full space-y-6 rounded-lg p-8 shadow-xl sm:w-3/4 lg:w-full">
      <div>
        <h2 className="mb-4 text-lg font-bold md:text-2xl">About 🫵</h2>
        <div className="my-2 flex flex-col gap-2 md:gap-3">
          <div className="flex flex-row gap-x-2 md:gap-x-4">
            {isDesktop && (
              <div className="w-1/2">
                <Label htmlFor="resume">Resume</Label>
                <UploadFileInput file={resume} uploadFile={uploadResume} />
              </div>
            )}
            <div className={`${isDesktop ? "w-1/2" : "w-full"}`}>
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
        <div className="flex flex-col items-center md:flex-row">
          <div className="rounded flex h-8 items-center justify-center space-x-1 rounded-lg border border-secondary px-1 text-xs">
            <Button
              className={`${
                !isModeEmail ? "bg-primary" : "bg-transparent"
              } h-6 w-6`}
              onClick={() => setIsModeEmail(false)}
            >
              📜
            </Button>
            <Button
              className={`${
                isModeEmail ? "bg-primary" : "bg-transparent"
              } h-6 w-6`}
              onClick={() => setIsModeEmail(true)}
            >
              📤
            </Button>
          </div>
          <Button
            className={`${isMobile ? "mx-auto" : "ml-auto mr-0"} mt-2`}
            onClick={handleSubmit}
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <ClipLoader size={16} color="white" className="mr-2" />
                Generating...
              </>
            ) : !hasGeneratedContent ? (
              `Generate ${isModeEmail ? "Email" : "Cover Letter"} ✨`
            ) : (
              `Regenerate ${isModeEmail ? "Email" : "Cover Letter"} ✨`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
