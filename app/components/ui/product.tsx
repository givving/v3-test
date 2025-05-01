/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from "react";

interface ProductCardProps {
  image: string;
  name: string;
  rating: number;
  price?: number;
  currency?: string;
  seller?: string;
  reviewCount?: number;
  link?: string;
}

export function StarRating({ rating }: { rating: number }) {
  // Calculate full and partial stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-[#A181FF]">
          {
            i < fullStars
              ? "★" // Full star
              : i === fullStars && hasHalfStar
                ? "★" // Half star (you may want to use a better unicode or SVG)
                : "☆" // Empty star
          }
        </span>
      ))}
    </div>
  );
}

export function ProductCard({
  image,
  name,
  rating,
  price,
  currency = "$",
  seller,
  reviewCount = 0,
  link,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  // #0F4962
  return (
    <div
      className="flex flex-col rounded-lg overflow-hidden shadow bg-white cursor-pointer"
      onClick={() => {
        console.log("Product clicked");
        link && window.open(link, "_blank");
      }}
    >
      <div className="relative h-48 ">
        {!imageError ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">Image unavailable</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg text-[#0F4962] font-givving mb-1 line-clamp-2">
          {name}
        </h3>
        {price !== undefined && (
          <p className="text-lg font-semibold text-[#0F4962] mt-auto">
            {currency}
            {price.toFixed(2)}
          </p>
        )}

        {seller && (
          <p className="text-sm text-gray-500 mt-1">
            Seller: <span className="font-medium">{seller}</span>
          </p>
        )}
        <div className="flex items-center mt-1 mb-2">
          <StarRating rating={rating} />
          <span className="text-gray-500 text-sm ml-1">
            (
            {reviewCount > 999
              ? `${(reviewCount / 1000).toFixed(1)}k`
              : reviewCount}
            )
          </span>
        </div>

        {/* {link && (
            <a 
              href={link}
              target="_blank"
              rel="noopener noreferrer" 
              className="mt-3 px-4 py-2 bg-blue-500 text-white text-center rounded-md hover:bg-blue-600 transition-colors"
            >
              View Product
            </a>
          )} */}
      </div>
    </div>
  );
}
