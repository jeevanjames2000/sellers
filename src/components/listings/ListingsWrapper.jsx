
import React from 'react';
import ListingsPage from './ListingsPage';
import ListingsSidebar from './ListingsSidebar';

function ListingsWrapper() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-[1920px] mx-auto  p-3 sm:p-4 md:p-6 lg:p-4 xl:p-10">
        {/* Header Section */}
       

        <div className="flex  flex-row gap-4 justify-between">
    
          <div className="lg:col-span-1 xl:col-span-1 order-1 md:w-3/4 lg:w-1/4 hidden md:block ">
            <div className="sticky top-8">
              <ListingsSidebar />
            </div>
          </div>

        {/* Main Content */}
        <div className="md:w-full  lg:col-span-1 xl:col-span-3 lg:w-3/4 order-1 ">
          <ListingsPage />
        </div>
      </div>
      </div>
    </div>
  );
}

export default ListingsWrapper;
