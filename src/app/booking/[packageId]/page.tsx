"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import API from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  X,
  Eye,
  Calendar,
  HelpCircle,
  Info,
  Pencil,
  CreditCard,
  CheckCircle,
} from "lucide-react";

type PackageData = {
  id: string;
  service_id: string;
  vendor_id: string;
  title: string;
  details: string[] | null;
  price: number;
  image: string | null;
  vendor_name?: string;
};

type BookingFormData = {
  // Step 1: Your Details
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  postalCode: string;
  streetAddress: string;
  city: string;
  stateRegion: string;
  // Step 2: Event Details
  eventName: string;
  eventDescription: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventType: "indoor" | "outdoor" | "both" | "";
  eventVenueAddress: string;
  eventCity: string;
  eventStateRegion: string;
  eventCountry: string;
  eventPostalCode: string;
  numberOfGuests: string;
  nearbyLandmark: string;
  specialNotes: string;
  // Step 3: Event Contacts
  primaryContactName: string;
  primaryContactPhone: string;
  primaryContactEmail: string;
  secondaryContactName: string;
  secondaryContactPhone: string;
  secondaryContactEmail: string;
  // Step 4: Review
  specialRequests: string;
};

const initialFormData: BookingFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  postalCode: "",
  streetAddress: "",
  city: "",
  stateRegion: "",
  eventName: "",
  eventDescription: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  eventType: "",
  eventVenueAddress: "",
  eventCity: "",
  eventStateRegion: "",
  eventCountry: "",
  eventPostalCode: "",
  numberOfGuests: "",
  nearbyLandmark: "",
  specialNotes: "",
  primaryContactName: "",
  primaryContactPhone: "",
  primaryContactEmail: "",
  secondaryContactName: "",
  secondaryContactPhone: "",
  secondaryContactEmail: "",
  specialRequests: "",
};

const steps = [
  {
    number: 1,
    title: "Your Details",
    subtitle: "Tell us about yourself.",
  },
  {
    number: 2,
    title: "Event Details",
    subtitle: "Tell us about your event.",
  },
  {
    number: 3,
    title: "Review & Confirm",
    subtitle: "Review your details before confirming your booking.",
  },
];

// Ghana regions for the dropdown
const ghanaRegions = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Central",
  "Eastern",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Brong-Ahafo",
  "Oti",
  "Bono East",
  "Ahafo",
  "Savannah",
  "North East",
  "Western North",
];

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const packageId = params?.packageId as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancelBanner, setShowCancelBanner] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showPackagePreview, setShowPackagePreview] = useState(false);

  // Fetch package data
  useEffect(() => {
    async function fetchPackage() {
      if (!packageId) return;

      setLoading(true);
      try {
        const res = await API.get(`/v1/packages/${packageId}`);
        setPackageData(res.data);
      } catch (err) {
        console.error("Failed to fetch package:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPackage();
  }, [packageId]);

  // Autofill from profile
  const handleAutofillFromProfile = async () => {
    if (!user?.id) return;

    try {
      // Get stored user data
      const storedUser = localStorage.getItem("imfo_user");
      let email = "";
      let phone = "";

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        email = userData.email || "";
        phone = userData.phone || "";
      }

      // Get profile data
      const profileRes = await API.get(`/v1/profile/id/${user.id}`);
      const profile = profileRes.data;

      setFormData((prev) => ({
        ...prev,
        firstName: profile.name?.split(" ")[0] || "",
        lastName: profile.name?.split(" ").slice(1).join(" ") || "",
        email: email,
        phone: phone,
        country: "Ghana",
        streetAddress: profile.location || "",
        city: profile.location || "",
      }));
    } catch (err) {
      console.log("Could not autofill from profile");
    }
  };

  const updateFormData = (field: keyof BookingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.stateRegion.trim())
      newErrors.stateRegion = "State/Region is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventName.trim())
      newErrors.eventName = "Event name is required";
    if (!formData.eventDate.trim())
      newErrors.eventDate = "Event date is required";
    if (!formData.startTime.trim())
      newErrors.startTime = "Start time is required";
    if (!formData.endTime.trim()) newErrors.endTime = "End time is required";
    if (!formData.eventVenueAddress.trim())
      newErrors.eventVenueAddress = "Venue address is required";
    if (!formData.eventCity.trim())
      newErrors.eventCity = "Event city is required";
    if (!formData.eventStateRegion.trim())
      newErrors.eventStateRegion = "Event state/region is required";
    // Event Contacts validation
    if (!formData.primaryContactName.trim())
      newErrors.primaryContactName = "Full name is required";
    if (!formData.primaryContactPhone.trim())
      newErrors.primaryContactPhone = "Phone number is required";
    if (!formData.primaryContactEmail.trim())
      newErrors.primaryContactEmail = "Email is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCompleteBooking = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    setSubmitting(true);
    try {
      // Simulate API call for booking
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowConfirmation(true);
    } catch (err) {
      console.error("Booking failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    router.push("/dashboard/bookings");
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-gray-600">Package not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-20 pb-16">
        <div
          className={`mx-auto px-4 sm:px-6 lg:px-8 ${
            currentStep === 3 ? "max-w-7xl" : "max-w-4xl"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Preview
            </h1>
            <button
              onClick={() => setShowPackagePreview(true)}
              className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm"
            >
              <Eye className="h-4 w-4" />
              View Package
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-start mb-12">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 flex flex-col">
                <div className="flex items-center">
                  {/* Step circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                      currentStep >= step.number
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.number}
                  </div>
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        currentStep > step.number
                          ? "bg-purple-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <div className="mt-2 pr-4">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.number
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 hidden md:block">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            {/* Step 1: Your Details */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Details</h2>
                <p className="text-gray-500 mb-6">
                  We'll use this info to confirm your booking and keep you
                  updated.
                </p>

                <Button
                  variant="outline"
                  onClick={handleAutofillFromProfile}
                  className="mb-6 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                >
                  Autofill From Profile
                </Button>

                <div className="space-y-6">
                  {/* Name Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> First Name
                      </Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) =>
                          updateFormData("firstName", e.target.value)
                        }
                        placeholder="eg. Anderson"
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm">
                        Middle Name{" "}
                        <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input
                        value={formData.middleName}
                        onChange={(e) =>
                          updateFormData("middleName", e.target.value)
                        }
                        placeholder="eg. Kweku"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> Last Name
                      </Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) =>
                          updateFormData("lastName", e.target.value)
                        }
                        placeholder="eg. Sakyi"
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email and Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> Email
                      </Label>
                      <p className="text-xs text-gray-400 mb-1">
                        We'll send your booking confirmation here
                      </p>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
                        }
                        placeholder="eg. jaspts@gmail.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> Phone Number
                      </Label>
                      <p className="text-xs text-gray-400 mb-1">
                        Use a number we can reach you on for quick updates
                      </p>
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          updateFormData("phone", e.target.value)
                        }
                        placeholder="eg. +233 55 839 5056"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Country and Postal Code Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Country</Label>
                      <div className="relative">
                        <Input
                          value={formData.country}
                          onChange={(e) =>
                            updateFormData("country", e.target.value)
                          }
                          placeholder="eg. Ghana"
                          className="pr-16"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <X className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded bg-purple-100">
                            <Search className="h-4 w-4 text-purple-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">
                        Postal Code{" "}
                        <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input
                        value={formData.postalCode}
                        onChange={(e) =>
                          updateFormData("postalCode", e.target.value)
                        }
                        placeholder="eg. 123-4567"
                      />
                    </div>
                  </div>

                  {/* Street Address, City, State Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> Street Address
                      </Label>
                      <div className="relative">
                        <Input
                          value={formData.streetAddress}
                          onChange={(e) =>
                            updateFormData("streetAddress", e.target.value)
                          }
                          placeholder="eg. 23 Nii Kofi Avenue"
                          className={`pr-16 ${
                            errors.streetAddress ? "border-red-500" : ""
                          }`}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <X className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded bg-purple-100">
                            <Search className="h-4 w-4 text-purple-600" />
                          </button>
                        </div>
                      </div>
                      {errors.streetAddress && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.streetAddress}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> City
                      </Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => updateFormData("city", value)}
                      >
                        <SelectTrigger
                          className={errors.city ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Accra">Accra</SelectItem>
                          <SelectItem value="Kumasi">Kumasi</SelectItem>
                          <SelectItem value="Tamale">Tamale</SelectItem>
                          <SelectItem value="Takoradi">Takoradi</SelectItem>
                          <SelectItem value="Cape Coast">Cape Coast</SelectItem>
                          <SelectItem value="Tema">Tema</SelectItem>
                          <SelectItem value="Koforidua">Koforidua</SelectItem>
                          <SelectItem value="Sunyani">Sunyani</SelectItem>
                          <SelectItem value="Ho">Ho</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> State/Region
                      </Label>
                      <Select
                        value={formData.stateRegion}
                        onValueChange={(value) =>
                          updateFormData("stateRegion", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.stateRegion ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {ghanaRegions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.stateRegion && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.stateRegion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Event Details */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Event Details</h2>
                <p className="text-gray-500 mb-6">
                  Tell us what's happening and how your photographer can
                  prepare.
                </p>

                <div className="space-y-6">
                  {/* Event Name */}
                  <div>
                    <Label className="text-sm">
                      <span className="text-red-500">*</span> Event Name
                    </Label>
                    <Input
                      value={formData.eventName}
                      onChange={(e) =>
                        updateFormData("eventName", e.target.value)
                      }
                      placeholder="eg. Kweku & Ama's Wedding"
                      className={errors.eventName ? "border-red-500" : ""}
                    />
                    {errors.eventName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.eventName}
                      </p>
                    )}
                  </div>

                  {/* Event Description */}
                  <div>
                    <Label className="text-sm">
                      Event Description{" "}
                      <span className="text-gray-400">(optional)</span>
                    </Label>
                    <Textarea
                      value={formData.eventDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        updateFormData("eventDescription", e.target.value)
                      }
                      placeholder="eg. A traditional engagement at my family home in East Legon."
                      className="min-h-[100px]"
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      2000 Characters
                    </p>
                  </div>

                  {/* Date, Time, Event Type Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> Event Date
                      </Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) =>
                            updateFormData("eventDate", e.target.value)
                          }
                          className={errors.eventDate ? "border-red-500" : ""}
                        />
                      </div>
                      {errors.eventDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.eventDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> Start Time
                      </Label>
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          updateFormData("startTime", e.target.value)
                        }
                        className={errors.startTime ? "border-red-500" : ""}
                      />
                      {errors.startTime && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.startTime}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> End Time
                      </Label>
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) =>
                          updateFormData("endTime", e.target.value)
                        }
                        className={errors.endTime ? "border-red-500" : ""}
                      />
                      {errors.endTime && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.endTime}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm flex items-center gap-1">
                        Event Type
                        <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                      </Label>
                      <RadioGroup
                        value={formData.eventType}
                        onValueChange={(value) =>
                          updateFormData("eventType", value)
                        }
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-1.5">
                          <RadioGroupItem value="indoor" id="indoor" />
                          <Label
                            htmlFor="indoor"
                            className="text-sm font-normal"
                          >
                            Indoor
                          </Label>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <RadioGroupItem value="outdoor" id="outdoor" />
                          <Label
                            htmlFor="outdoor"
                            className="text-sm font-normal"
                          >
                            Outdoor
                          </Label>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <RadioGroupItem value="both" id="both" />
                          <Label htmlFor="both" className="text-sm font-normal">
                            Both/Not sure
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Event Venue Address, City, State/Region Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> Event Venue
                        Address
                      </Label>
                      <div className="relative">
                        <Input
                          value={formData.eventVenueAddress}
                          onChange={(e) =>
                            updateFormData("eventVenueAddress", e.target.value)
                          }
                          placeholder="eg. 23 Nii Kofi Avenue"
                          className={`pr-16 ${
                            errors.eventVenueAddress ? "border-red-500" : ""
                          }`}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <X className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded bg-purple-100">
                            <Search className="h-4 w-4 text-purple-600" />
                          </button>
                        </div>
                      </div>
                      {errors.eventVenueAddress && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.eventVenueAddress}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> Event City
                      </Label>
                      <Select
                        value={formData.eventCity}
                        onValueChange={(value) =>
                          updateFormData("eventCity", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.eventCity ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Accra">Accra</SelectItem>
                          <SelectItem value="Kumasi">Kumasi</SelectItem>
                          <SelectItem value="Tamale">Tamale</SelectItem>
                          <SelectItem value="Takoradi">Takoradi</SelectItem>
                          <SelectItem value="Cape Coast">Cape Coast</SelectItem>
                          <SelectItem value="Tema">Tema</SelectItem>
                          <SelectItem value="Koforidua">Koforidua</SelectItem>
                          <SelectItem value="Sunyani">Sunyani</SelectItem>
                          <SelectItem value="Ho">Ho</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.eventCity && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.eventCity}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm">
                        <span className="text-red-500">*</span> Event
                        State/Region
                      </Label>
                      <Select
                        value={formData.eventStateRegion}
                        onValueChange={(value) =>
                          updateFormData("eventStateRegion", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.eventStateRegion ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {ghanaRegions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.eventStateRegion && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.eventStateRegion}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Event Country, Postal Code Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Event Country</Label>
                      <div className="relative">
                        <Input
                          value={formData.eventCountry}
                          onChange={(e) =>
                            updateFormData("eventCountry", e.target.value)
                          }
                          placeholder="eg. Ghana"
                          className="pr-16"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <X className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded bg-purple-100">
                            <Search className="h-4 w-4 text-purple-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">
                        Postal Code{" "}
                        <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input
                        value={formData.eventPostalCode}
                        onChange={(e) =>
                          updateFormData("eventPostalCode", e.target.value)
                        }
                        placeholder="eg. 123-4567"
                      />
                    </div>
                  </div>

                  {/* Number of Guests, Nearby Landmark Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">
                        Number of Guests{" "}
                        <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Select
                        value={formData.numberOfGuests}
                        onValueChange={(value) =>
                          updateFormData("numberOfGuests", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="eg. 150" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-50">1-50</SelectItem>
                          <SelectItem value="51-100">51-100</SelectItem>
                          <SelectItem value="101-150">101-150</SelectItem>
                          <SelectItem value="151-200">151-200</SelectItem>
                          <SelectItem value="201-300">201-300</SelectItem>
                          <SelectItem value="301-500">301-500</SelectItem>
                          <SelectItem value="500+">500+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">
                        Nearby Landmark{" "}
                        <span className="text-gray-400">(optional)</span>
                      </Label>
                      <div className="relative">
                        <Input
                          value={formData.nearbyLandmark}
                          onChange={(e) =>
                            updateFormData("nearbyLandmark", e.target.value)
                          }
                          placeholder="eg. GCB Bank Head Office"
                          className="pr-16"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <X className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded bg-purple-100">
                            <Search className="h-4 w-4 text-purple-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Notes */}
                  <div>
                    <Label className="text-sm">Special Notes</Label>
                    <p className="text-xs text-gray-400 mb-1">
                      Think of this as your personal note to the photographer —
                      what would make your event photos truly yours?
                    </p>
                    <Textarea
                      value={formData.specialNotes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        updateFormData("specialNotes", e.target.value)
                      }
                      placeholder="Enter text here"
                      className="min-h-[100px]"
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      2000 Characters
                    </p>
                  </div>

                  {/* Event Contacts Section - within Step 2 */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Event Contacts
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Add one or two people we can reach if we need to
                      coordinate during your event.
                    </p>

                    {/* Primary Contact */}
                    <div className="mb-6">
                      <h4 className="text-md font-medium mb-4">
                        Primary Contact
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm">
                            <span className="text-red-500">*</span> Full Name
                          </Label>
                          <Input
                            value={formData.primaryContactName}
                            onChange={(e) =>
                              updateFormData(
                                "primaryContactName",
                                e.target.value
                              )
                            }
                            placeholder="eg. Adwoa Serwaa Amparbeng"
                            className={
                              errors.primaryContactName ? "border-red-500" : ""
                            }
                          />
                          {errors.primaryContactName && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.primaryContactName}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm">
                            <span className="text-red-500">*</span> Phone Number
                          </Label>
                          <div className="flex">
                            <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md text-sm text-gray-500">
                              +233
                            </div>
                            <Input
                              value={formData.primaryContactPhone}
                              onChange={(e) =>
                                updateFormData(
                                  "primaryContactPhone",
                                  e.target.value
                                )
                              }
                              placeholder="eg. 558 452 234"
                              className={`rounded-l-none ${
                                errors.primaryContactPhone
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                          </div>
                          {errors.primaryContactPhone && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.primaryContactPhone}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm">
                            <span className="text-red-500">*</span> Email
                          </Label>
                          <Input
                            type="email"
                            value={formData.primaryContactEmail}
                            onChange={(e) =>
                              updateFormData(
                                "primaryContactEmail",
                                e.target.value
                              )
                            }
                            placeholder="eg. adserwaa@gmail.com"
                            className={
                              errors.primaryContactEmail ? "border-red-500" : ""
                            }
                          />
                          {errors.primaryContactEmail && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.primaryContactEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Secondary Contact */}
                    <div>
                      <h4 className="text-md font-medium mb-4">
                        Secondary Contact{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm">Full Name</Label>
                          <Input
                            value={formData.secondaryContactName}
                            onChange={(e) =>
                              updateFormData(
                                "secondaryContactName",
                                e.target.value
                              )
                            }
                            placeholder="eg. Adwoa Serwaa Amparbeng"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Phone Number</Label>
                          <div className="flex">
                            <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md text-sm text-gray-500">
                              +233
                            </div>
                            <Input
                              value={formData.secondaryContactPhone}
                              onChange={(e) =>
                                updateFormData(
                                  "secondaryContactPhone",
                                  e.target.value
                                )
                              }
                              placeholder="eg. 558 452 234"
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm">Email</Label>
                          <Input
                            type="email"
                            value={formData.secondaryContactEmail}
                            onChange={(e) =>
                              updateFormData(
                                "secondaryContactEmail",
                                e.target.value
                              )
                            }
                            placeholder="eg. adserwaa@gmail.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons for Steps 1 and 2 */}
            {currentStep !== 3 && (
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="w-full sm:w-auto px-4 sm:px-6"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">
                    {currentStep === 1 ? "Back" : `Back`}
                  </span>
                  <span className="sm:hidden">Back</span>
                </Button>
                <Button
                  onClick={handleNext}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 px-4 sm:px-6"
                >
                  <span className="hidden sm:inline">
                    Continue to {steps[currentStep]?.title}
                  </span>
                  <span className="sm:hidden">Continue</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Step 3: Review & Confirm - Split Layout */}
          {currentStep === 3 && (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Side - Scrollable Summary */}
              <div className="flex-1 space-y-6">
                {/* Review Header */}
                <div className="bg-white rounded-2xl shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-4">Review & Confirm</h2>

                  {/* Cancellation Banner */}
                  {showCancelBanner && (
                    <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          If you cancel before 2 days of the event, only 80% of
                          the package price will be refunded
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-gray-800 hover:bg-gray-900 text-white"
                        >
                          Learn more
                        </Button>
                        <button
                          onClick={() => setShowCancelBanner(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-gray-500">
                    Review your details before confirming your booking.
                  </p>
                </div>

                {/* Booking Summary */}
                <div className="bg-white rounded-2xl shadow-md p-8">
                  <h3 className="text-xl font-bold mb-2">Booking Summary</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Take a moment to confirm everything looks right. Once
                    submitted, your booking request will be sent directly to the
                    photographer.
                  </p>

                  {/* Your Details Section */}
                  <div className="border rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Your Details</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToStep(1)}
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Full Name</p>
                        <p className="font-medium">
                          {formData.firstName} {formData.middleName}{" "}
                          {formData.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone Number</p>
                        <p className="font-medium">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Country</p>
                        <p className="font-medium">
                          {formData.country || "Ghana"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Postal Code</p>
                        <p className="font-medium">
                          {formData.postalCode || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Address</p>
                        <p className="font-medium">
                          {formData.streetAddress}, {formData.city},{" "}
                          {formData.stateRegion}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Event Details Section */}
                  <div className="border rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Event Details</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToStep(2)}
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Event Name</p>
                        <p className="font-medium">{formData.eventName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Event Date</p>
                        <p className="font-medium">
                          {formatDate(formData.eventDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Event Start - Event End</p>
                        <p className="font-medium">
                          {formatTime(formData.startTime)} -{" "}
                          {formatTime(formData.endTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Event Venue Address</p>
                        <p className="font-medium">
                          {formData.eventVenueAddress}, {formData.eventCity},{" "}
                          {formData.eventStateRegion}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Event Country</p>
                        <p className="font-medium">
                          {formData.eventCountry || "Ghana"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Postal Code</p>
                        <p className="font-medium">
                          {formData.eventPostalCode || "-"}
                        </p>
                      </div>
                    </div>

                    {formData.specialNotes && (
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm">Special Notes</p>
                        <p className="text-sm mt-1">{formData.specialNotes}</p>
                      </div>
                    )}
                  </div>

                  {/* Event Contacts Section */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Event Contacts</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToStep(2)}
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Primary Contact</p>
                        <p className="font-medium">
                          {formData.primaryContactName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Contact Number</p>
                        <p className="font-medium">
                          +233 {formData.primaryContactPhone}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Contact Email</p>
                        <p className="font-medium">
                          {formData.primaryContactEmail}
                        </p>
                      </div>
                      {formData.secondaryContactName && (
                        <>
                          <div>
                            <p className="text-gray-400">Secondary Contact</p>
                            <p className="font-medium">
                              {formData.secondaryContactName}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Contact Number</p>
                            <p className="font-medium">
                              {formData.secondaryContactPhone
                                ? `+233 ${formData.secondaryContactPhone}`
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Contact Email</p>
                            <p className="font-medium">
                              {formData.secondaryContactEmail || "-"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Fixed Payment Section */}
              <div className="lg:w-[400px]">
                <div className="bg-white rounded-2xl shadow-md p-6 lg:sticky lg:top-24">
                  <h3 className="text-xl font-bold mb-2">Payment</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Select your preferred payment method or add a new payment
                    method. Once you complete the booking, the charge will be
                    deducted from the associated account.
                  </p>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {/* Mastercard */}
                    <div
                      onClick={() => setSelectedPayment("mastercard")}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPayment === "mastercard"
                          ? "border-purple-600 bg-purple-50"
                          : "hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            selectedPayment === "mastercard"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === "mastercard" && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                        <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-orange-400 rounded" />
                      </div>
                      <p className="font-medium text-sm">Mastercard</p>
                      <p className="text-xs text-gray-400">Credit card</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Card Number</span>
                          <span>•••• 4532</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Expiry Date</span>
                          <span>2/27</span>
                        </div>
                      </div>
                    </div>

                    {/* Visa */}
                    <div
                      onClick={() => setSelectedPayment("visa")}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPayment === "visa"
                          ? "border-purple-600 bg-purple-50"
                          : "hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            selectedPayment === "visa"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === "visa" && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                        <span className="text-blue-600 font-bold text-sm">
                          VISA
                        </span>
                      </div>
                      <p className="font-medium text-sm">Visa card</p>
                      <p className="text-xs text-gray-400">Debit card</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Card Number</span>
                          <span>•••• 4532</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Expiry Date</span>
                          <span>2/27</span>
                        </div>
                      </div>
                    </div>

                    {/* MTN Momo */}
                    <div
                      onClick={() => setSelectedPayment("momo")}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPayment === "momo"
                          ? "border-purple-600 bg-purple-50"
                          : "hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            selectedPayment === "momo"
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === "momo" && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                        <div className="w-8 h-5 bg-yellow-400 rounded flex items-center justify-center">
                          <span className="text-[8px] font-bold text-black">
                            MTN
                          </span>
                        </div>
                      </div>
                      <p className="font-medium text-sm">MTN Momo</p>
                      <p className="text-xs text-gray-400">Mobile money</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Phone Number</span>
                          <span>•••• 532</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Account Name</span>
                          <span>**** Sakyi</span>
                        </div>
                      </div>
                    </div>

                    {/* Add Payment Method */}
                    <div
                      onClick={() => setSelectedPayment("add")}
                      className={`border rounded-lg p-4 cursor-pointer transition-all border-dashed flex flex-col items-center justify-center ${
                        selectedPayment === "add"
                          ? "border-purple-600 bg-purple-50"
                          : "hover:border-gray-400"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                      </div>
                      <p className="text-sm font-medium text-center">Add</p>
                      <p className="text-xs text-gray-400 text-center">
                        Payment Method
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                      You will be charged
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <p className="text-3xl font-bold">
                      GH₵ {packageData?.price?.toLocaleString() || "3,303"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="w-full sm:flex-1"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">
                        Back to Event Details
                      </span>
                      <span className="sm:hidden">Back</span>
                    </Button>
                    <Button
                      onClick={handleCompleteBooking}
                      disabled={submitting}
                      className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Calendar className="h-4 w-4 mr-2" />
                      )}
                      Complete Booking
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={handleConfirmationClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-6">
              Your booking request has been sent to the photographer. You will
              receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Package</span>
                <span className="font-medium">{packageData?.title}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Event Date</span>
                <span className="font-medium">
                  {formatDate(formData.eventDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-purple-600">
                  GH₵ {packageData?.price?.toLocaleString()}
                </span>
              </div>
            </div>
            <Button
              onClick={handleConfirmationClose}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              View My Bookings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Package Preview Dialog */}
      <Dialog open={showPackagePreview} onOpenChange={setShowPackagePreview}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="space-y-4">
            {packageData?.image && (
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src={packageData.image}
                  alt={packageData.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">{packageData?.title}</h2>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                GH₵ {packageData?.price?.toLocaleString()}
              </p>
            </div>
            {packageData?.details && packageData.details.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">What's Included</h3>
                <ul className="space-y-2">
                  {packageData.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-600"
                    >
                      <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pt-4 border-t">
              <Button
                onClick={() => setShowPackagePreview(false)}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Continue Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
