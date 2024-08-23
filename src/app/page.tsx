import { redirect } from "next/navigation";

import { recordPageHit } from "~/actions/analytics";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await recordPageHit();
  redirect("/generate");
}
