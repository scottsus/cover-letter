"use server";

import fs from "fs/promises";
import path from "path";

import { pretty } from "~/lib/utils";

export async function fetchLinkedInProfileWithCache(linkedInUrl: string) {
  const profilesDir = path.join(process.cwd(), "profiles");
  const fileName = `${Buffer.from(linkedInUrl).toString("base64")}.json`;
  const filePath = path.join(profilesDir, fileName);

  try {
    const profile = await fs.readFile(filePath, "utf-8");

    return profile;
  } catch (err) {
    const newProfile = await fetchLinkedInProfile(linkedInUrl);
    await fs.mkdir(profilesDir, { recursive: true });
    await fs.writeFile(filePath, newProfile);

    return newProfile;
  }
}

export async function fetchLinkedInProfile(linkedInUrl: string) {
  const apiKey = process.env.PROXYCURL_API_KEY ?? "";
  const apiUrl = "https://nubela.co/proxycurl/api/v2/linkedin";

  const params = new URLSearchParams({
    linkedin_profile_url: linkedInUrl,
  });
  const response = await fetch(`${apiUrl}?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    console.error(`LinkedIn: unable to fetch profile [${linkedInUrl}]`);
    return "";
  }

  const obj = await response.json();
  const profile: LinkedInProfile = {
    first_name: obj.first_name,
    last_name: obj.last_name,
    occupation: obj.occupation,
    headline: obj.headline,
    summary: obj.summary,
    experiences: obj.experiences.map((exp: any) => ({
      title: exp.title,
      description: exp.description,
    })),
    education: obj.education.map((edu: any) => ({
      degree_name: edu.degree_name,
      school: edu.school,
      description: edu.description,
    })),
    accomplishments: [
      ...obj.accomplishment_organisations.map((acc: any) => ({
        title: acc.title,
        description: acc.description,
      })),
      ...obj.accomplishment_honors_awards.map((acc: any) => ({
        title: acc.title,
        description: acc.description,
      })),
    ],
    courses: obj.accomplishment_courses.map((acc: any) => acc.name),
    volunteer_work: obj.volunteer_work.map((vol: any) => ({
      title: vol.title,
      description: vol.description,
    })),
    certifications: obj.certifications.map((cert: any) => cert.name),
  };

  const prettified = pretty(profile);
  if (typeof prettified !== "string") {
    return "";
  }
  return prettified;
}

interface LinkedInProfile {
  first_name: string;
  last_name: string;
  occupation: string;
  headline: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  accomplishments: Accomplishment[];
  courses: string[];
  volunteer_work: VolunteerWork[];
  certifications: Certification[];
}

interface Experience {
  title: string;
  description: string | null;
}

interface Education {
  degree_name: string;
  school: string;
  description: string | null;
}

interface Accomplishment {
  title: string;
  description: string | null;
}

interface VolunteerWork {
  title: string;
  description: string | null;
}

interface Certification {
  name: string;
  description: string | null;
}
