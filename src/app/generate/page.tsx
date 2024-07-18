"use client";

import { useState } from "react";
import { Form } from "./form";
import { CoverLetter } from "./letter";
import { motion } from "framer-motion";

export default function HomePage() {
  const [coverLetter, setCoverLetter] = useState<React.ReactNode>();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 lg:flex-row">
      <motion.div
        className="flex w-full flex-col items-center justify-center lg:w-1/2"
        layout
        transition={{ duration: 0.2 }}
      >
        <h1 className="mb-4 text-center text-4xl font-bold">
          Land your dream job interview 👋
        </h1>
        <h2 className="mb-6 text-center text-xl text-muted-foreground">
          Create impactful, enriched cover letters that highlight unique
          experiences from your resume and LinkedIn profile.
        </h2>
        <Form setCoverLetter={setCoverLetter} />
      </motion.div>
      {coverLetter !== undefined && (
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CoverLetter coverLetter={coverLetter} />
        </motion.div>
      )}
    </main>
  );
}
