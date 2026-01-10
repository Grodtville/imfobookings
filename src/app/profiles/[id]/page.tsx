"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import {
  MapPin,
  Package,
  Camera,
  ImagePlus,
  User,
  PenLine,
  Plus,
  Loader2,
} from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";
import Footer from "@/components/Footer";
import PackageDetailsModal, {
  PackageData,
} from "@/components/PackageDetailsModal";
import API from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type APIProfile = {
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

type PortfolioItem = {
  id: string;
  photo_url: string;
  caption: string | null;
  location: string | null;
  service_id: string;
  owner_id: string;
};

type PackageItem = {
  id: string;
  service_id: string;
  vendor_id: string;
  title: string;
  details: string[] | null;
  price: number;
  image: string | null;
  status: string | null;
};

export default function ProfilePage() {
  // read id from the current route params (works for client navigation)
  const params = useParams() as { id?: string } | null;
  const idParam = params?.id ?? "";
  const { user } = useAuth();

  const [apiProfile, setApiProfile] = useState<APIProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Package modal state
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(
    null
  );
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

  // Check if the logged-in user is viewing their own profile
  const isOwnProfile = useMemo(() => {
    if (!user?.id) return false;
    return user.id === idParam;
  }, [user?.id, idParam]);

  // Check if this is likely a UUID (for API fetch)
  const isUUID = useMemo(
    () =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idParam
      ),
    [idParam]
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      if (!idParam) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      let profileData: APIProfile | null = null;

      // Try fetching by profile ID (UUID) first if it looks like a UUID
      if (isUUID) {
        try {
          const response = await API.get(`/v1/profile/id/${idParam}`);
          if (!cancelled && response.data) {
            profileData = response.data;
            setApiProfile(response.data);
          }
        } catch (err: unknown) {
          const axiosError = err as {
            response?: { status?: number };
            message?: string;
          };
          console.log(
            "Profile by ID failed:",
            axiosError.response?.status,
            axiosError.message
          );
        }
      }

      // Try by username if UUID lookup failed
      if (!profileData) {
        try {
          const response = await API.get(`/v1/profile/${idParam}`);
          if (!cancelled && response.data) {
            profileData = response.data;
            setApiProfile(response.data);
          }
        } catch (err: unknown) {
          const axiosError = err as {
            response?: { status?: number };
            message?: string;
          };
          console.log(
            "Profile by username also failed:",
            axiosError.response?.status,
            axiosError.message
          );
          if (!cancelled) {
            setError("Profile not found");
          }
        }
      }

      // If we have a profile, fetch portfolio and packages
      if (profileData && !cancelled) {
        // Fetch portfolio
        try {
          const portfolioRes = await API.get("/v1/portfolio/");
          const allPortfolio = portfolioRes.data || [];
          const userPortfolio = allPortfolio.filter(
            (item: PortfolioItem) => item.owner_id === profileData!.id
          );
          setPortfolio(userPortfolio);
        } catch (err) {
          console.log("Could not load portfolio");
        }

        // Fetch packages
        try {
          const packagesRes = await API.get(
            `/v1/packages/vendor/${profileData.id}`
          );
          setPackages(packagesRes.data || []);
        } catch (err) {
          console.log("Could not load packages");
        }
      }

      if (!cancelled) {
        setLoading(false);
      }
    }

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [idParam, isUUID]);

  const profile = apiProfile;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-500">Loading profile...</span>
        </div>
      </>
    );
  }

  // If we have API profile data, render that
  if (profile) {
    return (
      <>
        <Navbar />
        <section className="relative h-96 md:h-screen">
          {profile.header_url ? (
            <Image
              src={profile.header_url}
              alt="Cover"
              fill
              unoptimized
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800">
              {isOwnProfile && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link href="/dashboard/edit-profile">
                    <Button
                      variant="outline"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/50"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Upload Header Image
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white flex items-end gap-6">
            {profile.photo_url ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                <Image
                  src={profile.photo_url}
                  alt={profile.name || profile.username}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : isOwnProfile ? (
              <Link href="/dashboard/edit-profile">
                <div className="w-24 h-24 rounded-full border-4 border-white border-dashed bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                  <User className="h-10 w-10 text-white/70" />
                </div>
              </Link>
            ) : null}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold">
                {profile.name || profile.username}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-6 w-6" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {isOwnProfile && !profile.location && (
                  <Link href="/dashboard/edit-profile">
                    <span className="text-white/70 hover:text-white text-sm flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Add location
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
          {isOwnProfile && (
            <div className="absolute top-4 right-4">
              <Link href="/dashboard/edit-profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/50"
                >
                  <PenLine className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          )}
        </section>

        {profile.bio ? (
          <section className="py-12 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">About</h2>
              <p className="text-lg text-gray-700">{profile.bio}</p>
            </div>
          </section>
        ) : isOwnProfile ? (
          <section className="py-12 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">About</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
                <PenLine className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">
                  Tell visitors about yourself and your services
                </p>
                <Link href="/dashboard/edit-profile">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <PenLine className="mr-2 h-4 w-4" />
                    Add Bio
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {/* Portfolio Gallery Section */}
        {portfolio.length > 0 ? (
          <section className="py-12 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Gallery</h2>
                {isOwnProfile && (
                  <Link href="/dashboard/portfolio">
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add More
                    </Button>
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolio.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-lg group"
                    onClick={() => setLightboxIndex(index)}
                  >
                    <Image
                      src={item.photo_url}
                      alt={item.caption || `Portfolio ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.caption && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white text-sm">{item.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : isOwnProfile ? (
          <section className="py-12 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Gallery</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <ImagePlus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Showcase Your Work
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Upload photos of your best work to attract potential clients
                  and show off your skills
                </p>
                <Link href="/dashboard/portfolio">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Upload Portfolio Images
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {/* Packages Section */}
        {packages.length > 0 ? (
          <section id="packages" className="py-12 px-4 bg-white scroll-mt-20">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Packages</h2>
                {isOwnProfile && (
                  <Link href="/dashboard/packages">
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add More
                    </Button>
                  </Link>
                )}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    {pkg.image && (
                      <div className="relative h-48">
                        <Image
                          src={pkg.image}
                          alt={pkg.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {pkg.title}
                      </h3>
                      {pkg.details && pkg.details.length > 0 && (
                        <ul className="text-gray-600 text-sm mb-4 space-y-1">
                          {pkg.details.slice(0, 3).map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-purple-600">•</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-purple-600">
                          GH₵ {pkg.price.toLocaleString()}
                        </span>
                        <Button
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setIsPackageModalOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : isOwnProfile ? (
          <section className="py-12 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Packages</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Create Your Service Packages
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Define your service packages with pricing to let clients know
                  what you offer and book directly
                </p>
                <Link href="/dashboard/packages">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Package
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <PackageDetailsModal
          isOpen={isPackageModalOpen}
          onClose={() => {
            setIsPackageModalOpen(false);
            setSelectedPackage(null);
          }}
          packageData={selectedPackage}
        />

        {/* Lightbox for portfolio images */}
        {lightboxIndex !== null && portfolio.length > 0 && (
          <ImageLightbox
            images={portfolio.map((item) => ({
              src: item.photo_url,
              alt: item.caption || "Portfolio image",
            }))}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNext={() =>
              setLightboxIndex((prev) =>
                prev !== null ? (prev + 1) % portfolio.length : 0
              )
            }
            onPrev={() =>
              setLightboxIndex((prev) =>
                prev !== null
                  ? (prev - 1 + portfolio.length) % portfolio.length
                  : 0
              )
            }
          />
        )}

        <Footer />
      </>
    );
  }

  // Profile not found
  return (
    <>
      <Navbar />
      <div className="pt-20 text-center">
        <div className="text-3xl mb-4">Profile not found</div>
        <div className="text-sm text-gray-500">
          The profile you&apos;re looking for doesn&apos;t exist.
        </div>
        {error && <div className="mt-4 text-sm text-red-500">{error}</div>}
      </div>
      <Footer />
    </>
  );
}
