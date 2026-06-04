"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/state/redux";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setFilters } from "@/state";
function HeroSection() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  return (
    <div className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        alt="Rentiful Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/3 -translate-y-1/2 text-center w-full"
      >
        <div className="max-w-4xl mx-auto px-16 sm:px-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Start Your journy to finding the perfect place to call home
          </h1>
          <p className="text-xl text-white mb-8">
            Explore your wide range of rental properties tailored to fit your
            lifestyle and needs!
          </p>

          <div className="flex justify-center">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Search by city, neighborhood or address"
              className="w-full max-w-lg rounded-none rounded-l-xl border-none  bg-white h-12"
            />
            <Button
              className="bg-secondary-500 text-white border-none rounded-none rounded-r-xl h-12"
              onClick={async () => {
                try {
                  const trimmedQuery = searchQuery.trim();

                  if (!trimmedQuery) return;

                  const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmedQuery)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&fuzzyMatch=true`,
                  );

                  const data = await response.json();
                  if (data.features && data.features.length > 0) {
                    const [lng, lat] = data.features[0].center;
                    dispatch(
                      setFilters({
                        location: trimmedQuery,
                        coordinates: [lat, lng],
                      }),
                    );

                    const params = new URLSearchParams({
                      location: trimmedQuery,
                      lat: String(lat),
                      lng: String(lng),
                    });

                    router.push(`/search?${params.toString()}`);
                  }
                } catch (error) {
                  console.error("error search location: ", error);
                }
              }}
            >
              Search
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default HeroSection;
