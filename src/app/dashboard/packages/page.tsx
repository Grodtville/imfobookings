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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Footer from "@/components/Footer";
import API from "@/lib/api";
import { me as getMe } from "@/lib/auth";
import {
  Plus,
  Loader2,
  CheckCircle,
  Package,
  Trash2,
  Edit,
  ImageIcon,
} from "lucide-react";

type PackageType = {
  id: string;
  service_id: string;
  vendor_id: string;
  title: string;
  details: string[] | null;
  price: number;
  created_on: string | null;
  image: string | null;
  contract_url: string | null;
  vendor_name: string;
  contact_person: string;
  vendor_phone: string;
  vendor_email: string;
  vendor_address: string;
  status: string | null;
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

export default function PackagesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state for new package
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [packageImage, setPackageImage] = useState<File | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  // Fetch user and packages
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Get current user
        const userData = await getMe();
        setUser(userData);

        if (userData?.id) {
          // Get user's packages (vendor_id is the user's id)
          try {
            const packagesRes = await API.get(
              `/v1/packages/vendor/${userData.id}`
            );
            setPackages(packagesRes.data || []);
          } catch (pkgErr) {
            console.log("No packages found or error loading packages");
            setPackages([]);
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
        console.error("Failed to load data:", err);
        setError("Please log in to view your packages");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDetails("");
    setPrice("");
    setServiceId("");
    setVendorName("");
    setContactPerson("");
    setVendorPhone("");
    setVendorEmail("");
    setVendorAddress("");
    setPackageImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleCreatePackage = async () => {
    if (
      !serviceId ||
      !title ||
      !price ||
      !vendorName ||
      !contactPerson ||
      !vendorPhone ||
      !vendorEmail ||
      !vendorAddress
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("service_id", serviceId);
      formData.append("title", title);
      formData.append("details", details);
      formData.append("price", price);
      formData.append("vendor_name", vendorName);
      formData.append("contact_person", contactPerson);
      formData.append("vendor_phone", vendorPhone);
      formData.append("vendor_email", vendorEmail);
      formData.append("vendor_address", vendorAddress);

      if (packageImage) {
        formData.append("image", packageImage);
      }

      // Use longer timeout for file uploads
      await API.post("/v1/packages/new-package", formData, {
        timeout: 120000, // 2 minute timeout for uploads with images
      });

      setSuccess("Package created successfully!");
      setIsDialogOpen(false);
      resetForm();

      // Refresh packages list
      if (user?.id) {
        const packagesRes = await API.get(`/v1/packages/vendor/${user.id}`);
        setPackages(packagesRes.data || []);
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Failed to create package:", err);
      setError(err.response?.data?.detail || "Failed to create package");
    } finally {
      setSaving(false);
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    return service?.name || "Unknown Service";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2">Loading packages...</span>
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
            <h1 className="text-3xl font-bold">My Packages</h1>
            <p className="text-gray-500 mt-1">
              Manage your service packages and offerings
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Package</DialogTitle>
                <DialogDescription>
                  Add a new service package for your customers
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Package Title *</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Wedding Photography Basic"
                    />
                  </div>
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
                </div>

                <div>
                  <Label>Price (GHS) *</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 5000"
                  />
                </div>

                <div>
                  <Label>Package Details (comma-separated)</Label>
                  <textarea
                    className="w-full mt-2 p-3 border rounded-lg resize-none"
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="e.g. 4 hours coverage, 100 edited photos, Online gallery"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Vendor Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Business/Vendor Name *</Label>
                      <Input
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        placeholder="Your business name"
                      />
                    </div>
                    <div>
                      <Label>Contact Person *</Label>
                      <Input
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label>Phone Number *</Label>
                      <Input
                        value={vendorPhone}
                        onChange={(e) => setVendorPhone(e.target.value)}
                        placeholder="+233..."
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={vendorEmail}
                        onChange={(e) => setVendorEmail(e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Business Address *</Label>
                    <Input
                      value={vendorAddress}
                      onChange={(e) => setVendorAddress(e.target.value)}
                      placeholder="Your business address"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label>Package Image</Label>
                  <div className="mt-2">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setPackageImage(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="package-image"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {packageImage ? packageImage.name : "Select Image"}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                      setError(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePackage}
                    disabled={saving}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Package"
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

        {packages.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No packages yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first service package to start receiving bookings
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Package
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden">
                <div className="relative h-40 bg-gradient-to-br from-purple-100 to-purple-200">
                  {pkg.image ? (
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-12 w-12 text-purple-300" />
                    </div>
                  )}
                  <Badge
                    className={`absolute top-3 right-3 ${
                      pkg.status === "active" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {pkg.status || "active"}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{pkg.title}</CardTitle>
                  <CardDescription>
                    {getServiceName(pkg.service_id)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-2xl font-bold text-purple-600">
                    {formatPrice(pkg.price)}
                  </p>
                  {pkg.details && pkg.details.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {pkg.details.slice(0, 3).map((detail, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 flex items-start"
                        >
                          <span className="text-purple-500 mr-2">•</span>
                          {detail}
                        </li>
                      ))}
                      {pkg.details.length > 3 && (
                        <li className="text-sm text-gray-400">
                          +{pkg.details.length - 3} more
                        </li>
                      )}
                    </ul>
                  )}
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
