import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
const SearchClient = React.lazy(() => import("@/components/SearchClient"));

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="pt-20">Loading…</div>}>
        <SearchClient />
      </Suspense>
    </>
  );
}
