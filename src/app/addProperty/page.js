"use client";
export const dynamic = "force-dynamic";
import React, { Suspense, useState, useEffect } from "react";
import MultiStepForm from "@/components/addProperty/MultiStepForm";
import { useSearchParams } from "next/navigation";
import { Loading } from "@/lib/loader";
function AddPropertyContent() {
  const [propertyId, setPropertyId] = useState(null);
  const searchParams = useSearchParams();
  useEffect(() => {
    const idFromURL = searchParams.get("property_id");
    if (idFromURL) {
      setPropertyId(idFromURL);
    }
  }, [searchParams]);
  return <MultiStepForm initialPropertyId={propertyId} />;
}
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loading color="#1D3A76" />
          <p className="text-lg ml-4">Loading property form...</p>
        </div>
      }
    >
      <AddPropertyContent />
    </Suspense>
  );
}
