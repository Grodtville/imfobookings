"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackageDetailsModal, {
  PackageData,
} from "@/components/PackageDetailsModal";
import PackageCard, { PackageCardData } from "@/components/PackageCard";
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

  // API portfolio data
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  // API packages data
  const [apiPackages, setApiPackages] = useState<APIPackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);

  // Package modal state
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(
    null
  );
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

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
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-500">Loading packages...</span>
            </div>
          ) : apiPackages.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apiPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  onViewDetails={(p) => {
                    setSelectedPackage(p as PackageData);
                    setIsPackageModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No packages available
            </div>
          )}
        </div>
      </section>

      <PackageDetailsModal
        isOpen={isPackageModalOpen}
        onClose={() => {
          setIsPackageModalOpen(false);
          setSelectedPackage(null);
        }}
        packageData={selectedPackage}
      />

      <Footer />
    </>
  );
}
