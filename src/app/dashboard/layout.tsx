"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  CreditCard,
  Globe,
  Settings,
  Package,
  Images,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { icon: User, label: "Basic Information", href: "/dashboard/edit-profile" },
    {
      icon: CreditCard,
      label: "Payment Information",
      href: "/dashboard/edit-profile?section=payment",
    },
    {
      icon: Globe,
      label: "On The Web",
      href: "/dashboard/edit-profile?section=web",
    },
    { icon: Package, label: "Packages", href: "/dashboard/packages" },
    { icon: Images, label: "Portfolio", href: "/dashboard/portfolio" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-600">
          Imfo Bookings
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings">
            <Button variant="ghost">Settings</Button>
          </Link>
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
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start mb-2 text-purple-600"
              >
                ← Back to Home
              </Button>
            </Link>
            {menuItems.map((item, i) => {
              const isActive =
                pathname === item.href ||
                (item.href.includes("?") &&
                  pathname === item.href.split("?")[0]);
              return (
                <Link key={i} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start mb-2 ${
                      isActive ? "bg-purple-600 hover:bg-purple-700" : ""
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
