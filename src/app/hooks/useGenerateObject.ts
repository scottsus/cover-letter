import { readStreamableValue } from "ai/rsc";
import { useState } from "react";
import { z } from "zod";
import { SzObject } from "zodex/dist/types";
import { zerialize } from "zodex/dist/zerialize";

import { generateObjectStream } from "~/actions/generateObjectStream";

export function useGenerateObject<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
) {
  const [generation, setGeneration] = useState<T>();
  const [isPending, setIsPending] = useState(false);

  const generateObject = async (system: string, prompt: string) => {
    try {
      setIsPending(true);
      const { object } = await generateObjectStream<T>({
        system,
        prompt,
        zschema: zerialize(schema as z.ZodAny) as unknown as SzObject<T>,
      });
      for await (const partialObject of readStreamableValue(object)) {
        if (partialObject) {
          setGeneration(partialObject);
        }
      }
    } catch (err) {
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { generateObject, generation, isPending };
}
