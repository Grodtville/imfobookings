import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { photographers } from "@/lib/data";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const photographer = photographers.find((p) => p.id === params.id);

  if (!photographer) {
    return (
      <div className="pt-20 text-center text-3xl">Photographer not found</div>
    );
  }

  return (
    <>
      <section className="relative h-96 md:h-screen">
        <Image
          src={photographer.coverImage}
          alt="Cover"
          fill
          className="object-cover"
          priority
          placeholder="blur"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl md:text-6xl font-bold">
            {photographer.name}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span>
                {photographer.rating} ({photographer.reviews} reviews)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              <span>{photographer.location}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">About</h2>
          <p className="text-lg text-gray-700">
            15+ years capturing authentic Ghanaian weddings and cultural events.
            Celebrity & brand photographer.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photographer.gallery.map((img, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden shadow-lg"
              >
                <Image src={img} alt="Gallery" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Packages</h2>
          <div className="space-y-6">
            {photographer.packages.map((pkg, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row justify-between items-center gap-6"
              >
                <div>
                  <h3 className="text-2xl font-bold">{pkg.title}</h3>
                  <p className="text-gray-600 mt-2">{pkg.description}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    GH₵ {pkg.price.toLocaleString()}
                  </p>
                  <Button
                    size="lg"
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
