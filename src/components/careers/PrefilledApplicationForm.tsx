"use client";

import { useSearchParams } from "next/navigation";
import { applyPrefill } from "@/lib/apply-validation";
import { ApplicationForm } from "./ApplicationForm";

/**
 * Application form with the position preselected from the query string: /insan-kaynaklari?pozisyon=<id>#basvuru.
 * Render inside <Suspense fallback={<ApplicationForm … />}> so /insan-kaynaklari stays statically prerendered.
 */
export function PrefilledApplicationForm({ labelledBy }: { labelledBy: string }) {
  const searchParams = useSearchParams();
  return <ApplicationForm labelledBy={labelledBy} initialPosition={applyPrefill(searchParams.get("pozisyon"))} />;
}
