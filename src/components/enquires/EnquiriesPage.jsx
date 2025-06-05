"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import EnquiryCard from "./EnquiryCard";
import { PaginationWrapper } from "./PaginationWrapper";
import {
  setEnquiries,
  setLoading,
  setError,
} from "@/store/slices/enquirySlice";
import { Loading } from "@/lib/loader";

const EnquiriesPage = ({ activeTab }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dispatch = useDispatch();
  const { count, properties, loading, error } = useSelector(
    (state) => state.enquiries
  );

  const totalPages = Math.ceil(count / itemsPerPage);

  useEffect(() => {
    const fetchEnquiries = async () => {
      if (activeTab !== "my-enquiries") return;
      const storedUser = localStorage.getItem("userDetails");
      let userId;
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.user_id;
        } catch (error) {
          console.error("Error parsing userDetails from localStorage:", error);
          userId = null;
        }
      } else {
        console.log("No userDetails found in localStorage");
        userId = null;
      }

      dispatch(setLoading());
      try {
        const response = await fetch(
          `https://api.meetowner.in/listings/v1/getPropertiesByUserID?user_id=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        dispatch(setEnquiries(data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };
    fetchEnquiries();
  }, [activeTab, dispatch]);

  const mapToEnquiryCardProps = (enquiry) => {
    console.log("enquiry: ", enquiry.image);
    const avatarUrl = enquiry.image
      ? `https://api.meetowner.in/uploads/${enquiry.image}`
      : "https://placehold.co/100x100";

    return {
      property_name: enquiry.property_name || "Unknown Property",
      property_for: enquiry.property_for || "N/A",
      bedrooms: enquiry.bedrooms,
      propertyId: enquiry.unique_property_id || "N/A",
      propertyType: enquiry.sub_type || "N/A",
      location: enquiry.google_address || enquiry.location_id || "N/A",
      builtupArea: `${enquiry.builtup_area || "N/A"} ${
        enquiry.area_units || ""
      }`,
      price: enquiry.property_cost
        ? `₹${parseFloat(enquiry.property_cost).toLocaleString("en-IN")}`
        : "N/A",
      avatar: avatarUrl,
      isFavorite: false,
      totalContacted: enquiry.totalContacted,
      activity: enquiry.activity || [],
    };
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = properties
    .slice(startIndex, endIndex)
    .map(mapToEnquiryCardProps);

  return (
    <div className="w-full">
      <div className="p-6 sm:p-2 lg:p-6">
        {activeTab === "my-enquiries" ? (
          <>
            {loading ? (
              <div className="text-center py-16">
                <Loading color="[#1D7A36]" />
                <p className="text-gray-600 text-lg">Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 text-lg">Error: {error}</p>
                <Button
                  onClick={() => handlePageChange(currentPage)}
                  className="mt-4 bg-[#1D3A76] hover:bg-[#2B4A86] text-white px-8 py-3 rounded-lg"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-base sm:text-lg">
                      Displaying{" "}
                      <span className="font-semibold text-[#1D3A76]">
                        {paginatedData.length}
                      </span>{" "}
                      out of{" "}
                      <span className="font-semibold text-[#1D3A76]">
                        {count}
                      </span>{" "}
                      Listings
                    </p>
                    <div className="hidden sm:block w-24 h-1 bg-gradient-to-r from-[#1D3A76] to-blue-400 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((enquiry, index) => (
                      <div
                        key={enquiry.propertyId}
                        className="animate-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <EnquiryCard {...enquiry} />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-lg text-center">
                      No enquiries found.
                    </p>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <PaginationWrapper
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
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
                We'll notify you when we find tenants that match your property
                requirements.
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
