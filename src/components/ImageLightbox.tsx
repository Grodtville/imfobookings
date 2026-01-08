"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Camera,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

// Original single-image props
type SingleImageProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  photographer?: {
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
    bookings: number;
    location: string;
    packages: number;
  } | null;
  views?: number | null;
  postedDate?: string | null;
};

// Gallery props for navigation
type GalleryProps = {
  images: { src: string; alt: string }[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

type LightboxProps = SingleImageProps | GalleryProps;

// Type guard to check if props are gallery props
function isGalleryProps(props: LightboxProps): props is GalleryProps {
  return "images" in props && "currentIndex" in props;
}

export default function ImageLightbox(props: LightboxProps) {
  // Gallery mode with navigation
  if (isGalleryProps(props)) {
    const { images, currentIndex, onClose, onNext, onPrev } = props;
    const currentImage = images[currentIndex];

    return (
      <div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Previous button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 text-white hover:text-gray-300 z-10 p-2 bg-black/50 rounded-full"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        )}

        {/* Image */}
        <div
          className="relative max-w-4xl max-h-[90vh] w-full h-full mx-16"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            unoptimized
            className="object-contain"
          />
        </div>

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 text-white hover:text-gray-300 z-10 p-2 bg-black/50 rounded-full"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    );
  }

  // Single image mode (original behavior)
  const {
    open,
    onOpenChange,
    imageSrc,
    photographer = null,
    views = null,
    postedDate = null,
  } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && imageSrc && (
        <DialogContent className="bg-white max-w-7xl p-6 rounded-xl overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Image preview
              </DialogTitle>
              {photographer && (
                <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={photographer.avatar} />
                    <AvatarFallback>
                      {photographer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">
                      {photographer.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {photographer.rating} • {photographer.bookings} bookings
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full px-0 mt-6">
            <div className="relative w-full h-[55vh] md:h-[70vh] flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
              <Image
                src={imageSrc}
                alt="Gallery image"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>

          {(views || postedDate) && (
            <div className="text-center mt-6 mb-2">
              {views !== null && (
                <p className="text-2xl font-semibold text-gray-700">
                  {(views ?? 0).toLocaleString()}
                </p>
              )}
              {postedDate && (
                <p className="text-sm text-gray-500">Posted {postedDate}</p>
              )}
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
