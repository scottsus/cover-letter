import { redirect } from "next/navigation";

import { recordPageHit } from "~/actions/analytics";

export default function HomePage() {
  recordPageHit();
  redirect("/generate");
}
