"use server";

import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";
import { dezerialize } from "zodex/dist/dezerialize";
import { SzObject, SzType } from "zodex/dist/types";

import { DEFAULT_MODEL } from "~/lib/models";

export async function generateObjectStream<T extends Record<string, SzType>>({
  system,
  prompt,
  zschema,
}: {
  system: string;
  prompt: string;
  zschema: SzObject<T>;
}) {
  // TODO: add model selection
  const model = DEFAULT_MODEL;
  const schema = dezerialize(zschema) as z.Schema<T>;

  const stream = createStreamableValue<T>();
  (async () => {
    const { partialObjectStream } = await streamObject({
      model,
      system,
      prompt,
      schema,
    });
    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject as T);
    }
    stream.done();
  })();

  return { object: stream.value };
}
