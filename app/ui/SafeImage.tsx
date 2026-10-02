"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { isHttpUrl } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Renders a remote image that can come from any host (providers paste their own URLs),
 * with a graceful placeholder when the URL is missing, invalid or fails to load.
 * The parent must be `relative` and have a size / aspect ratio.
 */
const SafeImage = ({
  src,
  alt,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  className,
  priority = false,
}: {
  src: string | null | undefined;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = isHttpUrl(src) && failedSrc !== src;

  if (!showImage) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400",
          className,
        )}
      >
        <ImageOff className="size-8" aria-hidden="true" />
      </div>
    );
  }

  // An image that failed before React hydrated never fires onError, so check it on mount.
  const handleRef = (image: HTMLImageElement | null) => {
    if (image && image.complete && image.naturalWidth === 0) setFailedSrc(src);
  };

  return (
    <Image
      ref={handleRef}
      src={src}
      alt={alt}
      fill
      unoptimized
      priority={priority}
      sizes={sizes}
      onError={() => setFailedSrc(src)}
      className={cn("object-cover", className)}
    />
  );
};

export default SafeImage;
