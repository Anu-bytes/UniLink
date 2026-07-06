import type { FeeBucket, FeeBucketId } from "@/lib/types";

// Tuition fee buckets in EGP (SRS 3.2.3). A program matches a bucket when
// its [minFees, maxFees] range overlaps the bucket range.
export const FEE_BUCKETS: FeeBucket[] = [
  { id: "budget", label: { en: "Budget Friendly", ar: "اقتصادي" }, min: null, max: 50000 },
  { id: "mid", label: { en: "Mid-Range", ar: "متوسط" }, min: 50000, max: 100000 },
  { id: "upper-mid", label: { en: "Upper Mid-Range", ar: "فوق المتوسط" }, min: 100000, max: 150000 },
  { id: "premium", label: { en: "Premium", ar: "مميز" }, min: 150000, max: 250000 },
  { id: "elite", label: { en: "Elite", ar: "نخبة" }, min: 250000, max: null },
];

const byId = new Map(FEE_BUCKETS.map((b) => [b.id, b]));

export function getFeeBucket(id: FeeBucketId): FeeBucket | undefined {
  return byId.get(id);
}

/** Does [min,max] overlap the bucket's range? */
export function overlapsBucket(min: number, max: number, bucket: FeeBucket): boolean {
  const lo = bucket.min ?? -Infinity;
  const hi = bucket.max ?? Infinity;
  return min <= hi && max >= lo;
}
