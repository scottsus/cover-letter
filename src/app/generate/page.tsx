"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { Footer } from "~/components/footer";
import { Navbar } from "~/components/navbar";

import { Form } from "./form";
import { CoverLetter } from "./letter";

export default function HomePage() {
  const [coverLetter, setCoverLetter] = useState("");

  return (
    <div className="flex min-h-screen flex-col px-8 py-4">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center p-6 lg:flex-row lg:space-x-6">
        <motion.div
          className="mb-8 flex w-full flex-col items-center justify-center lg:w-1/2"
          layout
          transition={{ duration: 0.2 }}
        >
          <h1 className="mb-4 text-center text-4xl font-bold">
            Land your dream job interview 👋
          </h1>
          <h2 className="mb-6 text-center text-xl text-muted-foreground">
            AI cover letter, but without the 🐂💩 of sign up and whatever tf
            clickbait. Shut up and generate one.
          </h2>
          <Form setCoverLetter={setCoverLetter} />
        </motion.div>
        {coverLetter && (
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CoverLetter
              coverLetter={coverLetter}
              setCoverLetter={setCoverLetter}
            />
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
