import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

function ImagePreviews({ images }: ImagePreviewsProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const handlePrev = () => {
    setCurrentImageIdx((pre) => (pre === 0 ? images.length - 1 : pre - 1));
  };

  const handleNext = () => {
    setCurrentImageIdx((pre) => (pre === images.length - 1 ? 0 : pre + 1));
  };

  return (
    <div className="relative h-[450px] w-full">
      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentImageIdx ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={img}
            alt={`Property image ${index}`}
            fill
            priority={index === currentImageIdx}
            className="object-cover cursor-pointer transition-transform duration-500 ease-in-out"
          />
        </div>
      ))}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary-700 bg-opacity-50 p-2 rounded-full focus:outline-none focus:ring focus:ring-secondary-300"
        aria-label="Previous image"
      >
        <ChevronLeft className="text-white" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary-700 bg-opacity-50 p-2 rounded-full focus:outline-none focus:ring focus:ring-secondary-300"
        aria-label="Previous image"
      >
        <ChevronRight className="text-white" />
      </button>
    </div>
  );
}

export default ImagePreviews;
