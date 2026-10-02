"use client";

import { useState } from "react";
import SafeImage from "@/app/ui/SafeImage";
import { cn } from "@/lib/cn";

const GearGallery = ({ images, name }: { images: string[]; name: string }) => {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <SafeImage
          key={current}
          src={current}
          alt={name}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <li key={`${image}-${index}`}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={selected === index}
                className={cn(
                  "relative block aspect-square w-full cursor-pointer overflow-hidden rounded-lg border-2 bg-slate-100",
                  selected === index ? "border-brand-600" : "border-transparent hover:border-slate-300",
                )}
              >
                <SafeImage src={image} alt="" sizes="120px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GearGallery;
