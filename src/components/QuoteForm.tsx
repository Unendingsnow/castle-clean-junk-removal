"use client";

import { useEffect, useRef, useState } from "react";

import {
  DEFAULT_JOB_TYPE,
  DEFAULT_URGENCY,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  HONEYPOT_FIELD,
  JOB_TYPES,
  MAX_EDGE_PX,
  MAX_FILES,
  URGENCY_OPTIONS,
} from "@/lib/constants";
import { formatBytes, prepareImage, type PreparedImage } from "@/lib/resize";
import { site } from "@/lib/site";

type Status = "idle" | "processing" | "submitting" | "success" | "error";
type FieldErrors = Record<string, string>;

const inputBase =
  "w-full rounded-lg border bg-field px-4 py-3 text-ink outline-none transition placeholder:text-muted/60 focus:ring-4 disabled:cursor-not-allowed disabled:bg-surface-2";
const inputOk = "border-line-strong focus:border-accent focus:ring-accent/20";
const inputBad = "border-red-500 focus:border-red-600 focus:ring-red-500/20";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";
const hintClass = "mt-1.5 text-sm";

function fieldClass(hasError: boolean) {
  return `${inputBase} ${hasError ? inputBad : inputOk}`;
}

export default function QuoteForm() {
  const [jobType, setJobType] = useState<string>(DEFAULT_JOB_TYPE);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");
  const [urgency, setUrgency] = useState<string>(DEFAULT_URGENCY);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<PreparedImage[]>([]);

  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Object URLs leak memory until revoked, so track the live set and clean up
  // if the component ever unmounts mid-flow.
  const imagesRef = useRef<PreparedImage[]>([]);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(
    () => () => {
      imagesRef.current.forEach((image) =>
        URL.revokeObjectURL(image.previewUrl),
      );
    },
    [],
  );

  const busy = status === "processing" || status === "submitting";
  const atCapacity = images.length >= MAX_FILES;

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);
    // Let the same file be re-picked after removal.
    event.target.value = "";
    if (picked.length === 0) return;

    setFormError(null);
    setFieldErrors((prev) => ({ ...prev, photos: "" }));

    const room = MAX_FILES - images.length;
    if (room <= 0) {
      setFieldErrors((prev) => ({
        ...prev,
        photos: `You've already attached the maximum of ${MAX_FILES} photos.`,
      }));
      return;
    }

    const accepted = picked.slice(0, room);
    const overflow = picked.length - accepted.length;

    setStatus("processing");
    setNotice(
      `Resizing ${accepted.length} photo${accepted.length === 1 ? "" : "s"}...`,
    );

    const prepared: PreparedImage[] = [];
    const failed: string[] = [];

    for (const file of accepted) {
      try {
        prepared.push(await prepareImage(file));
      } catch {
        failed.push(file.name);
      }
    }

    setImages((prev) => [...prev, ...prepared]);
    setStatus("idle");
    setNotice(null);

    const problems: string[] = [];
    if (overflow > 0) {
      problems.push(
        `Only the first ${MAX_FILES} photos were kept (${overflow} skipped).`,
      );
    }
    if (failed.length > 0) problems.push(`Couldn't read: ${failed.join(", ")}.`);
    if (problems.length > 0) {
      setFieldErrors((prev) => ({ ...prev, photos: problems.join(" ") }));
    }
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const target = prev.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((image) => image.id !== id);
    });
    setFieldErrors((prev) => ({ ...prev, photos: "" }));
  }

  function clientValidate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "Please enter your name.";

    const hasPhone = Boolean(phone.trim());
    const hasEmail = Boolean(email.trim());

    if (hasPhone && phone.replace(/\D/g, "").length < 7)
      errors.phone = "Please enter a valid phone number.";
    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errors.email = "Please check that email address.";

    // One contact route is enough, but we need at least one.
    if (!hasPhone && !hasEmail) {
      const message = "Please give us a phone number or an email address.";
      errors.phone = message;
      errors.email = message;
    }

    if (!town.trim()) errors.town = "Please tell us the town or ZIP.";
    if (description.trim().length < DESCRIPTION_MIN)
      errors.description = `Please add a little more detail (at least ${DESCRIPTION_MIN} characters).`;
    else if (description.trim().length > DESCRIPTION_MAX)
      errors.description = `Please keep this under ${DESCRIPTION_MAX} characters.`;
    return errors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setFormError(null);
    setNotice(null);

    const errors = clientValidate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      setFormError("Please check the highlighted fields.");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    const body = new FormData();
    body.append("jobType", jobType);
    body.append("name", name.trim());
    body.append("phone", phone.trim());
    body.append("email", email.trim());
    body.append("town", town.trim());
    body.append("address", address.trim());
    body.append("urgency", urgency);
    body.append("description", description.trim());
    body.append(HONEYPOT_FIELD, honeypotRef.current?.value ?? "");
    images.forEach((image) =>
      body.append("photos", image.file, image.file.name),
    );

    try {
      const response = await fetch("/api/lead", { method: "POST", body });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        setFieldErrors(data?.fields ?? {});
        setFormError(
          data?.error ??
            "Something went wrong sending your request. Please try again.",
        );
        setStatus("error");
        return;
      }

      images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      setImages([]);
      setJobType(DEFAULT_JOB_TYPE);
      setName("");
      setPhone("");
      setEmail("");
      setTown("");
      setAddress("");
      setUrgency(DEFAULT_URGENCY);
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setNotice(typeof data.warning === "string" ? data.warning : null);
      setStatus("success");
    } catch {
      setFormError(
        "We couldn't reach the server. Check your connection and try again.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border border-line bg-surface p-8 text-center sm:p-12"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-3xl text-accent-ink">
          ✓
        </div>
        <h3 className="u-display mt-6 text-3xl text-ink">Request sent</h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
          Thanks — your details and photos have gone straight through. You&apos;ll
          get a straight price back, {site.responseTime}.
        </p>

        {notice && (
          <p className="mx-auto mt-5 max-w-md border border-line-strong bg-canvas px-4 py-3 text-sm text-ink">
            {notice}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            setNotice(null);
            setStatus("idle");
          }}
          className="u-cta mt-8 min-h-11 rounded-lg border border-line-strong bg-canvas px-6 py-2.5 text-sm font-bold text-ink transition hover:bg-surface-2"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border border-line bg-surface p-6 sm:p-9"
    >
      {/* Honeypot. Hidden from people and screen readers, filled in by bots. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor={HONEYPOT_FIELD}>Company website</label>
        <input
          ref={honeypotRef}
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {/* --- What do you need --- */}
      <fieldset>
        <legend className="u-eyebrow mb-3 text-[11px] text-accent">
          What do you need?
        </legend>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {JOB_TYPES.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer flex-col gap-0.5 rounded-lg border-2 p-3.5 transition ${
                jobType === option.value
                  ? "border-accent bg-accent-soft"
                  : "border-line-strong bg-field hover:border-accent/50"
              } ${busy ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="jobType"
                  value={option.value}
                  checked={jobType === option.value}
                  onChange={(event) => setJobType(event.target.value)}
                  disabled={busy}
                  className="h-4 w-4 accent-accent"
                />
                <span className="text-sm font-bold text-ink">
                  {option.label}
                </span>
              </span>
              <span className="pl-6 text-xs text-muted">{option.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <hr className="my-7 border-line" />

      <div>
        <label htmlFor="name" className={labelClass}>
          Your name <span className="text-accent">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={busy}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          className={fieldClass(Boolean(fieldErrors.name))}
          placeholder="Jane Smith"
        />
        {fieldErrors.name && (
          <p id="name-error" className={`${hintClass} text-red-700`}>
            {fieldErrors.name}
          </p>
        )}
      </div>

      {/* --- Contact: either one will do --- */}
      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-ink">
          How should we reach you?{" "}
          <span className="font-normal text-muted">
            — phone or email, whichever you prefer
          </span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="sr-only">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={busy}
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby="contact-hint"
              className={fieldClass(Boolean(fieldErrors.phone))}
              placeholder="Phone — (910) 555-0134"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={busy}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby="contact-hint"
              className={fieldClass(Boolean(fieldErrors.email))}
              placeholder="Email — jane@example.com"
            />
          </div>
        </div>
        <p
          id="contact-hint"
          className={`${hintClass} ${
            fieldErrors.phone || fieldErrors.email
              ? "text-red-700"
              : "text-muted"
          }`}
        >
          {fieldErrors.phone ||
            fieldErrors.email ||
            "One is enough. Fill out both if you don't mind either."}
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="town" className={labelClass}>
            Town or ZIP <span className="text-accent">*</span>
          </label>
          <input
            id="town"
            name="town"
            type="text"
            autoComplete="address-level2"
            value={town}
            onChange={(event) => setTown(event.target.value)}
            disabled={busy}
            aria-invalid={Boolean(fieldErrors.town)}
            aria-describedby="town-hint"
            className={fieldClass(Boolean(fieldErrors.town))}
            placeholder="Wilmington"
          />
          <p
            id="town-hint"
            className={`${hintClass} ${fieldErrors.town ? "text-red-700" : "text-muted"}`}
          >
            {fieldErrors.town ?? "So we can check we cover your area."}
          </p>
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>
            Street address{" "}
            <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            disabled={busy}
            className={fieldClass(Boolean(fieldErrors.address))}
            placeholder="1513 Parmele Drive"
          />
          <p className={`${hintClass} text-muted`}>
            Helps us judge access and distance.
          </p>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className={labelClass}>When do you need it done?</legend>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {URGENCY_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                urgency === option.value
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line-strong bg-field text-ink hover:border-accent/50"
              } ${busy ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <input
                type="radio"
                name="urgency"
                value={option.value}
                checked={urgency === option.value}
                onChange={(event) => setUrgency(event.target.value)}
                disabled={busy}
                className="h-4 w-4 accent-accent"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="description" className={labelClass}>
          What needs to go? <span className="text-accent">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={busy}
          maxLength={DESCRIPTION_MAX}
          aria-invalid={Boolean(fieldErrors.description)}
          aria-describedby="description-hint"
          className={`${fieldClass(Boolean(fieldErrors.description))} resize-y`}
          placeholder="Garage cleanout — old couch, a fridge, maybe 15 boxes and some scrap lumber. Ground floor, easy access from the driveway."
        />
        <div
          id="description-hint"
          className="mt-1.5 flex flex-wrap justify-between gap-2 text-sm"
        >
          <span
            className={
              fieldErrors.description ? "text-red-700" : "text-muted"
            }
          >
            {fieldErrors.description ??
              "Rough quantities and access details help us price it properly."}
          </span>
          <span className="font-mono tabular-nums text-muted">
            {description.length}/{DESCRIPTION_MAX}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <span className={labelClass}>
          Photos{" "}
          <span className="font-normal text-muted">
            (optional, up to {MAX_FILES})
          </span>
        </span>

        <input
          ref={fileInputRef}
          id="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          disabled={busy || atCapacity}
          className="sr-only"
        />
        <label
          htmlFor="photos"
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-9 text-center transition ${
            busy || atCapacity
              ? "cursor-not-allowed border-line bg-surface-2 text-muted"
              : "border-line-strong bg-canvas text-muted hover:border-accent hover:bg-accent-soft"
          }`}
        >
          <span className="text-2xl">📷</span>
          <span className="mt-2 text-sm font-bold text-ink">
            {atCapacity
              ? `Maximum of ${MAX_FILES} photos attached`
              : "Tap to add photos"}
          </span>
          <span className="mt-1 font-mono text-[11px] text-muted">
            Shrunk to {MAX_EDGE_PX}px in your browser — big phone photos are fine
          </span>
        </label>

        {fieldErrors.photos && (
          <p className="mt-2 text-sm text-red-700">{fieldErrors.photos}</p>
        )}

        {status === "processing" && (
          <p
            role="status"
            className="mt-3 flex items-center gap-2 text-sm text-muted"
          >
            <Spinner className="h-4 w-4 text-accent" />
            {notice ?? "Preparing photos..."}
          </p>
        )}

        {images.length > 0 && (
          <>
            <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((image, index) => (
                <li key={image.id} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg border border-line bg-surface-2">
                    {/* Blob URL of a client-resized file: next/image adds
                        nothing here and can't optimise it anyway. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.previewUrl}
                      alt={`Attached photo ${index + 1}: ${image.originalName}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    disabled={busy}
                    aria-label={`Remove photo ${index + 1}`}
                    className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-base font-bold text-canvas transition hover:bg-accent disabled:opacity-50"
                  >
                    ×
                  </button>
                  <p className="mt-1 truncate text-center font-mono text-[11px] text-muted">
                    {formatBytes(image.bytes)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-2 font-mono text-[11px] text-muted">
              {images.length} of {MAX_FILES} attached ·{" "}
              {formatBytes(
                images.reduce((total, image) => total + image.bytes, 0),
              )}{" "}
              total (from{" "}
              {formatBytes(
                images.reduce((total, image) => total + image.originalBytes, 0),
              )}
              )
            </p>
          </>
        )}
      </div>

      {formError && (
        <p
          role="alert"
          className="mt-6 border-l-3 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        aria-busy={status === "submitting"}
        className="u-cta mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 text-lg font-bold text-accent-ink transition hover:bg-accent-strong focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-muted"
      >
        {status === "submitting" && <Spinner className="h-5 w-5" />}
        {status === "submitting" ? "Sending..." : "Get my price"}
      </button>

      <p className="mt-3 text-center font-mono text-[11px] text-muted">
        No obligation. Your details are only used to quote this job.
      </p>
    </form>
  );
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
