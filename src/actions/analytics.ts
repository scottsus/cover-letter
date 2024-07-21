"use server";

import { eq } from "drizzle-orm";
import { analytics } from "drizzle/schemas";

import { db } from "~/server/db";

export async function getPageHits() {
  try {
    const [theOnlyRecord] = await db.select().from(analytics);
    if (!theOnlyRecord) {
      throw new Error("The only record is gone ☹️");
    }

    return theOnlyRecord.numHits;
  } catch (err) {
    console.error("getPageHits:", err);
  }
}

export async function recordPageHit() {
  try {
    const [theOnlyRecord] = await db.select().from(analytics);
    if (!theOnlyRecord) {
      throw new Error("The only record is gone ☹️");
    }

    await db
      .update(analytics)
      .set({ numHits: theOnlyRecord.numHits! + 1 })
      .where(eq(analytics.id, theOnlyRecord.id));
  } catch (err) {
    console.error("recordPageHits:", err);
  }
}

export async function getPageGenerations() {
  try {
    const [theOnlyRecord] = await db.select().from(analytics);
    if (!theOnlyRecord) {
      throw new Error("The only record is gone ☹️");
    }

    return theOnlyRecord.numGenerations;
  } catch (err) {
    console.error("getPageGenerations:", err);
  }
}

export async function recordPageGeneration() {
  try {
    const [theOnlyRecord] = await db.select().from(analytics);
    if (!theOnlyRecord) {
      throw new Error("The only record is gone ☹️");
    }

    await db
      .update(analytics)
      .set({ numGenerations: theOnlyRecord.numGenerations! + 1 })
      .where(eq(analytics.id, theOnlyRecord.id));
  } catch (err) {
    console.error("recordPageGeneration:", err);
  }
}
