import { redirect } from "next/navigation";

import { recordPageHit } from "~/actions/analytics";

export const dynamic = "force-dynamic";

export default function HomePage() {
  recordPageHit();
  redirect("/generate");
}
