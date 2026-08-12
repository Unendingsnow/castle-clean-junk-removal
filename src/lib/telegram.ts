import "server-only";

/**
 * Minimal Telegram Bot API client.
 *
 * The bot token appears in the request URL (`/bot<token>/sendMessage`), which
 * makes it very easy to leak by accident -- one `console.error(url)` or one
 * error object stringified into a response body and the token is public. So the
 * token never leaves this module: callers get a `TelegramError` whose message
 * has already been scrubbed, and the URL is never attached to anything.
 */

const API_ORIGIN = "https://api.telegram.org";

export class TelegramError extends Error {
  constructor(
    message: string,
    readonly method: string,
    readonly httpStatus: number,
  ) {
    super(message);
    this.name = "TelegramError";
  }
}

/** Remove every occurrence of the token from a string. */
function scrub(text: string, token: string): string {
  if (!token) return text;
  let out = text.split(token).join("[REDACTED]");
  // Also catch the bare secret half, in case only that part got embedded.
  const secret = token.split(":")[1];
  if (secret && secret.length > 8) out = out.split(secret).join("[REDACTED]");
  return out;
}

type TelegramResponse = {
  ok?: boolean;
  description?: string;
  result?: unknown;
};

async function call(
  token: string,
  method: string,
  body: FormData,
): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(`${API_ORIGIN}/bot${token}/${method}`, {
      method: "POST",
      body,
      // Telegram is slow with big media; don't hang forever either.
      signal: AbortSignal.timeout(45_000),
    });
  } catch (error) {
    // A network-level failure. The URL can appear in fetch error messages
    // (undici includes it on some failures), so scrub before re-throwing.
    const detail = error instanceof Error ? error.message : "Network error";
    throw new TelegramError(scrub(detail, token), method, 0);
  }

  let payload: TelegramResponse | null = null;
  try {
    payload = (await response.json()) as TelegramResponse;
  } catch {
    // Non-JSON body (proxy error page, rate-limit HTML, etc.)
  }

  if (!response.ok || !payload?.ok) {
    const description =
      typeof payload?.description === "string"
        ? payload.description
        : `HTTP ${response.status}`;
    throw new TelegramError(scrub(description, token), method, response.status);
  }

  return payload.result;
}

export type OutboundPhoto = {
  blob: Blob;
  filename: string;
};

/** Placement options shared by every message we send for one lead. */
export type Placement = {
  /** Forum topic to post into, when the destination is a forum supergroup. */
  threadId?: number;
  /** Message to attach this to, so the two stay visually bound together. */
  replyTo?: number;
};

function applyPlacement(form: FormData, placement: Placement) {
  if (placement.threadId !== undefined) {
    form.append("message_thread_id", String(placement.threadId));
  }
  if (placement.replyTo !== undefined) {
    // reply_parameters supersedes the deprecated reply_to_message_id.
    form.append(
      "reply_parameters",
      JSON.stringify({
        message_id: placement.replyTo,
        // If the target is gone, still deliver rather than erroring out.
        allow_sending_without_reply: true,
      }),
    );
  }
}

export class TelegramClient {
  constructor(
    private readonly token: string,
    private readonly chatId: string,
  ) {}

  /**
   * Send the lead details as an HTML-formatted message.
   *
   * Returns the message id so the photos can be attached to it.
   */
  async sendMessage(
    text: string,
    options: Placement & { keyboard?: unknown[][] } = {},
  ): Promise<number> {
    const form = new FormData();
    form.append("chat_id", this.chatId);
    form.append("text", text);
    form.append("parse_mode", "HTML");
    form.append("link_preview_options", JSON.stringify({ is_disabled: true }));
    applyPlacement(form, options);

    if (options.keyboard?.length) {
      // Link buttons only. Callback buttons would need an inbound webhook, and
      // tel: isn't an accepted scheme here anyway -- which is exactly why the
      // phone number stays as plain text on its own line, where Telegram's own
      // linkifier turns it into tap-to-call.
      form.append(
        "reply_markup",
        JSON.stringify({ inline_keyboard: options.keyboard }),
      );
    }

    const result = (await call(this.token, "sendMessage", form)) as {
      message_id: number;
    };
    return result.message_id;
  }

  /**
   * Send the attached photos.
   *
   * Telegram has three distinct behaviours here and getting them wrong is the
   * usual source of "why did nothing arrive":
   *   - 0 photos: there is no endpoint to call, so don't call one.
   *   - 1 photo:  sendMediaGroup rejects a single-item array outright, so this
   *               has to go through sendPhoto.
   *   - 2-10:     sendMediaGroup, with the binaries attached separately and
   *               referenced by `attach://<field-name>` from the media JSON.
   *
   * Returns the number of photos handed to Telegram.
   */
  async sendPhotos(
    photos: OutboundPhoto[],
    placement: Placement = {},
  ): Promise<number> {
    if (photos.length === 0) return 0;

    if (photos.length === 1) {
      const form = new FormData();
      form.append("chat_id", this.chatId);
      form.append("photo", photos[0].blob, photos[0].filename);
      applyPlacement(form, placement);
      await call(this.token, "sendPhoto", form);
      return 1;
    }

    // MAX_FILES is 8, so this is always a single group -- but chunk anyway so
    // raising the cap later can't silently produce an 11-item request.
    let sent = 0;
    for (let start = 0; start < photos.length; start += 10) {
      const chunk = photos.slice(start, start + 10);

      if (chunk.length === 1) {
        // A trailing remainder of exactly one still can't use a media group.
        const form = new FormData();
        form.append("chat_id", this.chatId);
        form.append("photo", chunk[0].blob, chunk[0].filename);
        applyPlacement(form, placement);
        await call(this.token, "sendPhoto", form);
        sent += 1;
        continue;
      }

      const form = new FormData();
      form.append("chat_id", this.chatId);
      form.append(
        "media",
        JSON.stringify(
          chunk.map((_, index) => ({
            type: "photo",
            media: `attach://photo${index}`,
          })),
        ),
      );
      chunk.forEach((photo, index) => {
        form.append(`photo${index}`, photo.blob, photo.filename);
      });
      applyPlacement(form, placement);

      await call(this.token, "sendMediaGroup", form);
      sent += chunk.length;
    }

    return sent;
  }
}

/** Escape user-supplied text for Telegram's HTML parse mode. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
