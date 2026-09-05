"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 8 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (images.length + files.length > maxImages) {
      toast.error(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    setIsUploading(true);
    try {
      const sigRes = await fetch("/api/cloudinary-signature", { method: "POST" });
      if (!sigRes.ok) throw new Error("Could not authorize upload.");
      const { signature, timestamp, folder, apiKey, cloudName } = await sigRes.json();

      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", folder);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          throw new Error(errBody?.error?.message ?? "Upload failed.");
        }

        const data = await res.json();
        uploaded.push(data.secure_url as string);
      }

      onChange([...images, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img, i) => (
          <div key={img + i} className="group relative aspect-square overflow-hidden rounded-lg border border-navy-700">
            <Image src={img} alt="" fill sizes="120px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute right-1 top-1 rounded-full bg-navy-950/90 p-1 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-navy-700 text-slate-500 transition hover:border-solar-500 hover:text-solar-400 disabled:opacity-50"
          >
            {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
            <span className="text-[11px]">{isUploading ? "Uploading..." : "Add image"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
