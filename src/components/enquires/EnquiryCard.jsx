import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {  CardContent, CustomCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Phone,
  Ruler,
  CreditCard,
} from "lucide-react";

const EnquiryCard = ({
  property_name,
  property_for,
  bedrooms,
  propertyId,
  propertyType,
  location,
  builtupArea,
  price,
  avatar,
  totalContacted,
  
}) => {
  const [imageSrc, setImageSrc] = useState(avatar);
  console.log("imageSrc: ", imageSrc);
  const router = useRouter();
  router.prefetch("/enquiry/contact-details");

  const handleImageError = () => {
    console.log("Image failed to load, falling back to placeholder:", avatar);
    setImageSrc("https://placehold.co/100x100");
  };


  return (
    <CustomCard className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white hover:scale-[1.01] overflow-hidden">
      <CardContent className="p-0">
        <div className="p-3 sm:p-4 md:p-5 lg:p-6">
          {/* Mobile Layout (xs to sm) */}
          <div className="block md:hidden">
            <div className="flex items-start gap-3 mb-4">
              <div className="relative flex-shrink-0">
                <img
                  src={imageSrc}
                  alt={property_name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                  {property_name}
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center text-gray-500">
                    <CreditCard className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="text-xs">{propertyId}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                    <span className="text-xs font-medium">
                      Contacted - {totalContacted || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2 tracking-wide">
                Property Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {bedrooms}BHK for {propertyType}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-semibold ml-2">
                    <Ruler className="w-3 h-3 mr-1" />
                    {builtupArea}
                  </Badge>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-700 line-clamp-1">
                      {location}
                    </p>
                  </div>
                  <Badge className="bg-[#1D37A6] text-white px-2 py-1 text-sm font-bold ml-2">
                     {price}
                  </Badge>
                </div>
              </div>
            </div>
            

          </div>
          {/* Desktop Layout (md and above) */}
          <div className="hidden md:block">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-start gap-4 lg:w-80 xl:w-96">
                <div className="relative flex-shrink-0">
                  <img
                    src={imageSrc}
                    alt={property_name}
                    className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                    onError={handleImageError}
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1D3A76] transition-colors">
                    {property_name}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-500">
                      <CreditCard className="w-4 h-4 mr-2 text-[#1D37A6]" />
                      <span className="text-sm">{propertyId}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-3 text-[#1D37A6]" />
                      <span className="text-sm font-medium">
                        Contacted - {totalContacted || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Property Details */}
              <div className="flex-1 space-y-1">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 lg:p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                    Property Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500 tracking-wide">
                          Type
                        </p>
                        <p className="font-semibold text-gray-900">
                          {bedrooms}BHK - {propertyType} for {property_for}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 tracking-wide">
                          Location
                        </p>
                        <p className="font-medium text-gray-700">{location}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-center lg:text-right">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors px-3 py-2 text-sm font-semibold">
                          <Ruler className="w-4 h-4 mr-2" />
                          {builtupArea}
                        </Badge>
                      </div>
                      <div className="text-center lg:text-right">
                        <Badge className="bg-[#1D37A6] text-white transition-colors px-3 py-2 text-base font-bold">
                           {price}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           
          </div>
        </div>
      </CardContent>
    </CustomCard>
  );
};

export default EnquiryCard;
