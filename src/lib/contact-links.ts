/**
 * Links that get David from a Telegram notification into the right app, with
 * the customer's details already filled in.
 *
 * The awkward constraint this exists to work around:
 *
 * Telegram's inline keyboard buttons only accept `http(s)://` and `tg://`
 * URLs. `sms:`, `tel:` and `mailto:` are rejected outright, so a button
 * cannot open a native app directly — which is why the phone number used to
 * sit alone on its own line and rely on Telegram's own linkifier.
 *
 * So the buttons point at `/r` on this site over HTTPS, and that page performs
 * the handoff to the native scheme. One extra hop, but it turns three taps and
 * a copy-paste into one tap.
 *
 * Both ends of that hop live here so the API route and the handoff page can
 * never disagree about what a valid target looks like.
 */

export const HANDOFF_ACTIONS = ["sms", "call", "email"] as const;
export type HandoffAction = (typeof HANDOFF_ACTIONS)[number];

export function isHandoffAction(value: unknown): value is HandoffAction {
  return (
    typeof value === "string" &&
    (HANDOFF_ACTIONS as readonly string[]).includes(value)
  );
}

/**
 * Reduce a typed phone number to something diallable.
 *
 * Returns E.164 (`+19105551234`) or null when it can't be trusted. Null is a
 * real outcome, not a formality: the value ends up in a `tel:` URL, and a
 * malformed one produces a button that silently does nothing.
 */
export function toDiallable(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const hadPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (hadPlus) {
    // Already international; trust it if the length is plausible.
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }
  // Bare 10-digit US number, which is what almost everyone types here.
  if (digits.length === 10) return `+1${digits}`;
  // 11 digits starting with the US country code.
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;

  return null;
}

/** Same check both sides of the wire use, so neither can drift. */
export function isEmailAddress(raw: string): boolean {
  const value = raw.trim();
  return value.length > 0 && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * First name only, for the greeting the reply is pre-filled with.
 *
 * "Hi Dave," reads like a person; "Hi Dave Thompson," reads like a mail merge.
 */
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? "";
}

/**
 * The opener each reply is seeded with.
 *
 * Deliberately unfinished — it ends mid-sentence so David lands in the app
 * with the cursor after a greeting he'd have typed anyway, and still has to
 * write the actual reply. A fully drafted message would get sent unread.
 */
export function draftBody(name: string): string {
  const who = firstName(name);
  return `Hi${who ? ` ${who}` : ""}, it's David from Castle Clean about your junk removal quote — `;
}

export const EMAIL_SUBJECT = "Your Castle Clean quote";

/** Ceiling on the name echoed back into the handoff page. */
export const NAME_DISPLAY_MAX = 60;

/**
 * The HTTPS URL that goes in the Telegram button.
 *
 * Absolute, because a Telegram button has no page to be relative to.
 */
export function handoffUrl(
  origin: string,
  action: HandoffAction,
  target: string,
  name: string,
): string {
  const params = new URLSearchParams({ a: action, t: target });
  const who = firstName(name);
  if (who) params.set("n", who);
  return `${origin}/r?${params.toString()}`;
}
