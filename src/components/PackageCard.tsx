import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

type Package = {
  id: string;
  title: string;
  photographer: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
};

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <Link href={`/profiles/${pkg.id}`}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
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
          <h3 className="font-semibold text-lg">{pkg.title}</h3>
          <p className="text-gray-600 text-sm">by {pkg.photographer}</p>
          <div className="flex items-center justify-between mt-3">
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
    </Link>
  );
}
