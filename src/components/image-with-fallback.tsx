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
}

export function ImageWithFallback({
  src,
  alt,
  width = 200,
  height = 200,
  className,
  fallbackSrc,
  showLoadingSpinner = true,
  objectFit = "cover",
  wrapperClassName,
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

  const imgStyle = {
    objectFit,
    ...style,
  };

  // If no src provided or error occurred, show fallback
  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted border border-border rounded-md",
          wrapperClassName
        )}
        style={{ width, height }}
      >
        {fallbackSrc ? (
          <img
            src={fallbackSrc || "/placeholder.svg"}
            alt={alt}
            width={width}
            height={height}
            className={cn("object-cover rounded-md", className)}
            style={imgStyle}
            onError={() => {
              // If fallback also fails, show icon
              setHasError(true);
            }}
            {...props}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
            <ImageIcon className="h-8 w-8 mb-2" />
            <span className="text-xs text-center">No image</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative", wrapperClassName)} style={{ width, height }}>
      {/* Loading spinner overlay */}
      {isLoading && showLoadingSpinner && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-muted border border-border rounded-md z-10"
          style={{ width, height }}
        >
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Actual image */}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "rounded-md transition-opacity duration-200",
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

// Alternative simpler version for basic use cases
export function SimpleImageWithFallback({
  src,
  alt,
  className,
  width = 200,
  height = 200,
  ...props
}: {
  src?: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  [key: string]: unknown;
}) {
  return (
    <ImageWithFallback
      src={src || "/placeholder.svg?height=200&width=200"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      fallbackSrc="/placeholder.svg?height=200&width=200"
      {...props}
    />
  );
}
