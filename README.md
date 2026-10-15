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
| Service | yes | Full service / trailer drop-off / not sure — leads the message |
| Name | yes | |
| Phone **or** email | yes | At least one. Neither is individually mandatory |
| Town or ZIP | yes | So out-of-area jobs are visible before calling back |
| Street address | no | Becomes an "Open in Maps" button when present |
| Timeframe | yes | ASAP / this week / flexible — shown at the top of the message |
| Description | yes | 10–2000 characters |
| Photos | no | Max 8, 10MB each, images only |

Phone is normalised to E.164 when it's unambiguously North American, and sits
alone on its own line so Telegram renders it as tap-to-call.

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

**Still to confirm** — marked `TODO`:

- `site.email` — David supplied `castleclean843@gmal.com`, which is missing the
  "i". `gmal.com` is a registered domain, so publishing it as written would
  send customer email to a stranger. Corrected to `gmail.com`; **confirm this.**
- `site.seo.areasServed` — currently the towns immediately around Wilmington.
  Wrong ones actively hurt local ranking.
- `site.seo.postalAddress` — left `null` deliberately, since a made-up address
  is worse than none.

### Public phone number

David's number (`site.phone`) is shown as tap-to-call in the header and footer.
The form is unchanged: leads still land in Telegram with photos attached. The
error states in `route.ts` still point at the email address; they could be
updated to mention the number too.

### Design system

One design, no themes. Built from the subject's own materials — concrete,
steel, kraft, hi-vis, painted markings — rather than a professional-services
template. Warm neutrals so the real job photography sits in the page instead of
fighting a cool grey chrome; the deep navy is pulled from the logo so the
client's mark is at home on the dark sections.

| Token | Hex | Role |
| --- | --- | --- |
| `canvas` | `#f4f1ea` | Warm concrete — page ground |
| `surface` / `surface-2` | `#fbf9f5` / `#e7e2d7` | Panels and alternating bands |
| `ink` | `#16181d` | Body text |
| `accent` | `#b03517` | Signal orange — every action |
| `inverse` | `#0d1a2b` | Logo navy, deepened — dark sections |
| `inverse-accent` | `#f0c24b` | The logo's flag gold — marker on dark only |

Type is **Archivo** (display, set tight and heavy) with **IBM Plex Mono** for
labels, so they read as stencilled equipment markings. Radii are 2–4px:
machined, not soft. Buttons carry a hard offset shadow with no blur.

Reusable treatments live as `.u-*` classes in
[`globals.css`](src/app/globals.css): `.u-display`, `.u-eyebrow`, `.u-cta`,
`.u-card`, `.u-hazard`.

The accent was darkened from `#bf3d1b` because 12px label text failed WCAG AA
(4.17:1) against `surface-2`. Verified: **zero axe violations and no tap target
under 40px at 360, 390, 768 and 1440px.**

### Photography

Real job photos from the client, in [`src/images/work/`](src/images/work), used
via static import so Next generates blur placeholders and correct dimensions
automatically. One was a phone screenshot — the status and nav bars were
detected and cropped by luminance rather than hardcoded pixel offsets.

**This is the single biggest upgrade over the competitors' pages**, which lean
on stock photography. Add more as David sends them: drop the file in, add an
entry to the `gallery` array in `page.tsx`.

The logo is still a white-background JPEG. **A transparent PNG or SVG would sit
better** on the navy footer and sharpen the favicon.

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

---

## Launch checklist (when the domain lands)

In order. Steps 1–4 are the ones that actually affect ranking, and doing them
out of order means Google indexes the wrong hostname first.

**1. Attach the domain in Vercel**
Settings → Domains → Add. Point GoDaddy DNS at the records Vercel shows.
Set one variant as primary (apex or `www`, either is fine) so the other
redirects — two live hostnames serving the same content split your ranking.

**2. Set `NEXT_PUBLIC_SITE_URL` and redeploy** ← *easy to forget, costly*
```
NEXT_PUBLIC_SITE_URL=https://thedomain.com
```
Without it, canonical tags and the sitemap keep pointing at the `.vercel.app`
host, which tells Google the preview domain is the real site. A production
build with an unset value logs a warning. Redeploy after setting it —
canonicals are baked in at build time.

**3. Google Search Console**
Add the domain as a property, verify (DNS is easiest and survives host
changes), then submit `https://thedomain.com/sitemap.xml`. Use **URL
Inspection → Request indexing** on the homepage and the trailer rental page to
skip the initial crawl wait.

If verifying by HTML tag instead, set `GOOGLE_SITE_VERIFICATION` and redeploy.

**4. Google Business Profile**
The profile already exists. Connecting the domain is the smallest part of it:

- Put the new domain in the **Website** field
- **Primary category: "Junk removal service"** — this is the single highest-
  impact field on the whole profile. Add "Dumpster rental service" as a
  secondary so the trailer offer is discoverable too.
- Define the **service area** as the towns in `site.seo.areasServed`, and keep
  the two lists matching
- Add the **Services** list mirroring `/services`, with the $300 trailer price
- Upload the real job photos from `example/` — profiles with genuine photos
  get materially more engagement than logo-only ones
- Seed the **Q&A** section with the same questions as the site FAQ

**5. Reviews**
The two national competitors show 4.9 stars from thousands of reviews. This is
the largest remaining gap and the only one that can't be built — it has to be
asked for. A short link sent right after each completed job is the whole
tactic. Once real reviews exist, `AggregateRating` schema can be added to
`StructuredData.tsx`; **never** before, because inventing it is a manual-action
risk.

**6. Confirm before going live**

- `site.email` — supplied as `castleclean843@gmal.com`, missing the "i"
- `site.seo.areasServed` — currently inferred from the 910 area code
- `site.seo.postalAddress` — fill in or leave `null`, but don't invent one

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
    LocalBusinessSchema.tsx  Structured data for local search
  images/work/               Real job photos (static imports, auto blur)
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
