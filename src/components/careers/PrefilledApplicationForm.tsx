"use client";

import { useSearchParams } from "next/navigation";
import { applyPrefill, type ApplyMessages, type PositionOption } from "@/lib/apply-validation";
import { ApplicationForm } from "./ApplicationForm";

/**
 * Application form with the position preselected from the query string: /insan-kaynaklari?pozisyon=<id>#basvuru.
 * Render inside <Suspense fallback={<ApplicationForm … />}> so /insan-kaynaklari stays statically prerendered.
 */
export function PrefilledApplicationForm(props: { labelledBy: string; messages: ApplyMessages; positionOptions: PositionOption[] }) {
  const searchParams = useSearchParams();
  return <ApplicationForm {...props} initialPosition={applyPrefill(searchParams.get("pozisyon"))} />;
}
