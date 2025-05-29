'use client';


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';


import EnquiryCard from './EnquiryCard';
import { enquiriesData, matchingTenantsData } from './EnquiresData';
import {  PaginationWrapper, } from './PaginationWrapper';


const EnquiriesPage = ({ activeTab }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const currentData = activeTab === 'my-enquiries' ? enquiriesData : matchingTenantsData;
  const totalCount = activeTab === 'my-enquiries' ? 37 : 0;
    const itemsPerPage = 5; 
  const totalPages = 15; 
    const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="w-full">
        <div className="p-6 sm:p-2 lg:p-6">
          {activeTab === 'my-enquiries' ? (
            <>
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base sm:text-lg">
                    Displaying <span className="font-semibold text-[#1D3A76]">{currentData.length}</span> out of{' '}
                    <span className="font-semibold text-[#1D3A76]">{totalCount}</span> Enquiries
                  </p>
                  <div className="hidden sm:block w-24 h-1 bg-gradient-to-r from-[#1D3A76] to-blue-400 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-3">
                {paginatedData.map((enquiry, index) => (
                  <div
                    key={enquiry.id}
                    className="animate-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <EnquiryCard {...enquiry} />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
              <PaginationWrapper
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

            </>
          ) : (
            <div className="text-center py-16 sm:py-20 lg:py-24">
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl sm:text-4xl">🏢</span>
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                  No Matching Tenants Found
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We'll notify you when we find tenants that match your property requirements.
                </p>
                <div className="mt-8">
                  <Button className="bg-[#1D3A76] hover:bg-[#2B4A86] text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                    Set Up Alerts
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      
    </div>
  );
};

export default EnquiriesPage;