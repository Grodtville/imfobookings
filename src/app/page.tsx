// src/app/(marketing)/page.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Image
                src="/imfo_bookings-logo.png"
                alt="Imfo Bookings"
                width={140}
                height={40}
                className="h-9"
              />
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <button className="hover:text-purple-600">Explore</button>
                <button className="hover:text-purple-600">Get Inspired</button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Join Imfo Bookings
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero + Search */}
      <section className="relative min-h-screen flex items-center justify-center text-white">
        <Image
          src="/hero.png"
          alt="Wedding rings"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" /> {/* overlay */}
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

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row max-w-2xl mx-auto gap-3">
            <Input
              type="text"
              placeholder="What are you looking for?"
              className="h-12 bg-white/95 text-gray-900 placeholder-gray-500 rounded-full px-6"
            />
            <Input
              type="text"
              placeholder="Shoots"
              className="h-12 bg-white/95 text-gray-900 placeholder-gray-500 rounded-full px-6"
            />
            <Button
              size="lg"
              className="h-12 bg-purple-600 hover:bg-purple-700 rounded-full px-8"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
