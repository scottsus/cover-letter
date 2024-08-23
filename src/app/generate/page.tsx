import { Footer } from "~/components/footer";
import { Navbar } from "~/components/navbar";

import { MainArea } from "./main";
import { getPageHits } from "~/actions/analytics";

export const dynamic = "force-dynamic";

export const maxDuration = 40;

export default async function HomePage() {
  const numHits = await getPageHits();

  return (
    <div className="flex min-h-screen flex-col px-2 py-4 lg:px-8">
      <Navbar />
      <MainArea numHits={numHits ?? 0} />
      <Footer />
    </div>
  );
}
