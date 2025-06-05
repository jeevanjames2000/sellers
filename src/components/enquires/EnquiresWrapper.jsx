"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EnquiriesPage from "./EnquiriesPage";
import EnquirySidebar, { MobileFilterContent } from "./EnquirySideBar";
import { Badge, Filter } from "lucide-react";
import { Button } from "../ui/button";
import BottomSheet from "./BottomSheet";

function EnquiriesWrapper() {
  const [activeTab, setActiveTab] = useState("my-enquiries");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [tenantCount, setTenantCount] = useState(0);
  const [favoriteCount,setFavouriteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 

  useEffect(() => {
    const fetchEnquiryCounts = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("userDetails");
        let userId;
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser.user_id ;
          } catch (err) {
            console.error("Error parsing userDetails from localStorage:", err);
          }
        }
        const response = await fetch(
          `https://api.meetowner.in/enquiry/v1/getAllEnqueriesCount?user_id=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch enquiry counts");
        }
        const data = await response.json();
        setEnquiryCount(data.total_enquiries || 0); 
        setFavouriteCount(data.total_favourites || 0); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiryCounts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FBFBFB] via-[#FBFBFB] to-[#FBFBFB]">
        <p className="text-lg text-gray-600">Loading enquiry data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FBFBFB] via-[#FBFBFB] to-[#FBFBFB]">
        <div className="text-center">
          <p className="text-lg text-red-600">Error: {error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBFBFB] via-[#FBFBFB] to-[#FBFBFB]">
      <div className="w-full max-w-[1920px] mx-auto p-3 sm:p-4 md:p-6 lg:p-4 xl:p-10">
       
        <div className="md:hidden mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-800">Enquiries - </h1>
            <p className="font-bold mt-1">{enquiryCount}</p>
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
                favouriteCount = {favoriteCount}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-full lg:col-span-1 xl:col-span-3 lg:w-3/4 order-1">
            <EnquiriesPage activeTab={activeTab} enquiryCount={enquiryCount} tenantCount={tenantCount} />
          </div>
        </div>

        {/* Mobile Bottom Sheet */}
        <BottomSheet isOpen={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)}>
          <MobileFilterContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            enquiryCount={enquiryCount}
            tenantCount={tenantCount}
             favouriteCount = {favoriteCount}
            onClose={() => setIsBottomSheetOpen(false)}
          />
        </BottomSheet>
      </div>
    </div>
  );
}

export default EnquiriesWrapper;