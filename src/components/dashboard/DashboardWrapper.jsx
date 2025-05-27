import React from 'react';
import HeaderDashboard from './HeaderDashboard';
import PropertySection from './PropertySection';
import PlanFinder from './PlanFinder';
import SupportSection from './SupportSection';
import ServicesGrid from './ServicesGrid';


function DashboardWrapper() {
  return (
    <div className="w-full mx-auto p-6">
      <HeaderDashboard />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <PropertySection />
          <PlanFinder />
          <SupportSection />
        </div>
        {/* Right Section (1 column) */}
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