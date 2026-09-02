"use client";

import { ChevronDown, ChevronUp, ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  BilingualField,
  ConfirmDialog,
  EmptyState,
  FormSection,
  ImageField,
  useToast,
} from "@/components/admin";
import { useRouter } from "@/i18n/navigation";

import { adminWrite, moveRow } from "./request";
import { DANGER_BUTTON, ICON_BUTTON, PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";
import type { GalleryImage } from "./types";

export function MediaPanel({
  universityId,
  logoUrl,
  coverImageUrl,
  images,
}: {
  universityId: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  images: GalleryImage[];
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();

  const [logo, setLogo] = useState(logoUrl);
  const [cover, setCover] = useState(coverImageUrl);
  const [savingMedia, setSavingMedia] = useState(false);

  const [newUrl, setNewUrl] = useState<string | null>(null);
  const [newAlt, setNewAlt] = useState("");
  const [newAltAr, setNewAltAr] = useState("");
  const [adding, setAdding] = useState(false);

  const [movingId, setMovingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const mediaDirty = logo !== logoUrl || cover !== coverImageUrl;

  function reportFailure(message: string | null, fallbackKey: string) {
    toast({
      title: t(fallbackKey),
      description: message ?? undefined,
      tone: "error",
    });
  }

  async function saveMedia() {
    setSavingMedia(true);
    const result = await adminWrite(`/api/admin/universities/${universityId}`, "PATCH", {
      logoUrl: logo ?? "",
      coverImageUrl: cover ?? "",
    });
    setSavingMedia(false);

    if (!result.ok) {
      reportFailure(result.message, "common.saveFailed");
      return;
    }

    toast({ title: t("universities.toasts.saved") });
    router.refresh();
  }

  async function addImage() {
    if (!newUrl) return;
    setAdding(true);
    const result = await adminWrite(
      `/api/admin/universities/${universityId}/images`,
      "POST",
      { url: newUrl, alt: newAlt, altAr: newAltAr },
    );
    setAdding(false);

    if (!result.ok) {
      reportFailure(result.message, "common.saveFailed");
      return;
    }

    setNewUrl(null);
    setNewAlt("");
    setNewAltAr("");
    toast({ title: t("universities.media.added") });
    router.refresh();
  }

  // The whole strip is renumbered from the rendered order, not swapped between
  // the two rows: swapping is a no-op on rows that share a sortOrder, and
  // writing indices into the pair alone misplaces the row whenever the rest of
  // the gallery is not already numbered 0..n-1.
  async function move(index: number, direction: -1 | 1) {
    const moved = images[index];
    if (!moved || !images[index + direction]) return;

    setMovingId(moved.id);
    const result = await moveRow(
      `/api/admin/universities/${universityId}/images`,
      images,
      index,
      direction,
    );
    setMovingId(null);

    if (!result.ok) {
      reportFailure(result.message, "common.saveFailed");
    }

    // Reloaded either way: the renumbering is several requests, so a failure
    // halfway through leaves an order only the server knows.
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await adminWrite(
      `/api/admin/universities/${universityId}/images/${deleteTarget.id}`,
      "DELETE",
    );
    setDeleting(false);

    if (!result.ok) {
      reportFailure(result.message, "common.deleteFailed");
      return;
    }

    setDeleteTarget(null);
    toast({ title: t("universities.media.removed") });
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <FormSection
        title={t("universities.media.brand")}
        description={t("universities.media.brandHint")}
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <ImageField
            value={logo}
            onChange={setLogo}
            folder="universities"
            aspect="square"
            label={t("universities.fields.logo")}
            hint={t("universities.hints.logo")}
          />
          <ImageField
            value={cover}
            onChange={setCover}
            folder="universities"
            aspect="video"
            label={t("universities.fields.coverImage")}
            hint={t("universities.hints.coverImage")}
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {mediaDirty ? (
            <p className="me-auto text-[12.5px] text-[#B77714]">
              {t("common.unsavedChanges")}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => void saveMedia()}
            disabled={savingMedia || !mediaDirty}
            className={PRIMARY_BUTTON}
          >
            {savingMedia ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : null}
            {savingMedia ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </FormSection>

      <FormSection
        title={t("universities.media.gallery")}
        description={t("universities.media.galleryHint")}
      >
        {images.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title={t("universities.media.emptyTitle")}
            description={t("universities.media.emptyDescription")}
          />
        ) : (
          <ul className="space-y-3">
            {images.map((image, index) => (
              <li
                key={image.id}
                className="rounded-xl border border-slate-200/80 bg-white p-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="h-24 w-full shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:w-40">
                    {/* eslint-disable-next-line @next/next/no-img-element -- gallery
                        media is served from Supabase Storage or a host the editor
                        pasted, so next/image's loader cannot be relied on. */}
                    <img src={image.url} alt="" className="size-full object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <GalleryAltFields
                      universityId={universityId}
                      image={image}
                      onFailure={reportFailure}
                    />
                  </div>

                  <div className="flex shrink-0 items-start gap-1.5">
                    <button
                      type="button"
                      onClick={() => void move(index, -1)}
                      disabled={index === 0 || movingId !== null}
                      aria-label={t("universities.media.moveUp")}
                      title={t("universities.media.moveUp")}
                      className={ICON_BUTTON}
                    >
                      {movingId === image.id ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      ) : (
                        <ChevronUp className="size-4" aria-hidden />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => void move(index, 1)}
                      disabled={index === images.length - 1 || movingId !== null}
                      aria-label={t("universities.media.moveDown")}
                      title={t("universities.media.moveDown")}
                      className={ICON_BUTTON}
                    >
                      <ChevronDown className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(image)}
                      aria-label={t("common.remove")}
                      title={t("common.remove")}
                      className={`${DANGER_BUTTON} size-9 justify-center px-0`}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
          <h3 className="text-[13.5px] font-semibold text-[#334155]">
            {t("universities.media.addTitle")}
          </h3>

          <div className="mt-3 space-y-4">
            <ImageField
              value={newUrl}
              onChange={setNewUrl}
              folder="universities"
              aspect="video"
            />
            <BilingualField
              label={t("universities.media.alt")}
              hint={t("universities.media.altHint")}
              en={{
                value: newAlt,
                onChange: (event) => setNewAlt(event.target.value),
              }}
              ar={{
                value: newAltAr,
                onChange: (event) => setNewAltAr(event.target.value),
              }}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => void addImage()}
                disabled={!newUrl || adding}
                className={PRIMARY_BUTTON}
              >
                {adding ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Plus className="size-4" aria-hidden />
                )}
                {t("universities.media.add")}
              </button>
            </div>
          </div>
        </div>
      </FormSection>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        destructive
        pending={deleting}
        title={t("universities.media.deleteTitle")}
        description={t("universities.media.deleteDescription")}
        confirmLabel={t("common.delete")}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}

/** The alt pair saves on its own so a caption edit never touches the ordering. */
function GalleryAltFields({
  universityId,
  image,
  onFailure,
}: {
  universityId: string;
  image: GalleryImage;
  onFailure: (message: string | null, fallbackKey: string) => void;
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { toast } = useToast();

  const [alt, setAlt] = useState(image.alt ?? "");
  const [altAr, setAltAr] = useState(image.altAr ?? "");
  const [pending, setPending] = useState(false);

  const dirty = alt !== (image.alt ?? "") || altAr !== (image.altAr ?? "");

  async function save() {
    setPending(true);
    const result = await adminWrite(
      `/api/admin/universities/${universityId}/images/${image.id}`,
      "PATCH",
      { alt, altAr },
    );
    setPending(false);

    if (!result.ok) {
      onFailure(result.message, "common.saveFailed");
      return;
    }

    toast({ title: t("universities.toasts.saved") });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <BilingualField
        label={t("universities.media.alt")}
        en={{ value: alt, onChange: (event) => setAlt(event.target.value) }}
        ar={{ value: altAr, onChange: (event) => setAltAr(event.target.value) }}
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void save()}
          disabled={!dirty || pending}
          className={SECONDARY_BUTTON}
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending ? t("common.saving") : t("common.save")}
        </button>
      </div>
    </div>
  );
}
