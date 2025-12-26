"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";
import { useState } from "react";

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              Imfo Bookings
            </Link>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <Link href="/search" className="hover:text-purple-600">
                Explore
              </Link>
              <Link href="#" className="hover:text-purple-600">
                Get Inspired
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setAuthOpen(true)}
            >
              Join Imfo Bookings
            </Button>

            <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
}
