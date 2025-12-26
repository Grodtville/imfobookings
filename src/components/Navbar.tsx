"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (e.target instanceof Node && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleLogout = () => {
    try {
      signOut();
    } catch (e) {
      try {
        localStorage.removeItem("imfo_user");
      } catch (err) {
        /* ignore */
      }
    }
    setMenuOpen(false);
  };

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
            {!user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthOpen(true)}
                >
                  Log in
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setAuthOpen(true)}
                >
                  Join Imfo Bookings
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/bookings"
                  className="text-gray-700 hover:text-gray-900"
                >
                  <Calendar className="h-6 w-6" />
                </Link>

                <div ref={menuRef} className="relative">
                  <button
                    onClick={() => setMenuOpen((s) => !s)}
                    className="rounded-full overflow-hidden"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.avatar || "/avatar-placeholder.png"}
                      />
                      <AvatarFallback>
                        {user?.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow z-30">
                      <Link
                        href={`/profiles/${user.id}`}
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        My profile
                      </Link>
                      <Link
                        href={`/dashboard/edit-profile`}
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        Edit profile
                      </Link>
                      <Link
                        href={`/dashboard/settings`}
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        Profile settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
}
