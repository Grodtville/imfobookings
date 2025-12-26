"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Camera, Bookmark } from "lucide-react";

type LightboxProps = {
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

export default function ImageLightbox({
  open,
  onOpenChange,
  imageSrc,
  photographer = null,
  views = null,
  postedDate = null,
}: LightboxProps) {
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
