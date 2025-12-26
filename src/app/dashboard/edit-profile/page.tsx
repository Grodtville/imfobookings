"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditProfilePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Basic Information</h1>

      {/* Verification Status Card */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/avatar-anatar.png" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div>
            <Badge variant="secondary" className="mb-2">
              Verification Status
            </Badge>
            <Badge variant="destructive">Unverified</Badge>
            <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
              Verify your identity
            </Button>
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label>First Name</Label>
          <Input defaultValue="Jolyn" />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input defaultValue="Adu-Sakyi" />
        </div>
        <div>
          <Label>Username</Label>
          <Input defaultValue="@jasphotography" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label>Location</Label>
          <Select defaultValue="ghana">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ghana">Ghana</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>City</Label>
          <Select defaultValue="accra">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accra">Accra</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Speciality */}
      <div className="mb-8">
        <Label>Speciality</Label>
        <div className="flex flex-wrap gap-3 mt-3">
          <Badge variant="secondary" className="px-4 py-2">
            Wedding
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            Birthday party
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            Funeral
          </Badge>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <Input placeholder="e.g. Weddings" className="max-w-xs" />
          <Button className="bg-purple-600 hover:bg-purple-700">
            Add speciality
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Maximum 5 specialties</p>
      </div>

      {/* About */}
      <div className="mb-8">
        <Label>About</Label>
        <textarea
          className="w-full mt-2 p-4 border rounded-lg"
          rows={6}
          defaultValue="Hi! I'm a wedding photographer based in Abossey Okai - here to capture real love, real laughter, and all the in-between moments that make your day unforgettable."
        />
        <p className="text-sm text-gray-500 mt-2">Character Count</p>
      </div>

      {/* Verification, Payment, Social sections follow same pattern — implement similarly */}
    </div>
  );
}
