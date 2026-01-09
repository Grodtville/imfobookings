"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle,
  MapPin,
  Camera,
  Package,
  Star,
  Loader2,
} from "lucide-react";
import API from "@/lib/api";

export type PackageData = {
  id: string;
  service_id: string;
  vendor_id: string;
  title: string;
  details: string[] | null;
  description?: string | null;
  price: number;
  image: string | null;
  status: string | null;
  vendor_name?: string;
};

type VendorInfo = {
  id: string;
  name: string | null;
  username: string;
  photo_url: string | null;
  location: string | null;
  bio: string | null;
};

type PackageDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  packageData: PackageData | null;
};

export default function PackageDetailsModal({
  isOpen,
  onClose,
  packageData,
}: PackageDetailsModalProps) {
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [vendorPackagesCount, setVendorPackagesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVendorInfo() {
      if (!packageData?.vendor_id) return;

      setLoading(true);
      try {
        // Fetch vendor profile
        const profileRes = await API.get(
          `/v1/profile/id/${packageData.vendor_id}`
        );
        setVendor(profileRes.data);

        // Fetch vendor packages count
        const packagesRes = await API.get(
          `/v1/packages/vendor/${packageData.vendor_id}`
        );
        setVendorPackagesCount(packagesRes.data?.length || 0);
      } catch (err) {
        console.log("Could not load vendor info");
      } finally {
        setLoading(false);
      }
    }

    if (isOpen && packageData) {
      fetchVendorInfo();
    }
  }, [isOpen, packageData]);

  if (!packageData) return null;

  const vendorName =
    vendor?.name || vendor?.username || packageData.vendor_name || "Vendor";
  const vendorInitials = vendorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">
            {packageData.title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Image */}
            <div className="space-y-6">
              {packageData.image ? (
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden">
                  <Image
                    src={packageData.image}
                    alt={packageData.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] w-full rounded-xl bg-gray-100 flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}

              {/* About this package */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  About this package
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {packageData.description ||
                    (packageData.details && packageData.details.length > 0
                      ? `This ${
                          packageData.title
                        } package includes ${packageData.details
                          .slice(0, 3)
                          .join(", ")
                          .toLowerCase()}${
                          packageData.details.length > 3 ? " and more" : ""
                        }. Perfect for capturing your special moments with professional quality and care.`
                      : `Our ${packageData.title} is designed to provide you with exceptional service and memorable results. Contact the vendor for more details about what's included.`)}
                </p>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Price and Details */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Base Price</p>
                  <p className="text-3xl font-bold">
                    <span className="text-sm font-normal text-gray-500">
                      GH₵
                    </span>{" "}
                    {packageData.price.toLocaleString()}
                  </p>
                </div>

                {packageData.details && packageData.details.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {packageData.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full h-11">
                  Book Package
                </Button>
              </div>

              {/* Vendor Card */}
              <div className="bg-gray-50 rounded-xl p-5">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                    <span className="ml-2 text-gray-500">
                      Loading vendor info...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src={vendor?.photo_url || undefined} />
                      <AvatarFallback className="bg-purple-100 text-purple-600 font-medium">
                        {vendorInitials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/profiles/${packageData.vendor_id}`}
                        className="font-semibold text-purple-600 hover:underline"
                        onClick={onClose}
                      >
                        {vendorName}
                      </Link>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>4.9(30)</span>
                        <span className="text-gray-300">•</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>33 events completed</span>
                      </div>

                      {vendor?.location && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{vendor.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <Camera className="h-3.5 w-3.5" />
                        <span>Photographer</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <Package className="h-3.5 w-3.5" />
                        <span>{vendorPackagesCount} Packages available</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
