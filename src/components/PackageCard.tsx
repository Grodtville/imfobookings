"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Calendar, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Package = {
  id: string; // photographer id
  title: string;
  photographer: string;
  photographerAvatar?: string; // add to mock later
  price: number;
  rating: number;
  reviews: number;
  eventsCompleted: number;
  location: string;
  category: string;
  features: string[]; // e.g., "6 Hours Photography Coverage"
  description: string;
};

type PackageCardProps = {
  pkg: Package;
  onOpenModal: (pkg: Package) => void; // pass from homepage
};

export default function PackageCard({ pkg, onOpenModal }: PackageCardProps) {
  const photographerName = pkg.photographer ?? "";
  const photographerInitials = photographerName
    ? photographerName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "";
  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
      onClick={() => onOpenModal(pkg)} // Click anywhere opens modal
    >
      <div className="relative h-48">
        <Image
          src="/package.png"
          alt={pkg.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
          {pkg.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-1">{pkg.title}</h3>
        <div
          className="flex items-center gap-2 text-sm text-gray-600 mb-3"
          onClick={(e) => e.stopPropagation()} // Prevent modal on name/avatar click
        >
          <Link
            href={`/profiles/${pkg.id}`}
            className="flex items-center gap-2 hover:text-purple-600"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={pkg.photographerAvatar || "/avatar-placeholder.png"}
              />
              <AvatarFallback>{photographerInitials}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{photographerName || "Unknown"}</span>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600">
            GH₵ {pkg.price.toLocaleString()}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">
              {pkg.rating} ({pkg.reviews})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
