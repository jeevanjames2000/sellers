'use client';
import React, { useState } from 'react';

import EnquiriesPage from './EnquiriesPage';
import EnquirySidebar from './EnquirySideBar';


function EnquiriesWrapper() {
  const [activeTab, setActiveTab] = useState('my-enquiries');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-[1920px] mx-auto p-3 sm:p-4 md:p-6 lg:p-4 xl:p-10">
        <div className="flex flex-row gap-4 justify-between">
          {/* Sidebar */}
          <div className="lg:col-span-1 xl:col-span-1 order-1 md:w-2/4 lg:w-1/4 hidden md:block">
            <div className="sticky top-8">
              <EnquirySidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                enquiryCount={37}
                tenantCount={0}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-full lg:col-span-1 xl:col-span-3 lg:w-3/4 order-1">
            <EnquiriesPage activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnquiriesWrapper;