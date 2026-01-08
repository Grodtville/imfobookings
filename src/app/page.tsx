"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import ImageLightbox from "@/components/ImageLightbox";
import Footer from "@/components/Footer";
import API from "@/lib/api";

type PortfolioItem = {
  id: string;
  photo_url: string;
  caption: string | null;
  owner_id: string;
};

type APIPackage = {
  id: string;
  service_id: string;
  vendor_id: string;
  title: string;
  details: string[] | null;
  price: number;
  image: string | null;
  status: string | null;
  vendor_name?: string;
};

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // API portfolio data
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  // API packages data
  const [apiPackages, setApiPackages] = useState<APIPackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);

  // Fetch portfolio items from API
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await API.get("/v1/portfolio/");
        // Get up to 15 random items
        const items = res.data || [];
        const shuffled = items.sort(() => 0.5 - Math.random());
        setPortfolioItems(shuffled.slice(0, 15));
      } catch (err) {
        console.log("Could not load portfolio");
      } finally {
        setPortfolioLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  // Fetch packages from API
  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await API.get("/v1/packages/");
        const items = res.data || [];
        // Shuffle and get up to 6 random packages
        const shuffled = items.sort(() => 0.5 - Math.random());
        setApiPackages(shuffled.slice(0, 6));
      } catch (err) {
        console.log("Could not load packages");
      } finally {
        setPackagesLoading(false);
      }
    }
    fetchPackages();
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        <Image
          src="/hero.png"
          alt="Wedding rings"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Every story deserves the
            <br />
            right <span className="text-purple-400">lens.</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-200">
            Discover photographers who capture your love, laughter and life’s
            biggest moments.
            <br />
            Your story. Captured forever.
          </p>
          <div className="flex flex-col sm:flex-row max-w-2xl mx-auto gap-3">
            <Input
              type="text"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
                }
              }}
              className="h-12 bg-white/95 text-gray-900 rounded-full px-6"
            />
            <Button
              size="lg"
              className="h-12 bg-purple-600 hover:bg-purple-700 rounded-full px-8"
              onClick={() =>
                router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
              }
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Packages
          </h2>
          {packagesLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading packages...
            </div>
          ) : apiPackages.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apiPackages.map((pkg) => (
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
                    <h4 className="font-bold text-lg mb-2">{pkg.title}</h4>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No packages available
            </div>
          )}
        </div>
      </section>

      {/* Portfolio Shots */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Portfolio
          </h2>
          {portfolioLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading portfolio...
            </div>
          ) : portfolioItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-md cursor-pointer group"
                  onClick={() => setLightboxSrc(item.photo_url)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setLightboxSrc(item.photo_url);
                  }}
                >
                  <Image
                    src={item.photo_url}
                    alt={item.caption || "Portfolio"}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {item.caption && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-white text-sm line-clamp-2">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Fallback to static images if no API data
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                <div
                  key={num}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-md cursor-pointer"
                  onClick={() => setLightboxSrc(`/portfolio-${num}.png`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setLightboxSrc(`/portfolio-${num}.png`);
                  }}
                >
                  <Image
                    src={`/portfolio-${num}.png`}
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

      <ImageLightbox
        open={!!lightboxSrc}
        onOpenChange={(open) => {
          if (!open) setLightboxSrc(null);
        }}
        imageSrc={lightboxSrc || ""}
      />

      <Footer />
    </>
  );
}
