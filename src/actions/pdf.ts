"use server";

import { pdfToText } from "pdf-ts";

export async function readPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  return await pdfToText(uint8Array, { nodeSep: " " });
}
