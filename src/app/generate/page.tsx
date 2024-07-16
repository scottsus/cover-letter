import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-4xl px-4 py-12 md:px-6 lg:px-8">
        <h1 className="mb-4 text-center text-4xl font-bold">
          Land your dream job interview 👋
        </h1>
        <h2 className="text-muted-foreground mb-6 text-center text-xl">
          Create impactful, enriched cover letters that highlight unique
          experiences from your resume and LinkedIn profile.
        </h2>
        <form className="space-y-6 rounded-lg p-8 shadow-xl">
          <div>
            <h2 className="mb-4 text-2xl font-bold">About 🫵</h2>
            <div className="mb-2 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="resume">
                  Resume (& OPTIONAL: other materials)
                </Label>
                <Input type="file" id="resume" />
              </div>
              <div>
                <Label htmlFor="linkedin">OPTIONAL: LinkedIn Profile</Label>
                <Input
                  type="text"
                  id="linkedin"
                  placeholder="Enter LinkedIn profile URL"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="job-posting">Job Posting</Label>
                <Input
                  type="text"
                  id="job-posting"
                  placeholder="Enter job posting URL"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-end">
              <Button>Generate Cover Letter 🚀</Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
