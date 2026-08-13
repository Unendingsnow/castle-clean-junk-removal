/**
 * Limits shared by the browser and the API route.
 *
 * Both sides import from here so the client-side guardrails and the
 * server-side validation can never drift apart.
 */

/** Telegram's media group tops out at 10 items; we cap lower on purpose. */
export const MAX_FILES = 8;

/** Telegram rejects multipart photo uploads larger than 10MB. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

/**
 * Rough ceiling for the whole request, checked against Content-Length before
 * we parse anything. MAX_FILES * MAX_FILE_BYTES plus multipart overhead.
 */
export const MAX_REQUEST_BYTES = MAX_FILES * MAX_FILE_BYTES + 1024 * 1024;

/** Longest edge, in px, that a photo is downscaled to before upload. */
export const MAX_EDGE_PX = 1600;

/** JPEG quality used when re-encoding in the browser. */
export const JPEG_QUALITY = 0.8;

export const DESCRIPTION_MIN = 10;
export const DESCRIPTION_MAX = 2000;

export const NAME_MAX = 120;
export const PHONE_MAX = 40;
export const ADDRESS_MAX = 300;
export const TOWN_MAX = 120;
export const EMAIL_MAX = 254;

/** Minimum digit count for something to plausibly be a phone number. */
export const PHONE_MIN_DIGITS = 7;
export const PHONE_MAX_DIGITS = 20;

/**
 * How soon the customer needs the job done. Surfaced at the top of the
 * Telegram message so leads can be worked in priority order rather than
 * strictly newest-first.
 */
export const URGENCY_OPTIONS = [
  { value: "asap", label: "As soon as possible", flag: "🔴 ASAP" },
  { value: "week", label: "Within the next week", flag: "🟡 This week" },
  { value: "flexible", label: "No rush — I'm flexible", flag: "🟢 Flexible" },
] as const;

export type UrgencyValue = (typeof URGENCY_OPTIONS)[number]["value"];

export const DEFAULT_URGENCY: UrgencyValue = "week";

/**
 * Which of the two services the enquiry is for. These are completely
 * different jobs -- one is a crew-of-one day's work, the other is a drop-off
 * and a collection five days later -- so it leads the Telegram message.
 */
export const JOB_TYPES = [
  {
    value: "full-service",
    label: "Full service",
    hint: "You point, we load and haul",
    flag: "🚚 FULL SERVICE",
  },
  {
    value: "trailer",
    label: "Trailer drop-off",
    hint: "$300 flat, you load it",
    flag: "🛻 TRAILER RENTAL",
  },
  {
    value: "unsure",
    label: "Not sure yet",
    hint: "Help me pick",
    flag: "❓ UNDECIDED",
  },
] as const;

export const DEFAULT_JOB_TYPE = "full-service";

/**
 * Accepted upload types. The browser re-encodes everything to JPEG, so in
 * practice only image/jpeg arrives -- the rest are here so a submission from a
 * browser where canvas encoding failed still goes through.
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
] as const;

export const RATE_LIMIT_MAX = 3;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/**
 * Window for spotting the same phone number submitting more than once. Repeats
 * are flagged in the Telegram message rather than blocked -- a customer
 * remembering an extra detail is not abuse.
 */
export const DUPLICATE_WINDOW_MS = 12 * 60 * 60 * 1000;

/**
 * Name of the honeypot field. Hidden from people, irresistible to scripted
 * form-fillers. Anything that arrives with this populated is dropped.
 */
export const HONEYPOT_FIELD = "company_website";
