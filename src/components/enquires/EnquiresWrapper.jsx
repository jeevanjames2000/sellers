import React from 'react';
import ServicesGrid from '../dashboard/ServicesGrid';
import EnquiriesPage from './EnquiriesPage';

function EnquiriesWrapper() {
  return (
    <div className="min-h-screen">
      <div className="w-full max-w-[1920px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-4 space-y-6">
            <EnquiriesPage />
          </div>
          {/* Sidebar */}
          {/* <div className="xl:col-span-1">
            <div className="sticky top-6">
              <ServicesGrid />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default EnquiriesWrapper;
