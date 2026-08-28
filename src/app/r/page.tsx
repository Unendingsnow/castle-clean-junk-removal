import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  isEmailAddress,
  isHandoffAction,
  toDiallable,
  NAME_DISPLAY_MAX,
} from "@/lib/contact-links";

import Handoff from "./Handoff";

/**
 * Never indexed, and never crawled — the query string carries a customer's
 * phone number or email address. robots.txt disallows /r as well; this is the
 * half that also covers a crawler that ignores robots.txt but honours the tag.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

/** Nothing here is cacheable — every hit carries different customer data. */
export const dynamic = "force-dynamic";

function one(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function HandoffPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const action = one(params.a);
  const rawTarget = one(params.t);
  const name = one(params.n).slice(0, NAME_DISPLAY_MAX);

  if (!isHandoffAction(action)) notFound();

  /**
   * Re-derive the target rather than trusting the query string.
   *
   * This value goes straight into an `href`, so an unvalidated one would let
   * anybody hand David a link that renders as "Text now" and actually carries
   * a `javascript:` URL. Phone numbers are rebuilt from their digits and email
   * addresses have to match the same check the form applies, so nothing that
   * isn't a phone number or an email address can reach the anchor.
   */
  let target: string | null;
  if (action === "email") {
    target = isEmailAddress(rawTarget) ? rawTarget.trim() : null;
  } else {
    target = toDiallable(rawTarget);
  }

  if (!target) notFound();

  return <Handoff action={action} target={target} name={name} />;
}
