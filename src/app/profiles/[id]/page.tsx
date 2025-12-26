"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Star, MapPin } from "lucide-react";
import { photographers } from "@/lib/data";
import ImageLightbox from "@/components/ImageLightbox";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  // read id from the current route params (works for client navigation)
  const params = useParams() as { id?: string } | null;
  const idParam = params?.id ?? "";

  // some links may include a composite id (e.g. "1-0"); normalize by taking the leading segment
  const lookupId = idParam.includes("-") ? idParam.split("-")[0] : idParam;
  const photographer = photographers.find(
    (p) => p.id === idParam || p.id === lookupId
  );

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (!photographer) {
    return (
      <div className="pt-20 text-center">
        <div className="text-3xl mb-4">Photographer not found</div>
        <div className="text-sm text-gray-500">
          Tried id: <strong>{idParam || "(none)"}</strong>
          {lookupId && lookupId !== idParam && (
            <span>
              {" "}
              (lookup: <strong>{lookupId}</strong>)
            </span>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Available photographer ids:{" "}
          {photographers.map((p) => p.id).join(", ")}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <section className="relative h-96 md:h-screen">
        <Image
          src={photographer.coverImage}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl md:text-6xl font-bold">
            {photographer.name}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span>
                {photographer.rating} ({photographer.reviews} reviews)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              <span>{photographer.location}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">About</h2>
          <p className="text-lg text-gray-700">
            15+ years capturing authentic Ghanaian weddings and cultural events.
            Celebrity & brand photographer.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photographer.gallery.map((img, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden shadow-lg relative cursor-pointer"
                onClick={() => setLightboxSrc(img)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setLightboxSrc(img);
                }}
              >
                <Image src={img} alt="Gallery" fill className="object-cover" />
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

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Packages</h2>
          <div className="space-y-6">
            {photographer.packages.map((pkg, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row justify-between items-center gap-6"
              >
                <div>
                  <h3 className="text-2xl font-bold">{pkg.title}</h3>
                  <p className="text-gray-600 mt-2">{pkg.description}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    GH₵ {pkg.price.toLocaleString()}
                  </p>
                  <Button
                    size="lg"
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
