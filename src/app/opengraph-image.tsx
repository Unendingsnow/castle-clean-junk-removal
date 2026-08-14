import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { site } from "@/lib/site";

/**
 * Social share card.
 *
 * The square logo was being used before, which crops badly in Facebook and
 * iMessage previews and says nothing about the service. This is a proper
 * 1200x630 card built from a real job photo.
 */
export const alt = `${site.name} — junk removal and cleanouts in Wilmington, NC`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const photo = await readFile(
    join(process.cwd(), "src/images/work/driveway-load.jpg"),
  );
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0d1a2b",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.4,
          }}
        />
        {/* Satori needs the gradient as `backgroundImage` (it ignores the
            `background` shorthand) AND explicit width/height — `inset: 0`
            alone produces a zero-size box, so the scrim silently doesn't
            render and the headline ends up on a full-brightness photo. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage:
              "linear-gradient(90deg, rgba(13,26,43,0.96) 0%, rgba(13,26,43,0.92) 46%, rgba(13,26,43,0.55) 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              color: "#f0c24b",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {site.slogan}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              lineHeight: 1,
              color: "#f4f1ea",
              fontWeight: 800,
              letterSpacing: -3,
              marginTop: 26,
              maxWidth: 900,
            }}
          >
            Junk removal &amp; cleanouts in Wilmington
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#b9c4d2",
              marginTop: 28,
              maxWidth: 800,
            }}
          >
            Owner-operated. Send photos, get a straight answer.
          </div>

          <div style={{ display: "flex", marginTop: 44, gap: 16 }}>
            <div
              style={{
                display: "flex",
                backgroundColor: "#b03517",
                color: "#fff7f2",
                fontSize: 26,
                fontWeight: 700,
                padding: "14px 26px",
              }}
            >
              Full-service removal
            </div>
            <div
              style={{
                display: "flex",
                border: "2px solid #7e8ea1",
                color: "#f4f1ea",
                fontSize: 26,
                fontWeight: 700,
                padding: "14px 26px",
              }}
            >
              Trailer drop-off · $300
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
