"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export type PackageCardData = {
  id: string;
  service_id: string;
  vendor_id: string;
  title: string;
  details: string[] | null;
  price: number;
  image: string | null;
  status?: string | null;
  vendor_name?: string;
};

type PackageCardProps = {
  package: PackageCardData;
  onViewDetails: (pkg: PackageCardData) => void;
};

export default function PackageCard({
  package: pkg,
  onViewDetails,
}: PackageCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {pkg.image ? (
        <div className="relative h-48 w-full flex-shrink-0">
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-400">No image</span>
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <h4 className="font-bold text-lg mb-2 line-clamp-1">{pkg.title}</h4>
        {pkg.details && pkg.details.length > 0 ? (
          <ul className="text-gray-600 text-sm mb-4 space-y-1 flex-1">
            {pkg.details.slice(0, 3).map((detail, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{detail}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex-1" />
        )}
        <p className="text-2xl font-bold text-purple-600 mb-4">
          GH₵ {pkg.price.toLocaleString()}
        </p>
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full"
          onClick={() => onViewDetails(pkg)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
