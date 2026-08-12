# Castle Clean Junk Removal — Landing Page

*We clear. You keep.*

A single-page Next.js 15 site with a quote request form that delivers leads
straight to Telegram: the details as a message, the photos attached beneath it.

- **Next.js 15** (App Router) · **TypeScript** · **Tailwind CSS v4**
- Photos are downscaled **in the browser** before upload
- Bot token stays **server-side only**
- Nothing runs between submissions — no bot process, no database

---

## How the lead actually flows

Worth being explicit, because "Telegram bot" makes it sound like there's a
daemon somewhere. There isn't.

```
Customer (website)  ──form──►  /api/lead  ──HTTPS──►  Telegram  ──►  David
                                                                      │
                                     David taps the phone number ─────┘
                                     and calls/texts them directly
```

**Customers never touch Telegram.** They fill in the form on the website. The
lead lands in David's Telegram, where the phone number is rendered as
tap-to-call so he can reach them from his phone whenever he's free. Telegram is
David's workspace, standing in for the SMS/MMS limits he'd otherwise hit — it is
not a customer channel.

That's why the phone number sits **alone on its own line** in the message. It's
the one formatting detail the whole system depends on: Telegram's client only
linkifies a number when nothing else shares the line. Don't wrap it in labels,
bold, or code formatting.

---

## Quick start

```bash
npm install
cp .env.example .env    # then fill in the values (see below)
npm run dev
```

Open http://localhost:3000.

---

## Telegram setup

### 1. Create the bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather).
2. Send `/newbot`.
3. Give it a display name (e.g. `Castle Clean Leads`).
4. Give it a username — must be unique and end in `bot`.
5. BotFather replies with a token like `1234567890:AAF...`. That token is a
   password for the bot — treat it as one.

```
TELEGRAM_BOT_TOKEN=1234567890:AAF...
```

### 2. Start a chat with the bot

A bot **cannot message you first**. You have to open the conversation.

- **Personal delivery:** search for the bot's username, open it, press **Start**.
- **Team delivery:** create a group, add the bot, then send any message in it.

### 3. Find your chat id

```
https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
```

Look for `"chat":{"id":...}`:

- Personal chat → positive, e.g. `987654321`
- Group → negative, e.g. `-1001234567890`

If `result` is empty you skipped step 2.

> **Groups:** bots only see messages that mention them or start with `/`, unless
> you make the bot an admin or disable privacy via BotFather → `/setprivacy`.
> That only affects *reading*; sending always works.

> ⚠️ **Basic groups can change their id.** A basic group silently migrates to a
> supergroup when it's made public, gains a linked channel, or grows past the
> member limit — and **the chat id changes** to a `-100…` form. Sends then fail
> with `group chat was upgraded to a supergroup chat` and leads stop arriving
> with nothing visibly broken. Re-run `getUpdates` and update the id if that
> happens. Creating the destination as a supergroup avoids it entirely.

### 4. Set the timezone

```
LEAD_TIMEZONE=America/New_York
```

Without this, timestamps use the server's clock — UTC on Vercel — so every lead
shows the wrong time and evening enquiries get the wrong date.

### 5. Restart

Next.js reads `.env` at boot, so restart after editing it.

---

## Organising leads in Telegram

At ten leads a week a flat feed is fine. At fifty it isn't: there's no "done",
no search, and photos from one lead can land next to another lead's phone
number.

### Delivery topic

Every lead is posted into one fixed forum topic — the **not-contacted** inbox —
with its photos attached beneath it.

```
TELEGRAM_TOPIC_ID=11
```

To find a topic's number, open it in Telegram Web and read the last segment of
the URL (`https://web.telegram.org/a/#-1004463406472_11` → `11`). Leave the
variable unset to post into the group's main feed instead.

If that topic is ever deleted, the route logs a warning and delivers to the main
feed rather than failing. A lead in the wrong place gets noticed; one that never
arrives doesn't.

### Moving a lead once it's been contacted

Telegram **cannot move a message between topics** — not by hand, and not via the
API. To shift a lead from *not-contacted* to *contacted*, David forwards it
(long-press → Forward → same group → pick the topic), then deletes the original.
Selecting the message and its photo album together forwards them in one go.

So it's two gestures rather than one. The alternative — a thread per lead that
gets closed when done — is one gesture but produces a topic per job. Fixed
buckets were the call here; this is the trade that comes with them.

> **Deliberately not built:** callback buttons on each lead
> (Contacted / Quoted / Booked). They work, but they need an inbound webhook and
> a `setWebhook` call after every deploy to a new URL — and setting a webhook
> disables `getUpdates`, which is how you recover a chat id when a group
> migrates. Not worth the deploy ceremony.

---

## How the form works

### In the browser

Phone cameras produce 5–12MB photos and Telegram rejects any multipart photo
over 10MB, so nothing is uploaded raw:

1. Decoded with `createImageBitmap(file, { imageOrientation: "from-image" })`,
   which applies EXIF rotation so photos aren't sideways.
2. Drawn into a canvas scaled so the **longest edge is at most 1600px**.
3. Re-encoded as **JPEG at 0.8 quality**.

A 12MP photo lands at 200–400KB. Verified: 4032×3024 / 1.12MB → 1600×1200 /
257KB. If re-encoding would make an already-small image larger, the original is
kept.

Thumbnails render from object URLs, each with a remove button; URLs are revoked
on removal, on success, and on unmount.

### On the server — `POST /api/lead`

**Step 1 — details.** `sendMessage` with HTML formatting, returning the message
id. Urgency and reference lead the message; the phone number sits alone on its
own line.

**Step 2 — photos**, sent as a **reply to step 1** so they stay bound to their
lead even when two customers submit simultaneously.

| Photos | Endpoint | Why |
| --- | --- | --- |
| 0 | *(skipped)* | Nothing to send |
| 1 | `sendPhoto` | `sendMediaGroup` **rejects a single-item array** |
| 2–10 | `sendMediaGroup` | Binaries attached, referenced by `attach://photoN` |

If step 1 succeeds but photos fail, the request returns **200** with a
`warning` — the lead already landed, and telling the customer to resubmit would
only duplicate it.

### Fields

| Field | Required | Notes |
| --- | --- | --- |
| Name | yes | |
| Phone | yes | 7–20 digits; normalised to E.164 when North American |
| Town or ZIP | yes | So out-of-area jobs are visible before calling back |
| Email | no | Backup route if the number is mistyped |
| Street address | no | Becomes an "Open in Maps" button when present |
| Timeframe | yes | ASAP / this week / flexible — shown at the top of the message |
| Description | yes | 10–2000 characters |
| Photos | no | Max 8, 10MB each, images only |

### No ticket numbers

Leads are identified by the customer's name, not a reference code. This is a
hauling business, not a helpdesk — David rings people and says "hi, is that
Joseph?", so a code like `CC-4A7F` would just be something extra to translate.
Photo uploads are named after the customer too (`joseph-gray-1.jpg`).

### Status codes

| Code | Meaning |
| --- | --- |
| `200` | Sent (check `warning` for partial photo failure) |
| `400` | Validation failed — `fields` maps field name → message |
| `405` | Non-POST method |
| `413` | Request body too large |
| `429` | Rate limited — `Retry-After` header included |
| `500` | Server misconfigured (missing env vars) |
| `502` | Telegram rejected or was unreachable |

---

## Spam and abuse

**Rate limit.** Three submissions per IP per 10 minutes, sliding window, in
memory. A rejected submission doesn't cost an attempt — the limit is spent only
after validation passes, so a mistyped phone number doesn't burn one of three
tries.

**Honeypot.** A hidden field people never see and scripts always fill. Anything
arriving with it populated is dropped and answered with a success response —
telling a bot it failed just invites a retry.

**Duplicate flagging.** Repeat submissions from the same number within 12 hours
are marked in the message rather than blocked. Somebody remembering an extra
detail isn't abuse, but two near-identical leads looking like two jobs is
confusing.

> **Per-process caveat.** All three live in memory. On a platform that scales
> out, each instance keeps its own counters, so the real limit is the configured
> one times the number of live instances, and a duplicate can land on a
> different instance unnoticed. Good enough to stop casual spam; not a
> guarantee. Swap in Redis/Upstash if you need one — `peekRateLimit`,
> `consumeRateLimit` and `noteSubmission` are the only call sites.

---

## If Telegram is down

The customer sees an error asking them to call. The lead itself is written to
the server log as a single `LEAD_DELIVERY_FAILED` line containing every text
field, so it can be recovered from Vercel's logs rather than vanishing.

Photos can't be recovered this way — but a name, a number and a description
can, which is enough to call back. If lost leads ever cost real money, upgrade
this to a database write or an email fallback.

---

## Token safety

The token appears in every Telegram API URL, which makes it easy to leak.
Guards in place:

- It lives only in `src/lib/telegram.ts`, which imports `server-only` —
  importing it from a client component is a **build error**.
- Errors returned to the browser are fixed strings. Telegram's own error text is
  scrubbed before it's even logged.
- Request URLs are never attached to errors or logs.
- Not `NEXT_PUBLIC_`-prefixed, so it's never bundled.
- `.env` is gitignored; `.env.example` is the committed template.

Never call the Telegram API from the browser. It would put the token in every
visitor's devtools, and anyone could then read the group, delete messages or
spam it. The API route exists specifically so that can't happen.

---

## Branding

Name, slogan, copy, services and SEO details live in
[`src/lib/site.ts`](src/lib/site.ts).

**Still to fill in** — marked `TODO`:

- `site.phone` **and** `site.phoneHref` (both — the `tel:` link is separate)
- `site.email`
- `site.seo.areasServed` — real coverage towns; wrong ones hurt local ranking
- `site.seo.postalAddress` — left `null` deliberately, since a made-up address
  is worse than none

### Two design directions

The mockup ships with a runtime switcher (bottom-right) so the client can
compare two directions on the real page rather than in a mock:

| | **Brand** | **Yard** |
| --- | --- | --- |
| Ground | White / cool slate | Warm concrete `#ede9e1` |
| Dark sections | Logo navy `#051839` | Warm charcoal `#201d18` |
| Action | Logo blue `#2e5b94` | Signal orange `#c0391c` |
| Marker | — | Hi-vis yellow `#e8c81e` |
| Type | Inter | Archivo + IBM Plex Mono labels |
| Radius | 8–16px | 2–4px |

**Brand** is derived from the logo and is unchanged from the original build.
**Yard** is an alternate direction built from the subject's own materials —
concrete, steel, hi-vis, painted markings — on the argument that the first
version, while clean, is a professional-services template that happens to be
navy: swap the logo and it could be an accountant.

Both pass WCAG AA at 390px and 1280px with zero violations.

**How it works.** Every colour, radius and typeface is a semantic token
(`bg-surface`, `text-ink`, `bg-accent`) rather than a literal. Tailwind v4
compiles those to `var(--color-*)`, so overriding the variables under
`[data-design="yard"]` re-skins the entire page at runtime with no component
changes and no second copy of the markup. Structural differences — the hazard
stripe, the hard offset shadows, the card rules, mono labels — are CSS-only
hooks (`.u-cta`, `.u-card`, `.u-eyebrow`) so there is still exactly one DOM.

**Removing it before launch:** set `NEXT_PUBLIC_SHOW_DESIGN_TOGGLE=false`, or
delete `<DesignToggle />` from `page.tsx`. To lock in a direction permanently,
move the winning block's values into the `@theme` block and delete the other.

### Palette

The Brand palette, sampled from the logo, defined as Tailwind tokens in
[`src/app/globals.css`](src/app/globals.css):

| Token | Hex | Taken from |
| --- | --- | --- |
| `brand-950` | `#051839` | Wordmark navy — hero and footer |
| `brand-700` | `#1b3a6b` | Button hover |
| `brand-600` | `#2e5b94` | Truck body — primary buttons |
| `brand-500` | `#4090e0` | Castle highlight — focus rings |
| `brand-400` | `#5299cd` | Tagline blue — accents on navy |
| `gold-400` | `#f6ce76` | The flag — defined, deliberately unused |

The logo is a white-background JPEG, so it sits in a visible box on the navy
footer. **A transparent PNG or SVG from the client would sit better** and would
sharpen the favicon.

---

## Deploying

### Vercel

1. Push to GitHub, import at [vercel.com/new](https://vercel.com/new).
2. Add `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `LEAD_TIMEZONE` and
   `TELEGRAM_TOPIC_ID` under **Settings → Environment Variables**. They're
   stored encrypted and are only readable by server-side code.
3. Redeploy — env vars are read at build time.

That's the whole deploy. No post-deploy commands, and every subsequent release
is just a `git push`.

### GoDaddy — domain only, not hosting

**GoDaddy shared/cPanel hosting cannot run this site.** It serves static files
and PHP; this needs Node for `/api/lead`. A static export would silently drop
the API routes — the page would render and the form would 404 on submit.

1. Buy the domain at GoDaddy.
2. Keep hosting on Vercel.
3. Vercel → **Settings → Domains → Add**.
4. In GoDaddy DNS, add the records Vercel shows — an `A` record for the apex and
   a `CNAME` for `www` pointing at `cname.vercel-dns.com`.
5. Vercel issues the TLS certificate automatically.

If the client insists on GoDaddy hosting, they need a plan with Node.js support
(VPS or their Node tier), not shared hosting.

### Body size limits

Vercel caps serverless request bodies at **4.5MB**. Eight photos at ~300KB each
is ~2.4MB, so normal submissions fit — but eight unusually detailed photos could
exceed it and fail before the route runs. If that shows up, lower `MAX_EDGE_PX`
to 1200.

---

## Project layout

```
src/
  app/
    api/lead/route.ts       Validation, rate limiting, Telegram delivery
    layout.tsx              Metadata, fonts, analytics
    page.tsx                Landing page sections
    robots.ts / sitemap.ts  Search engine basics
    globals.css             Tailwind entry + brand tokens
  components/
    QuoteForm.tsx            Form, resizing, previews, submit states
    StickyCallBar.tsx        Fixed call/quote bar for phones
    LocalBusinessSchema.tsx  Structured data for local search
  lib/
    constants.ts     Limits shared by client and server
    rate-limit.ts    In-memory windows, duplicate detection
    resize.ts        Canvas downscale + JPEG re-encode
    site.ts          Business details — edit this
    site-url.ts      Canonical origin
    telegram.ts      Bot API client, token containment
```

**Deploying is just `git push`.** Set the env vars once in Vercel's dashboard;
there is no setup command to run afterwards.
