import { Suspense } from "react";
import HomePageClient from "./HomePageClient";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-selected" />
        </div>
      }
    >
      <HomePageClient />
    </Suspense>
  );
}
