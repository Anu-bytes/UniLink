"use client";

import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { TextInput } from "./form";
// Type-only, and it must stay that way: supabase-storage.ts holds the
// service-role client, so a value import would drag it into the client bundle.
import type { MediaFolder } from "@/lib/supabase-storage";

const ASPECTS = {
  square: "aspect-square max-w-[220px]",
  video: "aspect-video",
  wide: "aspect-[3/1]",
} as const;

export type ImageAspect = keyof typeof ASPECTS;

export function ImageField({
  value,
  onChange,
  folder,
  label,
  hint,
  aspect = "video",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: MediaFolder;
  label?: string;
  hint?: string;
  aspect?: ImageAspect;
}) {
  const t = useTranslations("Admin");
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function messageFor(status: number) {
    if (status === 413) return t("common.tooLarge");
    if (status === 415) return t("common.unsupportedFormat");
    if (status === 503) return t("common.storageUnavailable");
    return t("common.uploadFailed");
  }

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);

      const response = await fetch("/api/admin/media", { method: "POST", body });
      if (!response.ok) {
        setError(messageFor(response.status));
        return;
      }

      const data = (await response.json()) as { url?: string };
      if (!data.url) {
        setError(t("common.uploadFailed"));
        return;
      }
      onChange(data.url);
    } catch {
      setError(t("common.uploadFailed"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      {label ? (
        <p className="text-[13px] font-semibold text-[#334155]">{label}</p>
      ) : null}

      {value ? (
        <div className="space-y-2">
          <div
            className={cn(
              "overflow-hidden rounded-xl border border-slate-200 bg-slate-50",
              ASPECTS[aspect],
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- catalogue
                media is served from Supabase Storage or an arbitrary host the
                editor pasted, so next/image's loader cannot be relied on. */}
            <img src={value} alt="" className="size-full object-cover" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold text-[#334155] transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Upload className="size-4" aria-hidden />
              )}
              {t("common.replace")}
            </button>
            {/* Only clears the field. The stored object is deleted server-side
                when the record is saved, so a cancelled edit loses nothing. */}
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={uploading}
              className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-[#C81F15] transition-colors hover:bg-[#FFF0EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F82C1F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="size-4" aria-hidden />
              {t("common.remove")}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files[0];
            if (file) void upload(file);
          }}
          disabled={uploading}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E6DEB] disabled:cursor-not-allowed",
            dragging
              ? "border-[#1E6DEB] bg-[#EAF2FE]"
              : "border-slate-300 bg-slate-50/60 hover:bg-slate-50",
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-[#EAF2FE] text-[#1E6DEB]">
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <ImagePlus className="size-4" aria-hidden />
            )}
          </span>
          <span className="text-[13.5px] font-semibold text-[#334155]">
            {t("common.upload")}
          </span>
          <span className="text-[12.5px] text-[#64748B]">{t("common.uploadHint")}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Reset so picking the same file twice still fires a change.
          event.target.value = "";
          if (file) void upload(file);
        }}
      />

      {/* Storage is optional (isStorageConfigured can be false) and half the
          catalogue's logos live on the universities' own domains, so a plain
          URL is a first-class way to fill this in, not a fallback hidden in a
          menu. */}
      <label className="block space-y-1 pt-1">
        <span className="block text-[12.5px] text-[#64748B]">
          {t("common.imageUrl")}
        </span>
        <TextInput
          type="url"
          dir="ltr"
          inputMode="url"
          placeholder="https://"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value.trim() || null)}
        />
      </label>

      {error ? (
        <p className="text-[12.5px] font-medium text-[#C81F15]">{error}</p>
      ) : hint ? (
        <p className="text-[12.5px] text-[#64748B]">{hint}</p>
      ) : null}
    </div>
  );
}
