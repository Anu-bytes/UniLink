/** Stable codes on the wire; clients can translate without showing raw server text. */
const messages = {
  INVALID_INPUT: ["Check the value in this field.", "تحقّق من القيمة في هذا الحقل."],
  REQUIRED: ["This field is required.", "هذا الحقل مطلوب."],
  INVALID_URL: ["Enter a valid HTTP or HTTPS URL.", "أدخل رابطاً صالحاً يبدأ بـ HTTP أو HTTPS."],
  INVALID_EMAIL: ["Enter a valid email address.", "أدخل عنوان بريد إلكتروني صالحاً."],
  EMPTY_SLUG: ["The URL identifier must contain letters or numbers.", "يجب أن يحتوي المعرّف في الرابط على حروف أو أرقام."],
  SCORE_RANGE: ["Enter a score within the range for the selected test.", "أدخل درجة ضمن النطاق المسموح للاختبار المحدد."],
  PERCENT_RANGE: ["A percentage must be between 0 and 100.", "يجب أن تكون النسبة المئوية بين ٠ و١٠٠."],
  NOT_FOUND: ["This record no longer exists. Refresh the page.", "لم يعد هذا السجل موجوداً. حدّث الصفحة."],
  CONFLICT: ["This change conflicts with an existing record or a protected action.", "يتعارض هذا التغيير مع سجل موجود أو إجراء محمي."],
  WRONG_FACULTY: ["Select a faculty belonging to this university.", "اختر كلية تابعة لهذه الجامعة."],
  UNAUTHORIZED: ["Your session has expired. Sign in again.", "انتهت جلستك. سجّل الدخول مجدداً."],
  FORBIDDEN: ["You no longer have permission to make this change.", "لم تعد لديك صلاحية لإجراء هذا التغيير."],
  FAILED: ["The change could not be saved. Please try again.", "تعذّر حفظ التغيير. حاول مجدداً."],
} as const;
export type AdminErrorCode = keyof typeof messages;

export function adminErrorCode(message: string): AdminErrorCode {
  if (/slug cannot be empty/i.test(message)) return "EMPTY_SLUG";
  if (/required/i.test(message)) return "REQUIRED";
  if (/valid URL/i.test(message)) return "INVALID_URL";
  if (/email/i.test(message)) return "INVALID_EMAIL";
  if (/faculty.*belong/i.test(message)) return "WRONG_FACULTY";
  return "INVALID_INPUT";
}

export function adminErrorMessage(payload: unknown, status: number): string {
  const detail = payload as { code?: string; error?: string } | null;
  const code = typeof detail?.code === "string" && Object.hasOwn(messages, detail.code) ? detail.code as AdminErrorCode
    : status === 401 ? "UNAUTHORIZED" : status === 403 ? "FORBIDDEN"
    : status === 404 ? "NOT_FOUND" : status === 409 ? "CONFLICT"
    : status === 400 ? adminErrorCode(typeof detail?.error === "string" ? detail.error : "") : "FAILED";
  const arabic = typeof document !== "undefined" && document.documentElement.lang === "ar";
  return messages[code][arabic ? 1 : 0];
}
