"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, User, CreditCard, Globe, Settings } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { icon: User, label: "Basic Information", active: true },
    { icon: User, label: "Verification" },
    { icon: CreditCard, label: "Payment Information" },
    { icon: Globe, label: "On The Web" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-600">
          Imfo Bookings
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost">To Settings</Button>
          <Avatar>
            <AvatarImage src="/avatar-anatar.png" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <nav className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start mb-2 text-purple-600"
            >
              ← Back to Profile
            </Button>
            {menuItems.map((item, i) => (
              <Button
                key={i}
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start mb-2 ${
                  item.active ? "bg-purple-600 hover:bg-purple-700" : ""
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
