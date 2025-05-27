
import React from 'react';
import ListingsPage from './ListingsPage';
import ListingsSidebar from './ListingsSidebar';

function ListingsWrapper() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-[1920px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        {/* Header Section */}
       

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 lg:gap-10">
          {/* Sidebar */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div className="sticky top-8">
              <ListingsSidebar />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <ListingsPage />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingsWrapper;
