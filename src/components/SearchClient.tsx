"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, CheckCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import Footer from "@/components/Footer";
import API from "@/lib/api";

type APIPackage = {
  id: string;
  service_id: string;
  vendor_id: string;
  title: string;
  details: string[] | null;
  price: number;
  image: string | null;
  status: string | null;
};

type APIProfile = {
  id: string;
  name: string | null;
  username: string;
  photo_url: string | null;
  location: string | null;
};

type PortfolioItem = {
  id: string;
  photo_url: string;
  caption: string | null;
  owner_id: string;
};

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

  // API data states
  const [packages, setPackages] = useState<APIPackage[]>([]);
  const [profiles, setProfiles] = useState<APIProfile[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [packagesRes, profilesRes, portfolioRes] = await Promise.all([
          API.get("/v1/packages/").catch(() => ({ data: [] })),
          API.get("/v1/profile/").catch(() => ({ data: [] })),
          API.get("/v1/portfolio/").catch(() => ({ data: [] })),
        ]);
        setPackages(packagesRes.data || []);
        setProfiles(profilesRes.data || []);
        setPortfolio(portfolioRes.data || []);
      } catch (err) {
        console.log("Could not load search data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const q = searchParams?.get("q") ?? "";
    setQuery(q);
  }, [searchParams]);

  // Filter data based on search query
  const filteredPackages = packages.filter((pkg) =>
    pkg.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProfiles = profiles.filter((p) =>
    (p.name || p.username).toLowerCase().includes(query.toLowerCase())
  );

  const filteredPortfolio = portfolio.filter((item) =>
    (item.caption || "").toLowerCase().includes(query.toLowerCase())
  );

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

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : (
            <>
              {selectedFilter === "packages" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredPackages.length > 0 ? (
                    filteredPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {pkg.image && (
                          <div className="relative h-48 w-full">
                            <Image
                              src={pkg.image}
                              alt={pkg.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-5">
                          <h4 className="font-bold text-lg mb-2">
                            {pkg.title}
                          </h4>
                          {pkg.details && pkg.details.length > 0 && (
                            <ul className="text-gray-600 text-sm mb-4 space-y-1">
                              {pkg.details.slice(0, 3).map((detail, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          <p className="text-2xl font-bold text-purple-600 mb-4">
                            GH₵ {pkg.price.toLocaleString()}
                          </p>
                          <Link href={`/profiles/${pkg.vendor_id}`}>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                              View Vendor
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 text-gray-500">
                      No packages found
                    </div>
                  )}
                </div>
              )}

              {selectedFilter === "photographer" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredProfiles.length > 0 ? (
                    filteredProfiles.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-xl p-4 flex items-center gap-4 shadow"
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={p.photo_url || undefined} />
                          <AvatarFallback>
                            {(p.name || p.username)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/profiles/${p.id}`}
                            className="font-medium text-gray-900 hover:text-purple-600"
                          >
                            {p.name || p.username}
                          </Link>
                          {p.location && (
                            <div className="text-sm text-gray-500">
                              {p.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 text-gray-500">
                      No photographers found
                    </div>
                  )}
                </div>
              )}

              {selectedFilter === "portfolio" && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredPortfolio.length > 0 ? (
                    filteredPortfolio.map((item) => (
                      <Link key={item.id} href={`/profiles/${item.owner_id}`}>
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                          <Image
                            src={item.photo_url}
                            alt={item.caption || "Portfolio"}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-6 text-center py-12 text-gray-500">
                      No portfolio items found
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Trending Portfolios */}
      {!filterApplied && portfolio.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Trending Portfolios</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {portfolio.slice(0, 24).map((item) => (
                <Link key={item.id} href={`/profiles/${item.owner_id}`}>
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <Image
                      src={item.photo_url}
                      alt={item.caption || "Portfolio"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
