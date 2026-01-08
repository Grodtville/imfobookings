"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Footer from "@/components/Footer";
import API from "@/lib/api";
import { me as getMe } from "@/lib/auth";
import {
  Loader2,
  CheckCircle,
  Images,
  Trash2,
  Upload,
  X,
  MapPin,
  AlertCircle,
} from "lucide-react";

type PortfolioItem = {
  id: string;
  photo_url: string;
  caption: string | null;
  location: string | null;
  service_id: string;
  owner_id: string;
  uploaded_on: string | null;
};

type Service = {
  id: string;
  name: string;
  description: string;
};

type User = {
  id: string;
  username: string | null;
  email: string;
};

type SelectedFile = {
  file: File;
  caption: string;
  preview: string;
};

const MAX_TOTAL_IMAGES = 5;
const MAX_UPLOAD_AT_ONCE = 5;

export default function PortfolioPage() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state for new portfolio item
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [location, setLocation] = useState("");
  const [serviceId, setServiceId] = useState("");

  // Lightbox state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate remaining slots
  const remainingSlots = MAX_TOTAL_IMAGES - portfolio.length;
  const maxCanUpload = Math.min(remainingSlots, MAX_UPLOAD_AT_ONCE);

  // Fetch user and portfolio
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Get current user
        const userData = await getMe();
        setUser(userData);

        // Get all portfolios and filter by user
        try {
          const portfolioRes = await API.get("/v1/portfolio/");
          const allPortfolio = portfolioRes.data || [];
          // Filter portfolios by the current user
          const userPortfolio = allPortfolio.filter(
            (item: PortfolioItem) => item.owner_id === userData?.id
          );
          setPortfolio(userPortfolio);
        } catch (portErr) {
          console.log("No portfolio found or error loading portfolio");
          setPortfolio([]);
        }

        // Get available services
        try {
          const servicesRes = await API.get("/v1/service/");
          setServices(servicesRes.data || []);
        } catch (servErr) {
          console.log("Could not load services");
        }
      } catch (err: unknown) {
        console.error("Failed to load data:", err);
        setError("Please log in to view your portfolio");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Cleanup preview URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      selectedFiles.forEach((sf) => URL.revokeObjectURL(sf.preview));
    };
  }, [selectedFiles]);

  const resetForm = () => {
    // Cleanup preview URLs
    selectedFiles.forEach((sf) => URL.revokeObjectURL(sf.preview));
    setSelectedFiles([]);
    setLocation("");
    setServiceId("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Filter only images
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setError("Please select valid image files");
      return;
    }

    // Check if adding these would exceed the limit
    const currentCount = selectedFiles.length;
    const availableSlots = maxCanUpload - currentCount;

    if (availableSlots <= 0) {
      setError(`You can only upload ${maxCanUpload} images at a time`);
      return;
    }

    const filesToAdd = imageFiles.slice(0, availableSlots);

    if (filesToAdd.length < imageFiles.length) {
      setError(
        `Only ${filesToAdd.length} of ${imageFiles.length} images added. You have ${portfolio.length}/${MAX_TOTAL_IMAGES} images in your portfolio.`
      );
    } else {
      setError(null);
    }

    // Create SelectedFile objects with previews
    const newSelectedFiles: SelectedFile[] = filesToAdd.map((file) => ({
      file,
      caption: "",
      preview: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...newSelectedFiles]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateCaption = (index: number, caption: string) => {
    setSelectedFiles((prev) =>
      prev.map((sf, i) => (i === index ? { ...sf, caption } : sf))
    );
  };

  const handleUpload = async () => {
    if (!serviceId) {
      setError("Please select a service type");
      return;
    }

    if (!location) {
      setError("Please enter a location");
      return;
    }

    if (selectedFiles.length === 0) {
      setError("Please select at least one image");
      return;
    }

    // Double-check we're not exceeding the limit
    if (portfolio.length + selectedFiles.length > MAX_TOTAL_IMAGES) {
      setError(
        `You can only have ${MAX_TOTAL_IMAGES} images total. You currently have ${portfolio.length}.`
      );
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Add each image to formData
      selectedFiles.forEach((sf) => {
        formData.append("images", sf.file);
      });

      // Join captions with commas (API expects comma-separated string)
      const captionsString = selectedFiles
        .map((sf) => sf.caption || "")
        .join(",");
      if (captionsString) {
        formData.append("captions", captionsString);
      }

      // Upload to API with query params
      await API.post(
        `/v1/portfolio/upload/portfolio?location=${encodeURIComponent(
          location
        )}&service_id=${serviceId}`,
        formData
      );

      setSuccess("Portfolio images uploaded successfully!");
      setIsDialogOpen(false);
      resetForm();

      // Refresh portfolio list
      const portfolioRes = await API.get("/v1/portfolio/");
      const allPortfolio = portfolioRes.data || [];
      const userPortfolio = allPortfolio.filter(
        (item: PortfolioItem) => item.owner_id === user?.id
      );
      setPortfolio(userPortfolio);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      console.error("Failed to upload portfolio:", err);
      const axiosError = err as {
        response?: { data?: { detail?: string } | string };
      };
      const errorMessage =
        axiosError.response?.data &&
        typeof axiosError.response.data === "object" &&
        "detail" in axiosError.response.data
          ? axiosError.response.data.detail
          : typeof axiosError.response?.data === "string"
          ? axiosError.response.data
          : "Failed to upload images. Please try again.";
      setError(errorMessage || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (portfolioId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    setDeleting(portfolioId);

    try {
      await API.put(`/v1/portfolio/${portfolioId}/delete`);

      // Remove from local state
      setPortfolio((prev) => prev.filter((item) => item.id !== portfolioId));
      setSuccess("Image deleted successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      console.error("Failed to delete image:", err);
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(axiosError.response?.data?.detail || "Failed to delete image");
    } finally {
      setDeleting(null);
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    return service?.name || "Unknown Service";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2">Loading portfolio...</span>
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
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Portfolio</h1>
            <p className="text-gray-500 mt-1">
              Showcase your best work to potential clients
            </p>
            <p className="text-sm text-purple-600 mt-1">
              {portfolio.length}/{MAX_TOTAL_IMAGES} images used
            </p>
          </div>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                disabled={remainingSlots <= 0}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Images
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Portfolio Images</DialogTitle>
                <DialogDescription>
                  Add new images to showcase your work. You can upload up to{" "}
                  {maxCanUpload} images ({remainingSlots} slots remaining).
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Service Type *</Label>
                    <Select value={serviceId} onValueChange={setServiceId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Location *</Label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Accra, Ghana"
                    />
                  </div>
                </div>

                <div>
                  <Label>Select Images * (Max {maxCanUpload})</Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="portfolio-images"
                      disabled={selectedFiles.length >= maxCanUpload}
                    />
                    <div
                      onClick={() =>
                        selectedFiles.length < maxCanUpload &&
                        fileInputRef.current?.click()
                      }
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        selectedFiles.length >= maxCanUpload
                          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                          : "border-gray-300 hover:border-purple-400 cursor-pointer"
                      }`}
                    >
                      <Upload
                        className={`h-8 w-8 mx-auto mb-2 ${
                          selectedFiles.length >= maxCanUpload
                            ? "text-gray-300"
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={
                          selectedFiles.length >= maxCanUpload
                            ? "text-gray-400"
                            : "text-gray-600"
                        }
                      >
                        {selectedFiles.length >= maxCanUpload
                          ? "Maximum images selected"
                          : "Click to select images"}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {selectedFiles.length}/{maxCanUpload} selected
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected images with individual captions */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-4">
                    <Label>Add captions for each image</Label>
                    {selectedFiles.map((sf, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                          <Image
                            src={sf.preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-1 truncate">
                            {sf.file.name}
                          </p>
                          <Input
                            value={sf.caption}
                            onChange={(e) =>
                              updateCaption(index, e.target.value)
                            }
                            placeholder="Add a caption for this image..."
                            className="text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || selectedFiles.length === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload {selectedFiles.length} Image
                        {selectedFiles.length !== 1 ? "s" : ""}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {error && user && !isDialogOpen && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {remainingSlots <= 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
            <p className="text-amber-700">
              You&apos;ve reached the maximum of {MAX_TOTAL_IMAGES} portfolio
              images. Delete some images to upload new ones.
            </p>
          </div>
        )}

        {portfolio.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Images className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No portfolio images yet
            </h2>
            <p className="text-gray-500 mb-6">
              Upload up to {MAX_TOTAL_IMAGES} images to showcase your best work
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Your First Images
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolio.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => setLightboxImage(item.photo_url)}
              >
                <Image
                  src={item.photo_url}
                  alt={item.caption || "Portfolio image"}
                  fill
                  unoptimized
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

                {/* Overlay info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge variant="secondary" className="text-xs mb-1">
                    {getServiceName(item.service_id)}
                  </Badge>
                  {item.caption && (
                    <p className="text-white text-xs mb-1 line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                  {item.location && (
                    <p className="text-white/80 text-xs flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {item.location}
                    </p>
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  disabled={deleting === item.id}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                >
                  {deleting === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightboxImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
              <Image
                src={lightboxImage}
                alt="Portfolio image"
                fill
                unoptimized
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
