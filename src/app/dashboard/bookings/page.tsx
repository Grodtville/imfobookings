"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Flag, XCircle } from "lucide-react";
import Footer from "@/components/Footer";

// Mock data — replace with FastAPI fetch later
const currentBookings = [
  {
    id: "1",
    status: "ongoing",
    packageType: "White Wedding",
    title: "Kweku & Ama's Wedding",
    package: "The Bronze Wedding",
    location: "Thorpe Link, Accra • GCB Head Office",
    date: "Sat 6th October • 11:00 AM - 12:00 PM",
    clientName: "Kweku Bangle",
    clientAvatar: "/avatar-client1.png",
    notes:
      "I really love candid moments, so beyond the formal shots, please capture natural interactions between guests — laughter, dancing, hugs, and conversations, especially during the cocktail hour and dinner. These... more",
  },
  {
    id: "2",
    status: "upcoming",
    packageType: "White Wedding",
    title: "The Allotey Twins' Christening",
    package: "Treasure Little Ones",
    location: "Thorpe Link, Accra • GCB Head Office",
    date: "Sat 6th October • 11:00 AM - 12:00 PM",
    clientName: "Mohammed Avdol",
    clientAvatar: "/avatar-client2.png",
    notes:
      "I really love candid moments, so beyond the formal shots, please capture natural interactions between guests — laughter, dancing, hugs, and conversations, especially during the cocktail hour and dinner. These... more",
  },
  {
    id: "3",
    status: "upcoming",
    packageType: "White Wedding",
    title: "Grandpa Max's Funeral",
    package: "Glory Deus Funeral",
    location: "Thorpe Link, Accra • GCB Head Office",
    date: "Sat 6th October • 11:00 AM - 12:00 PM",
    clientName: "Dinom Inator",
    clientAvatar: "/avatar-client3.png",
    notes:
      "I really love candid moments, so beyond the formal shots, please capture natural interactions between guests — laughter, dancing, hugs, and conversations, especially during the cocktail hour and dinner. These... more",
  },
];

const BookingCard = ({ booking }: { booking: (typeof currentBookings)[0] }) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
    <div className="flex flex-col md:flex-row">
      {/* Image Left */}
      <div className="relative h-64 md:h-auto md:w-96">
        <Image
          src="/booking-hero.png" // Use your ring exchange or event shot
          alt={booking.title}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-4 left-4 bg-white text-gray-800">
          {booking.packageType}
        </Badge>
      </div>

      {/* Details Right */}
      <div className="flex-1 p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <Badge
            variant={booking.status === "ongoing" ? "default" : "secondary"}
            className="mb-2"
          >
            {booking.status === "ongoing" ? "Ongoing" : "Upcoming"}
          </Badge>
        </div>

        <h3 className="text-2xl font-bold mb-2">{booking.title}</h3>
        <p className="text-lg text-purple-600 mb-4">{booking.package}</p>

        <div className="text-gray-600 mb-6">
          <p>{booking.location}</p>
          <p>{booking.date}</p>
        </div>

        {/* Client */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar>
            <AvatarImage src={booking.clientAvatar} />
            <AvatarFallback>
              {booking.clientName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{booking.clientName}</p>
            <p className="text-sm text-gray-600">
              {booking.location.split(" • ")[0]}
            </p>
          </div>
        </div>

        {/* Notes */}
        <p className="text-gray-700 mb-6 line-clamp-3">{booking.notes}</p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Flag className="mr-2 h-4 w-4" /> Report Issue
          </Button>
          <Button variant="outline" size="sm">
            <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 ml-auto">
            <MessageCircle className="mr-2 h-4 w-4" /> Send Chat
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default function MyBookingsPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header - reuse from dashboard or create simple */}
        <header className="bg-white border-b px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-4xl font-bold">My Bookings</h1>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-8">
          <Tabs defaultValue="current" className="mb-8">
            <TabsList>
              <TabsTrigger value="current">Currently Booked (3)</TabsTrigger>
              <TabsTrigger value="history">Booking History (35)</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              {currentBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </TabsContent>

            <TabsContent value="history">
              <p className="text-center text-gray-500 py-12">
                History coming soon...
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </>
  );
}
