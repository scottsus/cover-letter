import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function pretty(json: any) {
  try {
    return JSON.stringify(json, null, 2);
  } catch (err) {
    console.error("Error prettifying", json);
    return json;
  }
}
