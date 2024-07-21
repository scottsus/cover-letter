import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

export const models = {
  openai: openai("gpt-4o"),
  "claude-3-5-sonnet": anthropic("claude-3-5-sonnet-20240620"),
};

export const DEFAULT_MODEL = models.openai;
