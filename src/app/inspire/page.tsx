"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import API from "@/lib/api";
import {
  MapPin,
  Camera,
  Star,
  CheckCircle,
  Package,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

type Profile = {
  id: string;
  name: string | null;
  username: string;
  bio: string | null;
  location: string | null;
  photo_url: string | null;
  header_url: string | null;
  services_id: string[];
  website: string | null;
  user_type?: string;
};

type PortfolioItem = {
  id: string;
  photo_url: string;
  caption: string | null;
  location: string | null;
  service_id: string;
  owner_id: string;
};

type PackageItem = {
  id: string;
  service_id: string;
  vendor_id: string;
  title: string;
  details: string[] | null;
  price: number;
  image: string | null;
  status: string | null;
};

type PhotographerData = {
  profile: Profile;
  portfolio: PortfolioItem[];
  packages: PackageItem[];
  minPrice: number;
  packageCount: number;
};

function PhotographerCard({ data }: { data: PhotographerData }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [data.portfolio]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Mock data for reviews and events (would come from API in production)
  const reviews = Math.floor(Math.random() * 50) + 10;
  const rating = (4 + Math.random()).toFixed(1);
  const eventsCompleted = Math.floor(Math.random() * 50) + 5;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Left - Avatar and Info */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Avatar */}
            <Avatar className="h-20 w-20 border-2 border-gray-100 flex-shrink-0">
              <AvatarImage
                src={data.profile.photo_url || "/avatar-anatar.png"}
                alt={data.profile.name || data.profile.username}
              />
              <AvatarFallback className="text-2xl bg-gray-100">
                {(data.profile.name ||
                  data.profile.username)?.[0]?.toUpperCase() || "P"}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-gray-900">
                  {data.profile.name || data.profile.username}
                </h3>
                <span className="hidden sm:inline text-gray-400">•</span>
                <div className="flex items-center gap-3 sm:gap-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {rating} ({reviews})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-gray-400" />
                    <span>{eventsCompleted} events</span>
                  </div>
                </div>
              </div>

              {/* Details row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
                {data.profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{data.profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Camera className="h-4 w-4 flex-shrink-0" />
                  <span>Photographer</span>
                </div>
                {data.minPrice > 0 && (
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 flex-shrink-0" />
                    <span>From GH₵{data.minPrice.toLocaleString()}</span>
                  </div>
                )}
                {data.packageCount > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-xs text-purple-600 flex-shrink-0">
                      {data.packageCount}
                    </span>
                    <span>{data.packageCount} Packages</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - View Packages Button */}
          <Link
            href={`/profiles/${data.profile.id}#packages`}
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto bg-purple-400 hover:bg-purple-500 text-white rounded-lg px-6">
              View Packages
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Portfolio Images Carousel */}
      {data.portfolio.length > 0 && (
        <div className="relative px-6 pb-6">
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          )}

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {data.portfolio.slice(0, 8).map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-64 h-44 relative rounded-xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={item.photo_url}
                  alt={item.caption || `Portfolio ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          {data.portfolio.length > 4 && (
            <div className="flex justify-center mt-3">
              <div className="w-16 h-1 bg-gray-300 rounded-full">
                <div
                  className="h-full bg-gray-600 rounded-full transition-all"
                  style={{
                    width: scrollRef.current
                      ? `${Math.min(
                          100,
                          (scrollRef.current.clientWidth /
                            scrollRef.current.scrollWidth) *
                            100
                        )}%`
                      : "25%",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty portfolio placeholder */}
      {data.portfolio.length === 0 && (
        <div className="px-6 pb-6">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 h-44 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center"
              >
                <Camera className="h-8 w-8 text-purple-300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InspirePage() {
  const [photographers, setPhotographers] = useState<PhotographerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhotographers() {
      setLoading(true);
      setError(null);

      try {
        // Fetch all profiles
        const profilesRes = await API.get("/v1/profile/");
        const profiles: Profile[] = profilesRes.data || [];

        // Filter for photographers (or all if user_type not set)
        const photographerProfiles = profiles.filter(
          (p) => !p.user_type || p.user_type === "photographer"
        );

        // Fetch all portfolios once for efficiency
        let allPortfolio: PortfolioItem[] = [];
        try {
          const portfolioRes = await API.get("/v1/portfolio/");
          allPortfolio = portfolioRes.data || [];
        } catch {
          // No portfolios available
        }

        // Fetch portfolio and packages for each photographer
        const photographerData: PhotographerData[] = await Promise.all(
          photographerProfiles.map(async (profile) => {
            let packages: PackageItem[] = [];

            // Filter portfolio for this photographer
            const portfolio = allPortfolio.filter(
              (item) => item.owner_id === profile.id
            );

            try {
              const packagesRes = await API.get(
                `/v1/packages/vendor/${profile.id}`
              );
              packages = packagesRes.data || [];
            } catch {
              // No packages
            }

            const minPrice =
              packages.length > 0
                ? Math.min(...packages.map((p) => p.price))
                : 0;

            return {
              profile,
              portfolio,
              packages,
              minPrice,
              packageCount: packages.length,
            };
          })
        );

        // Sort by portfolio count (photographers with more work first)
        photographerData.sort(
          (a, b) => b.portfolio.length - a.portfolio.length
        );

        setPhotographers(photographerData);
      } catch (err: any) {
        console.error("Failed to fetch photographers:", err);
        setError("Failed to load photographers");
      } finally {
        setLoading(false);
      }
    }

    fetchPhotographers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get Inspired
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover talented photographers and their amazing work. Browse
              portfolios, check out their packages, and find the perfect
              photographer for your next event.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Photographer Cards */}
          {!loading && !error && (
            <div className="space-y-8">
              {photographers.length > 0 ? (
                photographers.map((data) => (
                  <PhotographerCard key={data.profile.id} data={data} />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                  <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    No photographers yet
                  </h2>
                  <p className="text-gray-500">
                    Be the first photographer to join and showcase your work!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
