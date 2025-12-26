"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, CheckCircle, Calendar, MapPin } from "lucide-react";
import PackageCard from "@/components/PackageCard";
import Navbar from "@/components/Navbar";
import { photographers } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogTrigger if using trigger button
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ImageLightbox from "@/components/ImageLightbox";
import Footer from "@/components/Footer";

// Rich mock data (photographers + packages

// Local Package type used by this page
type Package = {
  id: string;
  photographer: string;
  title: string;
  price: number;
  rating: number;
  reviews?: number;
  description?: string;
  features: string[];
  eventsCompleted?: number;
  location?: string;
  photographerAvatar?: string;
  packagesAvailable?: number;
};

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const filteredPackages = photographers.flatMap((p) =>
    p.packages.map((pkg, j) => ({
      id: p.id,
      photographer: p.name,
      title: pkg.title,
      price: pkg.price,
      rating: p.rating,
      reviews: p.reviews,
      description: pkg.description,
      features: pkg.description.split(",").map((s) => s.trim()),
      eventsCompleted: p.reviews ?? 0,
      location: p.location,
      category: pkg.title.includes("Wedding") ? "White Wedding" : "Other",
      photographerAvatar: pkg.photographerAvatar,
      packagesAvailable: pkg.packagesAvailable,
    }))
  );

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

      {/* Trending Packages */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Packages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg, i) => (
              <PackageCard
                key={`${pkg.id}-${i}`}
                pkg={pkg}
                onOpenModal={setSelectedPackage}
              />
            ))}
          </div>
        </div>
        <Dialog
          open={!!selectedPackage}
          onOpenChange={() => setSelectedPackage(null)}
        >
          <DialogContent className="w-2/3 max-w-7xl p-0 overflow-hidden rounded-2xl">
            {selectedPackage && (
              <>
                <div className="grid md:grid-cols-3">
                  {/* Left: Large Image (2/3 width on md+) */}
                  <div className="md:col-span-2 relative h-96 md:h-full">
                    {/* Replace with your ring exchange e PNG (warm bokeh, cultural crown) */}
                    <Image
                      src="/package-detail.png"
                      alt={selectedPackage!.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Right: Details (1/3 width) */}
                  <div className="p-8 flex flex-col justify-between bg-white">
                    {/* Close Button (built-in Shadcn style) */}
                    <DialogHeader className="pb-4">
                      <DialogTitle className="text-2xl font-bold pr-8">
                        {selectedPackage!.title}
                      </DialogTitle>
                    </DialogHeader>

                    {/* Price & Features */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Base Price</p>
                      <p className="text-4xl font-bold text-purple-600 mb-6">
                        GH₵ {selectedPackage!.price.toLocaleString()}
                      </p>

                      <ul className="space-y-4 mb-8">
                        {selectedPackage!.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Book Button */}
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold rounded-full mb-8">
                      Book Package
                    </Button>

                    {/* Photographer Spotlight (bottom) */}
                    <div className="border-t pt-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 ring-4 ring-green-500 ring-offset-2">
                          <AvatarImage
                            src={
                              selectedPackage!.photographerAvatar ||
                              "/avatar-anatar.png"
                            }
                          />
                          <AvatarFallback>
                            {selectedPackage!.photographer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-bold text-purple-600">
                            {selectedPackage!.photographer}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {selectedPackage!.rating} (30)
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-gray-500" />
                              {selectedPackage!.eventsCompleted} events
                              completed
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <MapPin className="h-4 w-4" />
                            {selectedPackage!.location}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Photographer • {selectedPackage!.packagesAvailable}{" "}
                            Packages available
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* About Section (below image on mobile, right on desktop) */}
                    <div className="md:hidden mt-8 border-t pt-6">
                      <h4 className="font-bold mb-2">About this package</h4>
                      <p className="text-gray-700 text-sm">
                        {selectedPackage!.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* About on Desktop (below image, full width under grid) */}
                <div className="hidden md:block p-8 bg-gray-50 border-t">
                  <h4 className="font-bold mb-2">About this package</h4>
                  <p className="text-gray-700">
                    {selectedPackage!.description}
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </section>

      {/* Portfolio Shots */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Portfolio
          </h2>
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
