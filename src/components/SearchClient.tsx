"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import PackageCard from "@/components/PackageCard";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const trendingPackages = [
  {
    id: "1",
    title: "The Bronze Wedding",
    photographer: "Anatar Joseph",
    photographerAvatar: "/avatar-anatar.png",
    price: 5000,
    rating: 5.0,
    reviews: 30,
    eventsCompleted: 33,
    location: "Abossey-Okai, Accra",
    category: "White Wedding",
    features: [
      "6 Hours Photography Coverage",
      "High-res images",
      "Online gallery",
    ],
    description:
      "A warm, cinematic wedding package focused on cultural ceremonies.",
  },
  {
    id: "2",
    title: "Golden Moments",
    photographer: "Nana Ama",
    photographerAvatar: "/avatar-placeholder.png",
    price: 4200,
    rating: 4.8,
    reviews: 18,
    eventsCompleted: 20,
    location: "Kumasi",
    category: "Engagement",
    features: ["4 Hours Coverage", "2 Photographers", "Album"],
    description: "Sweet engagement sessions with candid and posed coverage.",
  },
  {
    id: "3",
    title: "Cultural Highlights",
    photographer: "Kojo Mensah",
    photographerAvatar: "/avatar-placeholder.png",
    price: 3500,
    rating: 4.7,
    reviews: 12,
    eventsCompleted: 15,
    location: "Takoradi",
    category: "Event",
    features: ["3 Hours Coverage", "Highlight Reel"],
    description: "Perfect for cultural events and intimate celebrations.",
  },
];

const mockPhotographers = [
  {
    id: "p1",
    name: "Anatar Joseph",
    avatar: "/avatar-anatar.png",
    location: "Abossey-Okai, Accra",
    rating: 4.9,
  },
  {
    id: "p2",
    name: "Nana Ama",
    avatar: "/avatar-placeholder.png",
    location: "Kumasi",
    rating: 4.7,
  },
  {
    id: "p3",
    name: "Kojo Mensah",
    avatar: "/avatar-placeholder.png",
    location: "Takoradi",
    rating: 4.8,
  },
];

const portfolioShots = Array.from(
  { length: 24 },
  (_, i) => `/portfolio-${(i % 15) + 1}.png`
);

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams?.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "packages" | "photographer" | "portfolio"
  >("packages");
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    const q = searchParams?.get("q") ?? "";
    setQuery(q);
  }, [searchParams]);

  return (
    <>
      {/* Hero Search Bar */}
      <section className="pt-20 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-8 relative">
            <div className="relative">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setShowFilters((s) => !s)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>

              {showFilters && (
                <div className="absolute mt-2 left-0 w-52 bg-white rounded-lg shadow-lg border p-3 z-20">
                  <div className="space-y-2">
                    <button
                      className={`w-full text-left px-3 py-2 rounded ${
                        selectedFilter === "packages"
                          ? "bg-purple-50 text-purple-600"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSelectedFilter("packages");
                        setFilterApplied(true);
                        setShowFilters(false);
                      }}
                    >
                      Packages
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 rounded ${
                        selectedFilter === "photographer"
                          ? "bg-purple-50 text-purple-600"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSelectedFilter("photographer");
                        setFilterApplied(true);
                        setShowFilters(false);
                      }}
                    >
                      Photographer
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 rounded ${
                        selectedFilter === "portfolio"
                          ? "bg-purple-50 text-purple-600"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSelectedFilter("portfolio");
                        setFilterApplied(true);
                        setShowFilters(false);
                      }}
                    >
                      Portfolio
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 relative">
              <Input
                placeholder="What are you looking for?"
                className="pl-10 h-12 rounded-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                }}
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <Button
              className="bg-purple-600 text-white h-12 px-8 rounded-full"
              onClick={() =>
                router.push(`/search?q=${encodeURIComponent(query)}`)
              }
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
            <Button variant="ghost" className="text-purple-600">
              Recommended
            </Button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            {selectedFilter === "packages" && "Packages"}
            {selectedFilter === "photographer" && "Photographers"}
            {selectedFilter === "portfolio" && "Portfolio"}
          </h2>

          {selectedFilter === "packages" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trendingPackages
                .filter((pkg) =>
                  pkg.title.toLowerCase().includes(query.toLowerCase())
                )
                .map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} onOpenModal={() => {}} />
                ))}
            </div>
          )}

          {selectedFilter === "photographer" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockPhotographers
                .filter((p) =>
                  p.name.toLowerCase().includes(query.toLowerCase())
                )
                .map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl p-4 flex items-center gap-4 shadow"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={p.avatar} />
                      <AvatarFallback>
                        {p.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href={`/profiles/${p.id}`}
                        className="font-medium text-gray-900"
                      >
                        {p.name}
                      </Link>
                      <div className="text-sm text-gray-500">
                        {p.location} • {p.rating}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {selectedFilter === "portfolio" && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {portfolioShots
                .filter((src) =>
                  src.toLowerCase().includes(query.toLowerCase())
                )
                .map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-2xl overflow-hidden shadow-md"
                  >
                    <Image
                      src={src}
                      alt="Portfolio"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Portfolios */}
      {!filterApplied && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Trending Portfolios</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 24 }, (_, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-md"
                >
                  <Image
                    src="/portfolio-shot.png"
                    alt="Portfolio"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-purple-900 text-white py-12">
        {/* Footer placeholder */}
      </footer>
    </>
  );
}
