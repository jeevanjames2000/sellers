'use client';
import React, { useState } from 'react';

import EnquiriesPage from './EnquiriesPage';
import EnquirySidebar, { MobileFilterContent } from './EnquirySideBar';
import { Badge, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import BottomSheet from './BottomSheet';


function EnquiriesWrapper() {
  const [activeTab, setActiveTab] = useState('my-enquiries');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const enquiryCount = 37;
  const tenantCount = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBFBFB] via-[#FBFBFB] to-[#FBFBFB]">
      <div className="w-full max-w-[1920px] mx-auto p-3 sm:p-4 md:p-6 lg:p-4 xl:p-10">
        {/* Mobile Header with Filter Button */}
        <div className="md:hidden mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-800">Enquiries - </h1>
            <p className=" font-bold mt-1">
              {enquiryCount}
            </p>
          </div>
          <Button 
            onClick={() => setIsBottomSheetOpen(true)}
            className="bg-[#1D3A76] hover:bg-[#2B4A86] text-white px-4 py-2 mr-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <div className="flex flex-row gap-4 justify-between">
          {/* Desktop Sidebar */}
          <div className="lg:col-span-1 xl:col-span-1 order-1 md:w-2/4 lg:w-1/4 hidden md:block">
            <div className="sticky top-8">
              <EnquirySidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                enquiryCount={enquiryCount}
                tenantCount={tenantCount}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-full lg:col-span-1 xl:col-span-3 lg:w-3/4 order-1">
            <EnquiriesPage activeTab={activeTab} />
          </div>
        </div>

        {/* Mobile Bottom Sheet */}
        <BottomSheet 
          isOpen={isBottomSheetOpen} 
          onClose={() => setIsBottomSheetOpen(false)}
        >
          <MobileFilterContent 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            enquiryCount={enquiryCount}
            tenantCount={tenantCount}
            onClose={() => setIsBottomSheetOpen(false)}
          />
        </BottomSheet>
      </div>
    </div>
  );
}

export default EnquiriesWrapper;