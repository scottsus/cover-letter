"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { Editor } from "./editor";
import { Form } from "./form";

export function MainArea({ numHits }: { numHits: number }) {
  const [content, setContent] = useState("");

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6 lg:flex-row lg:space-x-6">
      <motion.div
        className="mb-8 flex w-full flex-col items-center justify-center lg:w-1/2"
        layout
        transition={{ duration: 0.2 }}
      >
        <h1 className="mb-4 text-center text-2xl font-bold md:text-4xl">
          Land your dream job interview 👋
        </h1>
        <h2 className="text-md mb-6 text-center text-muted-foreground md:text-xl">
          AI cover letter, but without the 🐂💩 of sign up and whatever tf
          clickbait. Shut up and generate one.
        </h2>
        <Form setContent={setContent} />
        <p className="md:text-md mt-5 text-center text-sm text-muted-foreground">
          There were {numHits.toLocaleString()} other people who generated a
          cover letter this month.
        </p>
      </motion.div>
      {content && (
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Editor content={content} setContent={setContent} />
        </motion.div>
      )}
    </main>
  );
}
