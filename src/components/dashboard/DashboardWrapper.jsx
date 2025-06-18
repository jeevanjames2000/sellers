"use client";
import React, { useEffect } from "react";
import HeaderDashboard from "./HeaderDashboard";
import PropertySection from "./PropertySection";
import PlanFinder from "./PlanFinder";
import SupportSection from "./SupportSection";
import ServicesGrid from "./ServicesGrid";
import { usePathname, useRouter } from "next/navigation";

function DashboardWrapper() {
  const router = useRouter();
  useEffect(() => {
    router.prefetch("/listings");
    router.prefetch("/enquiry");
  }, []);
  return (
    <div className="w-full mx-auto p-6">
      <HeaderDashboard />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PropertySection />
          <PlanFinder />
          <SupportSection />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ServicesGrid />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardWrapper;
