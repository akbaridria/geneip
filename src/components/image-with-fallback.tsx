"use client";
import { useState } from "react";
import type React from "react";

import { ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  fallbackSrc?: string;
  showLoadingSpinner?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  wrapperClassName?: string;
  aspectRatio?: "square" | "video" | "auto" | string;
  fill?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc,
  showLoadingSpinner = true,
  objectFit = "cover",
  wrapperClassName,
  aspectRatio = "auto",
  fill = false,
  style,
  ...props
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Get aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "auto":
        return "";
      default:
        return aspectRatio.startsWith("aspect-")
          ? aspectRatio
          : `aspect-[${aspectRatio}]`;
    }
  };

  const wrapperStyle = fill
    ? {}
    : {
        width: width || "100%",
        height: height || (aspectRatio === "auto" ? "auto" : undefined),
      };

  const imgStyle = {
    objectFit,
    ...style,
  };

  // If no src provided or error occurred, show fallback
  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-sidebar overflow-hidden rounded-md",
          fill ? "absolute inset-0" : "relative",
          !fill && getAspectRatioClass(),
          wrapperClassName
        )}
        style={wrapperStyle}
      >
        {fallbackSrc ? (
          <img
            src={fallbackSrc || "/placeholder.svg"}
            alt={alt}
            className={cn("w-full h-full object-cover", className)}
            onError={() => {
              setHasError(true);
            }}
            {...props}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-sidebar-foreground/50 p-4">
            <ImageIcon className="h-8 w-8 mb-2" />
            <span className="text-xs text-center">No image</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        fill ? "absolute inset-0" : "",
        !fill && getAspectRatioClass(),
        wrapperClassName
      )}
      style={wrapperStyle}
    >
      {/* Loading spinner overlay */}
      {isLoading && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Loader2 className="h-6 w-6 animate-spin text-sidebar-foreground/50" />
        </div>
      )}

      {/* Actual image */}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={cn(
          "w-full h-full transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        style={imgStyle}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}

// Responsive version that works well with fixed parent widths
export function ResponsiveImageWithFallback({
  src,
  alt,
  className,
  aspectRatio = "square",
  ...props
}: {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto" | string;
  [key: string]: unknown;
}) {
  return (
    <ImageWithFallback
      src={src || "/placeholder.svg"}
      alt={alt}
      aspectRatio={aspectRatio}
      className={className}
      objectFit="cover"
      {...props}
    />
  );
}

// Fill version for absolute positioning (like Next.js Image with fill)
export function FillImageWithFallback({
  src,
  alt,
  className,
  ...props
}: {
  src?: string;
  alt: string;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <ImageWithFallback
      src={src || "/placeholder.svg"}
      alt={alt}
      fill={true}
      className={className}
      objectFit="cover"
      {...props}
    />
  );
}
