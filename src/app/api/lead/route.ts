import { NextResponse } from "next/server";

import {
  ADDRESS_MAX,
  ALLOWED_IMAGE_TYPES,
  DEFAULT_JOB_TYPE,
  DEFAULT_URGENCY,
  JOB_TYPES,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  EMAIL_MAX,
  HONEYPOT_FIELD,
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_REQUEST_BYTES,
  NAME_MAX,
  PHONE_MAX,
  PHONE_MAX_DIGITS,
  PHONE_MIN_DIGITS,
  TOWN_MAX,
  URGENCY_OPTIONS,
} from "@/lib/constants";
import {
  clientIp,
  consumeRateLimit,
  noteSubmission,
  peekRateLimit,
} from "@/lib/rate-limit";
import {
  handoffUrl,
  isEmailAddress,
  toDiallable,
} from "@/lib/contact-links";
import { site } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";
import {
  escapeHtml,
  TelegramClient,
  TelegramError,
  type OutboundPhoto,
  type Placement,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Uploading eight photos to Telegram can take a while on a slow connection.
export const maxDuration = 60;

/**
 * Timezone used to stamp leads. Without this, `toLocaleString` uses whatever
 * the server thinks local time is -- UTC on Vercel -- so David would see every
 * lead several hours out, with the date wrong on evening inquiries.
 */
const LEAD_TIMEZONE = process.env.LEAD_TIMEZONE || "America/New_York";

/**
 * Forum topic every lead is delivered into — the "not-contacted" inbox.
 *
 * Leave unset to post into the group's main feed instead.
 */
const TOPIC_ID = Number(process.env.TELEGRAM_TOPIC_ID) || undefined;

type FieldErrors = Record<string, string>;

function bad(error: string, fields?: FieldErrors, status = 400) {
  return NextResponse.json({ ok: false, error, fields }, { status });
}

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Normalise to E.164 when the number is unambiguously North American, so the
 * number Telegram renders is one you can actually tap and dial. Anything else
 * is passed through as typed -- better to show exactly what the customer wrote
 * than to mangle an international number.
 */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return raw.trim();
}

function stamp(): string {
  return new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: LEAD_TIMEZONE,
  });
}

type Lead = {
  name: string;
  phone: string;
  email: string;
  town: string;
  address: string;
  jobType: string;
  urgency: string;
  description: string;
  photoCount: number;
  repeatCount: number;
};

function buildMessage(lead: Lead): string {
  const urgency =
    URGENCY_OPTIONS.find((option) => option.value === lead.urgency) ??
    URGENCY_OPTIONS.find((option) => option.value === DEFAULT_URGENCY)!;

  const job =
    JOB_TYPES.find((option) => option.value === lead.jobType) ?? JOB_TYPES[0];

  const lines: string[] = [];

  lines.push(`<b>${job.flag}</b>  ·  ${urgency.flag}`);

  if (lead.repeatCount > 1) {
    lines.push(
      `⚠️ <i>Submission #${lead.repeatCount} from this number in the last 12h</i>`,
    );
  }

  lines.push("");
  lines.push(`<b>${escapeHtml(lead.name)}</b>`);

  // The number sits alone on its own line with no surrounding characters --
  // that's what lets Telegram clients detect it and make it tap-to-call.
  if (lead.phone) lines.push(escapeHtml(formatPhone(lead.phone)));
  if (lead.email) lines.push(escapeHtml(lead.email));

  lines.push("");
  lines.push("📍 " + escapeHtml([lead.address, lead.town].filter(Boolean).join(", ")));

  lines.push("");
  lines.push(escapeHtml(lead.description));

  lines.push("");
  lines.push(
    `<i>${
      lead.photoCount === 0
        ? "No photos"
        : `${lead.photoCount} photo${lead.photoCount === 1 ? "" : "s"}`
    } · ${stamp()}</i>`,
  );

  return lines.join("\n");
}

/** Filename-safe version of the customer's name, for the photo uploads. */
function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "photo"
  );
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // Deliberately vague to the client; specific in the server log.
    console.error(
      "[lead] Missing env: " +
        [!token && "TELEGRAM_BOT_TOKEN", !chatId && "TELEGRAM_CHAT_ID"]
          .filter(Boolean)
          .join(", "),
    );
    return bad(
      `This form isn't working right now. Please email us at ${site.email}.`,
      undefined,
      500,
    );
  }

  const ip = clientIp(request.headers);

  // Checked before parsing so a flood doesn't get to upload 80MB first.
  const preflight = peekRateLimit(ip);
  if (!preflight.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `You've sent a few requests already. Please wait a few minutes, or email us at ${site.email}.`,
      },
      { status: 429, headers: { "Retry-After": String(preflight.retryAfter) } },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_REQUEST_BYTES) {
    return bad("Those photos are too large. Try sending fewer.", undefined, 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad("We couldn't read that submission. Please try again.");
  }

  // Honeypot: hidden from people, filled in by scripted submitters. Answer as
  // if it worked -- telling a bot it failed just invites a retry.
  if (text(form, HONEYPOT_FIELD)) {
    console.warn(`[lead] Honeypot triggered from ${ip}; dropped silently.`);
    return NextResponse.json({ ok: true, photosSent: 0 });
  }

  const name = text(form, "name");
  const phone = text(form, "phone");
  const email = text(form, "email");
  const town = text(form, "town");
  const address = text(form, "address");
  const description = text(form, "description");
  const urgency = text(form, "urgency") || DEFAULT_URGENCY;
  const jobType = text(form, "jobType") || DEFAULT_JOB_TYPE;

  const fields: FieldErrors = {};

  if (!name) fields.name = "Please enter your name.";
  else if (name.length > NAME_MAX)
    fields.name = `Please keep this under ${NAME_MAX} characters.`;

  /**
   * Both contact routes are mandatory, at David's request.
   *
   * Note what this is *not* for: the reply keyboard doesn't need it. Those
   * buttons are built independently — a phone-only lead still gets Text and
   * Call, an email-only lead still gets Email — so the notification degrades
   * fine either way.
   *
   * The actual gain is a fallback. One contact route means one chance: a
   * mistyped digit or a dead mailbox and the lead is simply unreachable, with
   * no way to tell that from a customer who changed their mind. Two routes
   * means a wrong number can still be emailed.
   *
   * The cost is real and worth remembering if inquiry volume drops — every
   * extra required field loses some completed forms.
   */
  const phoneDigits = phone.replace(/\D/g, "");
  if (!phone) fields.phone = "Please enter a phone number.";
  else if (phone.length > PHONE_MAX)
    fields.phone = "That phone number looks too long.";
  else if (
    phoneDigits.length < PHONE_MIN_DIGITS ||
    phoneDigits.length > PHONE_MAX_DIGITS
  )
    fields.phone = "Please enter a valid phone number.";

  if (!email) fields.email = "Please enter an email address.";
  else if (email.length > EMAIL_MAX)
    fields.email = "That email looks too long.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fields.email = "Please check that email address.";

  if (!JOB_TYPES.some((option) => option.value === jobType))
    fields.jobType = "Please choose which service you need.";

  if (!town) fields.town = "Please tell us the town or ZIP.";
  else if (town.length > TOWN_MAX)
    fields.town = `Please keep this under ${TOWN_MAX} characters.`;

  if (address.length > ADDRESS_MAX)
    fields.address = `Please keep this under ${ADDRESS_MAX} characters.`;

  if (!URGENCY_OPTIONS.some((option) => option.value === urgency))
    fields.urgency = "Please choose a timeframe.";

  if (!description) fields.description = "Please describe the job.";
  else if (description.length < DESCRIPTION_MIN)
    fields.description = `Please add a little more detail (at least ${DESCRIPTION_MIN} characters).`;
  else if (description.length > DESCRIPTION_MAX)
    fields.description = `Please keep this under ${DESCRIPTION_MAX} characters.`;

  // Anything that isn't a plain string field is treated as an upload.
  const uploads = form
    .getAll("photos")
    .filter((entry): entry is File => typeof entry !== "string");

  if (uploads.length > MAX_FILES) {
    fields.photos = `Please attach no more than ${MAX_FILES} photos.`;
  } else {
    for (const file of uploads) {
      if (file.size === 0) {
        fields.photos = "One of those files was empty.";
        break;
      }
      if (file.size > MAX_FILE_BYTES) {
        fields.photos = `"${file.name}" is over ${Math.round(MAX_FILE_BYTES / (1024 * 1024))}MB.`;
        break;
      }
      if (
        !(ALLOWED_IMAGE_TYPES as readonly string[]).includes(
          file.type.toLowerCase(),
        )
      ) {
        fields.photos = `"${file.name}" isn't an image we can accept.`;
        break;
      }
    }
  }

  if (Object.keys(fields).length > 0) {
    return bad("Please check the highlighted fields.", fields);
  }

  // Only a well-formed submission spends one of the three attempts.
  const limit = consumeRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `You've sent a few requests already. Please wait a few minutes, or email us at ${site.email}.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const lead: Lead = {
    name,
    phone,
    email,
    town,
    address,
    jobType,
    urgency,
    description,
    photoCount: uploads.length,
    repeatCount: noteSubmission(phoneDigits),
  };

  const telegram = new TelegramClient(token, chatId);
  const placement: Placement = TOPIC_ID ? { threadId: TOPIC_ID } : {};

  /**
   * Reply buttons, and one for the map.
   *
   * All plain link buttons -- no webhook needed for these, unlike callback
   * buttons. The reply ones point at `/r` on this site rather than at `sms:`,
   * `tel:` or `mailto:` directly, because Telegram only accepts http(s) and
   * tg:// in a button URL and silently rejects the rest. `/r` does the handoff
   * into the native app with the customer's number and a drafted opener
   * already filled in, so replying is one tap and then typing.
   *
   * Text leads Call: a missed call from an unknown number rarely gets picked
   * up, and a text leaves the customer something to read.
   */
  const dialable = toDiallable(lead.phone);
  const replyRow: { text: string; url: string }[] = [];

  if (dialable) {
    replyRow.push({
      text: "💬 Text now",
      url: handoffUrl(siteUrl, "sms", dialable, lead.name),
    });
    replyRow.push({
      text: "📞 Call now",
      url: handoffUrl(siteUrl, "call", dialable, lead.name),
    });
  }
  if (isEmailAddress(lead.email)) {
    replyRow.push({
      text: "✉️ Email now",
      url: handoffUrl(siteUrl, "email", lead.email.trim(), lead.name),
    });
  }

  const mapsQuery = [lead.address, lead.town].filter(Boolean).join(", ");

  const keyboard: { text: string; url: string }[][] = [];
  // Three buttons crowd onto one row on a phone, so email gets its own.
  if (replyRow.length) {
    keyboard.push(replyRow.slice(0, 2));
    if (replyRow.length > 2) keyboard.push(replyRow.slice(2));
  }
  if (mapsQuery) {
    keyboard.push([
      {
        text: "📍 Open in Maps",
        url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
      },
    ]);
  }

  // Step 1: the details. If this fails there's no lead, so it's a hard error.
  const messageText = buildMessage(lead);
  let detailsMessageId: number;

  try {
    try {
      detailsMessageId = await telegram.sendMessage(messageText, {
        ...placement,
        keyboard,
      });
    } catch (error) {
      // If the configured topic has been deleted or renamed out of existence,
      // deliver to the main feed rather than losing the lead. David will
      // notice a lead in the wrong place; he won't notice one that never came.
      if (!placement.threadId) throw error;
      const detail =
        error instanceof TelegramError ? error.message : "unknown error";
      console.warn(
        `[lead] Topic ${placement.threadId} unusable (${detail}); posting to the main feed.`,
      );
      delete placement.threadId;
      detailsMessageId = await telegram.sendMessage(messageText, { keyboard });
    }
  } catch (error) {
    const detail =
      error instanceof TelegramError
        ? `${error.method} -> ${error.message}`
        : "unknown error";
    console.error(`[lead] Telegram sendMessage failed: ${detail}`);
    // Last line of defense: without this the inquiry is gone entirely. The
    // photos can't be recovered from a log, but a name and a phone number can.
    console.error(
      `[lead] LEAD_DELIVERY_FAILED ${JSON.stringify({
        at: stamp(),
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        town: lead.town,
        address: lead.address,
        jobType: lead.jobType,
        urgency: lead.urgency,
        description: lead.description,
        photos: lead.photoCount,
      })}`,
    );
    return bad(
      `We couldn't send your request just now. Please try again, or email us at ${site.email}.`,
      undefined,
      502,
    );
  }

  // Step 2: the photos, attached to the message above so they can never drift
  // apart from their lead when two customers submit at the same moment.
  let photosSent = 0;
  let warning: string | undefined;

  if (uploads.length > 0) {
    const photos: OutboundPhoto[] = uploads.map((file, index) => ({
      blob: file,
      // Telegram needs a filename; don't trust the client's.
      filename: `${slugify(lead.name)}-${index + 1}.jpg`,
    }));

    try {
      photosSent = await telegram.sendPhotos(photos, {
        ...placement,
        replyTo: detailsMessageId,
      });
    } catch (error) {
      const detail =
        error instanceof TelegramError
          ? `${error.method} -> ${error.message}`
          : "unknown error";
      console.error(`[lead] Telegram photo upload failed: ${detail}`);
      warning =
        "Your request was sent, but the photos didn't go through. We'll call you about them.";
    }
  }

  return NextResponse.json({ ok: true, photosSent, warning });
}

/** Anything other than POST. */
export function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
