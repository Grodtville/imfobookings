import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
const SearchClient = React.lazy(() => import("@/components/SearchClient"));

// Mock data — replace with real later
const trendingPackages = [
  {
    id: "1",
    title: "The Bronze Wedding",
    photographer: "Anatar Joseph",
    photographerAvatar: "/avatar-anatar.png",
    price: 5000,
    rating: 5.0,
    reviews: 30,
    eventsCompleted: 33,
    location: "Abossey-Okai, Accra",
    category: "White Wedding",
    features: [
      "6 Hours Photography Coverage",
      "High-res images",
      "Online gallery",
    ],
    description:
      "A warm, cinematic wedding package focused on cultural ceremonies.",
  },
  {
    id: "2",
    title: "Golden Moments",
    photographer: "Nana Ama",
    photographerAvatar: "/avatar-placeholder.png",
    price: 4200,
    rating: 4.8,
    reviews: 18,
    eventsCompleted: 20,
    location: "Kumasi",
    category: "Engagement",
    features: ["4 Hours Coverage", "2 Photographers", "Album"],
    description: "Sweet engagement sessions with candid and posed coverage.",
  },
  {
    id: "3",
    title: "Cultural Highlights",
    photographer: "Kojo Mensah",
    photographerAvatar: "/avatar-placeholder.png",
    price: 3500,
    rating: 4.7,
    reviews: 12,
    eventsCompleted: 15,
    location: "Takoradi",
    category: "Event",
    features: ["3 Hours Coverage", "Highlight Reel"],
    description: "Perfect for cultural events and intimate celebrations.",
  },
];

const mockPhotographers = [
  {
    id: "p1",
    name: "Anatar Joseph",
    avatar: "/avatar-anatar.png",
    location: "Abossey-Okai, Accra",
    rating: 4.9,
  },
  {
    id: "p2",
    name: "Nana Ama",
    avatar: "/avatar-placeholder.png",
    location: "Kumasi",
    rating: 4.7,
  },
  {
    id: "p3",
    name: "Kojo Mensah",
    avatar: "/avatar-placeholder.png",
    location: "Takoradi",
    rating: 4.8,
  },
];

const portfolioShots = Array.from(
  { length: 24 },
  (_, i) => `/portfolio-${(i % 15) + 1}.png`
);

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="pt-20">Loading…</div>}>
        <SearchClient />
      </Suspense>
    </>
  );
}
