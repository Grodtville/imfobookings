"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
import Footer from "@/components/Footer";
import API from "@/lib/api";
import { me as getMe } from "@/lib/auth";
import { X, Loader2, CheckCircle, Camera, ImageIcon } from "lucide-react";

type Profile = {
  id: string;
  name: string | null;
  username: string;
  bio: string | null;
  location: string | null;
  photo_url: string | null;
  header_url: string | null;
  services_id: string[];
  website: string | null;
};

type User = {
  id: string;
  username: string | null;
  email: string;
};

type Service = {
  id: string;
  name: string;
  description: string;
};

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingHeader, setUploadingHeader] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  // File input refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [newSpeciality, setNewSpeciality] = useState("");

  // Fetch user and profile data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Get current user
        const userData = await getMe();
        setUser(userData);

        if (userData?.id) {
          // Get profile by user ID
          try {
            const profileRes = await API.get(`/v1/profile/id/${userData.id}`);
            const profileData = profileRes.data;
            setProfile(profileData);

            // Populate form fields
            setName(profileData.name || "");
            setUsername(profileData.username || "");
            setBio(profileData.bio || "");
            setLocation(profileData.location || "");
            setWebsite(profileData.website || "");
            setSelectedServices(profileData.services_id || []);
          } catch (profileErr) {
            console.log("Profile not found, using user data");
            setUsername(userData.username || "");
          }
        }

        // Get available services
        try {
          const servicesRes = await API.get("/v1/service/");
          setServices(servicesRes.data || []);
        } catch (servErr) {
          console.log("Could not load services");
        }
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        setError("Please log in to edit your profile");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!profile?.id) {
      setError("No profile found to update");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await API.put(`/v1/profile/${profile.id}/edit`, {
        name: name || null,
        bio: bio || null,
        location: location || null,
        website: website || null,
        services_id: selectedServices,
      });

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      setError(err.response?.data?.detail || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setUploadingPhoto(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await API.post("/v1/profile/upload/photo", formData);

      // Update profile with new photo URL
      if (response.data?.photo_url) {
        setProfile((prev) =>
          prev ? { ...prev, photo_url: response.data.photo_url } : prev
        );
      } else {
        // Refetch profile to get updated photo
        const profileRes = await API.get(`/v1/profile/id/${user?.id}`);
        setProfile(profileRes.data);
      }

      setSuccess("Profile photo updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Failed to upload photo:", err);
      setError(err.response?.data?.detail || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
      // Reset file input
      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
    }
  };

  const handleHeaderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 10MB for header)
    if (file.size > 10 * 1024 * 1024) {
      setError("Header image must be less than 10MB");
      return;
    }

    setUploadingHeader(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await API.post("/v1/profile/upload/cover", formData);

      // Update profile with new header URL
      if (response.data?.header_url) {
        setProfile((prev) =>
          prev ? { ...prev, header_url: response.data.header_url } : prev
        );
      } else {
        // Refetch profile to get updated header
        const profileRes = await API.get(`/v1/profile/id/${user?.id}`);
        setProfile(profileRes.data);
      }

      setSuccess("Header image updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Failed to upload header:", err);
      setError(err.response?.data?.detail || "Failed to upload header");
    } finally {
      setUploadingHeader(false);
      // Reset file input
      if (headerInputRef.current) {
        headerInputRef.current.value = "";
      }
    }
  };

  const addSpeciality = () => {
    if (newSpeciality && selectedServices.length < 5) {
      // Find service by name or add as custom
      const service = services.find(
        (s) => s.name.toLowerCase() === newSpeciality.toLowerCase()
      );
      if (service && !selectedServices.includes(service.id)) {
        setSelectedServices([...selectedServices, service.id]);
      }
      setNewSpeciality("");
    }
  };

  const removeSpeciality = (serviceId: string) => {
    setSelectedServices(selectedServices.filter((id) => id !== serviceId));
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    return service?.name || serviceId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button
            className="mt-4 bg-purple-600 hover:bg-purple-700"
            onClick={() => (window.location.href = "/")}
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Basic Information</h1>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* Header/Cover Image Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-r from-purple-400 to-purple-600">
            {profile?.header_url && (
              <Image
                src={profile.header_url}
                alt="Profile header"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 right-4">
              <input
                ref={headerInputRef}
                type="file"
                accept="image/*"
                onChange={handleHeaderUpload}
                className="hidden"
                id="header-upload"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => headerInputRef.current?.click()}
                disabled={uploadingHeader}
                className="bg-white/90 hover:bg-white"
              >
                {uploadingHeader ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Change Header
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Profile Photo Section */}
          <div className="p-8 pt-0">
            <div className="flex items-end gap-6 -mt-12">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={profile?.photo_url || "/avatar-anatar.png"}
                  />
                  <AvatarFallback className="text-2xl">
                    {name
                      ? name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg disabled:opacity-50 transition-colors"
                  title="Change profile photo"
                >
                  {uploadingPhoto ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="pb-2">
                <p className="font-medium text-gray-900">
                  {name || username || "User"}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Grid */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Display Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
              />
            </div>
            <div>
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Username cannot be changed
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Accra, Ghana"
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.yourwebsite.com"
              />
            </div>
          </div>

          {/* Speciality */}
          <div className="mb-6">
            <Label>Speciality</Label>
            <div className="flex flex-wrap gap-3 mt-3">
              {selectedServices.map((serviceId) => (
                <Badge
                  key={serviceId}
                  variant="secondary"
                  className="px-4 py-2 flex items-center gap-2"
                >
                  {getServiceName(serviceId)}
                  <button
                    onClick={() => removeSpeciality(serviceId)}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedServices.length === 0 && (
                <span className="text-gray-400 text-sm">
                  No specialities added yet
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Select value={newSpeciality} onValueChange={setNewSpeciality}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Select a speciality" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={addSpeciality}
                disabled={!newSpeciality || selectedServices.length >= 5}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Add speciality
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {selectedServices.length}/5 specialties selected
            </p>
          </div>

          {/* About */}
          <div>
            <Label>About</Label>
            <textarea
              className="w-full mt-2 p-4 border rounded-lg resize-none"
              rows={6}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell clients about yourself and your photography style..."
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-2">
              {bio.length}/500 characters
            </p>
          </div>
        </div>

        {/* Save Button (bottom) */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
