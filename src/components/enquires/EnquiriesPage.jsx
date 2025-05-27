
'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

import EnquiryCard from './EnquiryCard';
import { enquiriesData, matchingTenantsData } from './EnquiresData';
import EnquirySidebar from './EnquirySideBar';

const EnquiriesPage = () => {
  const [activeTab, setActiveTab] = useState('my-enquiries');
  
  const currentData = activeTab === 'my-enquiries' ? enquiriesData : matchingTenantsData;
  const totalCount = activeTab === 'my-enquiries' ? 37 : 0;
  
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar */}
        <div className="lg:w-80 xl:w-96">
          <EnquirySidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            enquiryCount={37}
            tenantCount={0}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-[#1D3A76] to-[#2B4A86] text-white rounded-t-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
                <CardTitle className="text-xl sm:text-md lg:text-xl font-bold tracking-tight">
                  {activeTab === 'my-enquiries' ? 'Property Enquiries' : 'Matching Tenants'}
                </CardTitle>
                <Button
                  variant="secondary"
                  size="default"
                  className="bg-white/90 text-[#1D3A76] hover:bg-white hover:scale-105 transition-all duration-200 font-semibold shadow-lg "
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 sm:p-8 lg:p-6">
              {activeTab === 'my-enquiries' ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 text-base sm:text-lg">
                        Displaying <span className="font-semibold text-[#1D3A76]">{currentData.length}
                          </span> out of <span className="font-semibold text-[#1D3A76]">{totalCount}</span> Enquiries
                      </p>
                      <div className="hidden sm:block w-24 h-1 bg-gradient-to-r from-[#1D3A76] to-blue-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-6 lg:space-y-8">
                    {currentData.map((enquiry, index) => (
                      <div 
                        key={enquiry.id}
                        className="animate-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <EnquiryCard {...enquiry} />
                      </div>
                    ))}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnquiriesPage;