"use client";

import { Camera, Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Avatar, type SessionUser } from "@/components/account-menu";
import { MAX_AVATAR_BYTES } from "@/lib/image-upload";

// Mirrors the server's accepted formats. This is a convenience filter for the
// file picker only: the server sniffs the real signature and does not trust it.
const ACCEPT = "image/jpeg,image/png,image/webp";

export function AvatarUploader({
  user,
  storageReady,
  children,
}: {
  user: SessionUser;
  /** False when the server has no Supabase credentials configured. */
  storageReady: boolean;
  /** Identity block (name, email) rendered above the upload controls. */
  children?: React.ReactNode;
}) {
  const t = useTranslations("AppProfile.avatar");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState(user.image);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Revoke the object URL when it changes or the component unmounts, so the
  // blob does not leak for the life of the page.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function messageFor(status: number, reason?: string) {
    if (status === 413 || reason === "TOO_LARGE") return t("errorTooLarge");
    if (status === 415 || reason === "UNSUPPORTED_FORMAT") return t("errorFormat");
    if (status === 429) return t("errorRateLimited");
    if (status === 503) return t("errorNotConfigured");
    return t("errorGeneric");
  }

  async function upload(file: File) {
    setError(null);

    // Fail fast on the obvious cases so an oversized file is never uploaded.
    if (file.size > MAX_AVATAR_BYTES) {
      setError(t("errorTooLarge"));
      return;
    }
    if (!ACCEPT.split(",").includes(file.type)) {
      setError(t("errorFormat"));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setBusy(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body,
      });

      const payload: { image?: string; error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        setError(messageFor(response.status, payload.error));
        return;
      }

      setImage(payload.image ?? null);
      // Refresh so the header and sidebar avatars pick up the new image.
      router.refresh();
    } catch (uploadError) {
      console.error("Unable to upload the avatar", uploadError);
      setError(t("errorGeneric"));
    } finally {
      setBusy(false);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/profile/avatar", { method: "DELETE" });
      if (!response.ok) {
        setError(messageFor(response.status));
        return;
      }
      setImage(null);
      router.refresh();
    } catch (removeError) {
      console.error("Unable to remove the avatar", removeError);
      setError(t("errorGeneric"));
    } finally {
      setBusy(false);
    }
  }

  const shown: SessionUser = { ...user, image: preview ?? image };

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="relative">
        <Avatar user={shown} className="size-20 ring-4 ring-white" />
        {busy ? (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-white/70">
            <Loader2 className="size-5 animate-spin text-[#1E6DEB]" aria-hidden />
          </span>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        {children}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy || !storageReady}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#1E6DEB] px-4 text-sm font-bold text-white transition-colors hover:bg-[#1859c4] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Camera className="size-4" aria-hidden />
            {image ? t("change") : t("upload")}
          </button>

          {image ? (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#C81F15] transition-colors hover:bg-[#FFF0EE] disabled:opacity-60"
            >
              <Trash2 className="size-4" aria-hidden />
              {t("remove")}
            </button>
          ) : null}
        </div>

        <p className="mt-2 text-xs text-[#5a6072]">{t("hint")}</p>

        {!storageReady ? (
          <p className="mt-1 text-xs font-semibold text-[#B77714]">
            {t("errorNotConfigured")}
          </p>
        ) : null}

        {error ? (
          <p role="alert" className="mt-1 text-xs font-semibold text-[#C81F15]">
            {error}
          </p>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        aria-label={t("upload")}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
    </div>
  );
}
