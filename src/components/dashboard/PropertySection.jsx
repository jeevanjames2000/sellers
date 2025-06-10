"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setEnquiries, setError, setLoading } from "@/store/slices/enquirySlice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Loading } from "@/lib/loader";
import {  MapPin, Camera, Building, Eye, Edit, Trash2, BarChart3, ArrowUp, Building2Icon } from "lucide-react";

import { useRouter } from "next/navigation";
import { CardContent, CustomCard } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const PropertySection = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { count, properties, loading, error } = useSelector((state) => state.enquiries); 

  useEffect(() => {
    const fetchEnquiries = async () => {
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
  }, [dispatch]);


  

  const getBHKDisplay = (property) => {
    return property.bedrooms ? `${property.bedrooms} BHK` : "N/A";
  };

  const getOccupancyDisplay = (property) => {
    return property.occupancy || "N/A";
  };

 
  const handleViewContacted = () => {
   

   
    router.push(`/enquiry/contact-details`);
  };

  const handleUpgradedClick = () => {
    router.push('/packages');
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 mb-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#1D37A6] rounded-xl flex items-center justify-center shadow-lg">
              <Building2Icon color="white"/>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Properties</h2>
            <p className="text-sm text-gray-500 mt-1">Manage and view your listed properties</p>
          </div>
        </div>
        <Link
          href="/listings"
          className="inline-flex items-center px-4 py-2 bg-[#1D37A6] text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <span>View All</span>
          
        </Link>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Loading color="#2563eb" />
          <p className="text-lg mt-4 font-medium">Loading your properties...</p>
          <p className="text-sm text-gray-400 mt-1">Please wait while we fetch your data</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-500 text-sm max-w-md">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </Button>
        </div>
      ) : properties.length > 0 ? (
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {properties.slice(0, 3).map((property) => (
              <CarouselItem key={property.id} className="pl-2 md:pl-4 basis-full">
               
                <div className="h-[320px] sm:h-[400px] lg:h-[240px]">
                  <CustomCard className="group overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white border-0 shadow-lg hover:scale-[1.02] transform h-full">
                    <CardContent className="p-0 h-full">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 h-full">
                        {/* Image Section - Fixed dimensions */}
                        <div className="lg:col-span-2 relative">
                          <div className="w-full h-[140px] sm:h-[120px] lg:h-[250px] relative overflow-hidden">
                            {property.image ? (
                              <img
                                src={`https://api.meetowner.in/uploads/${property.image}`}
                                alt={property.property_name}
                                crossOrigin="anonymous"
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Camera className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                           
                           
                          </div>
                        </div>
                        

                        <div className="lg:col-span-3 px-3 py-3 lg:px-4 lg:py-3 flex flex-col justify-between min-h-0">
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm lg:text-base font-bold text-gray-900 group-hover:text-[#1D3A76] transition-colors truncate">
                                  {property.property_name}
                                </h3>
                                <p className="text-xs text-gray-500 truncate">
                                  Property ID: <span className="font-mono font-medium">{property.unique_property_id}</span>
                                </p>
                              </div>
                              <div className="xl:text-right flex-shrink-0">
                               
                                <div className="flex flex-col gap-1 mt-1">
                                  <Badge
                                    variant="outline"
                                    className="border-blue-200 text-[#1D3A76] bg-blue-50 font-medium px-2 py-1 text-xs"
                                  >
                                    {getBHKDisplay(property)} {property.property_in}
                                  </Badge>
                                  {getOccupancyDisplay(property) !== "N/A" && (
                                    <Badge
                                      variant="outline"
                                      className="border-blue-200 text-[#1D3A76] bg-blue-50 font-medium px-2 py-1 text-xs"
                                    >
                                      {property.property_for === "Rent" ? "Available From" : "Occupancy"}: {getOccupancyDisplay(property)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center text-gray-600">
                                <MapPin className="w-3 h-3 mr-1 text-gray-500 flex-shrink-0" />
                                <span className="text-xs truncate">{property.google_address || property.location_id}</span>
                              </div>
                              <div className="flex items-center text-gray-600 gap-2 flex-wrap">
                                {property.furnished_status && (
                                  <span className="text-xs">{property.furnished_status} Furnished</span>
                                )}
                                <span className="text-xs">{property.facing} Facing</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 py-1">
                                <div className="flex items-center gap-1 bg-blue-50 text-[#1D73A6] px-2 py-1 rounded-full text-xs font-medium">
                                  <Eye className="w-3 h-3" />
                                  <span>{property.totalContacted || 0} Enquiries</span>
                                </div>
                                <div className="flex items-center gap-1 bg-blue-50 text-[#1D73A6] px-2 py-1 rounded-full text-xs font-medium">
                                  <Eye className="w-3 h-3" />
                                  <span>{property.favourites || 0} Favourites</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action buttons - Fixed at bottom */}
                          <div className="pt-2 mt-auto">
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                onClick={() => handleViewContacted()}
                                variant="outline"
                                size="sm"
                                className="border-2 border-blue-200 text-[#1D73A6] hover:bg-blue-50 hover:border-blue-300 font-medium rounded-lg transition-all cursor-pointer text-xs h-8"
                              >
                                <BarChart3 className="w-3 h-3 mr-1" />
                                Analytics
                              </Button>
                              <Button
                              onClick={() => handleUpgradedClick()}
                                variant="outline"
                                size="sm"
                                className="border-2 cursor-pointer border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 font-medium rounded-lg transition-all text-xs h-8"
                              >
                                <ArrowUp className="w-3 h-3 mr-1" />
                                Upgrade
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CustomCard>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 w-10 h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm border-2 border-gray-200 shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-200" />
          <CarouselNext className="right-6 w-10 h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm border-2 border-gray-200 shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-200" />
        </Carousel>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-12 lg:p-16 text-center">
          <div className="max-w-md mx-auto">
            
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Properties Yet</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Start building your real estate portfolio by adding your properties.
            </p>
            <Button className="inline-flex items-center px-6 py-3 bg-[#1D3A76] text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Add Property
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySection;