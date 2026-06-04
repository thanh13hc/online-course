import { useGetPropertyQuery } from "@/state/api";
import { Compass, MapPin } from "lucide-react";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

function PropertyLocation({ propertyId }: PropertyLocationProps) {
  const mapContainerRef = useRef(null);
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  useEffect(() => {
    if (isLoading || isError || !property) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/thanh13hc/cmpw4jlky000s01siefsg0bsg",
      center: [
        property.location.coordinates.longtitude,
        property.location.coordinates.latitude,
      ],
      zoom: 14,
    });

    const marker = new mapboxgl.Marker()
      .setLngLat([
        property.location.coordinates.longtitude,
        property.location.coordinates.latitude,
      ])
      .addTo(map);

    const markerElement = marker.getElement();
    const path = markerElement.querySelector("path[fill='#3FB1CE']");
    if (path) path.setAttribute("fill", "#000000");

    return () => map.remove();
  }, [isLoading, isError, property]);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) {
    return <>Property not Found</>;
  }

  return (
    <div className="py-16">
      <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
        Map and Location
      </h3>
      <div className="flex justify-between items-center text-sm text-primary-500 mt-2">
        <div className="flex items-center text-gray-500">
          <MapPin className="w-4 h-4 mr-1 text-gray-700" />
          Property Address:
          <span className="ml-2 font-semibold text-gray-700">
            {property.location?.address || "Address not available"}
          </span>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            property.location?.address || "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-between items-center hover:underline gap-2 text-primary-600"
        >
          <Compass className="w-5 h-5" />
          Get Directions
        </a>
      </div>
      <div
        className="relative mt-4 h-[300px] rounded-lg overflow-hidden"
        ref={mapContainerRef}
      />
    </div>
  );
}

export default PropertyLocation;
