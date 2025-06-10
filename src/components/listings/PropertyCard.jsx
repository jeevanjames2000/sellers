import React from "react";
import { Card, CardContent, CustomCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  ArrowUp,
  Camera,
  Heart,
  Building,
} from "lucide-react";
import { useRouter } from "next/navigation";

const PropertyCard = ({
  id,
  title,
  price,
  bhk,
  type,
  status,
  location,
  facing,
  lastUpdated,
  furnished_status,
  enquiries,
  favourites,
  image,
  developer,
  propertyFor,
  propertyIn,
  propertySubType,
  monthly_rent,
  occupancy,
  available_from,
}) => {
  const router = useRouter();
  const formatToIndianCurrency = (value) => {
    if (!value || isNaN(Number(value))) return "N/A";
    const numValue = parseFloat(value.toString());
    if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
    if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
    if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
    return numValue.toString();
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return "N/A";
    }
  };
  const formatValue = (value) => {
    return value % 1 === 0
      ? parseInt(value.toString())
      : parseFloat(value.toString()).toFixed(2).replace(/\.00$/, "");
  };

  const getBHKDisplay = () => {
    if (propertyIn === "Commercial") {
      return propertySubType || "N/A";
    }
    if (propertyIn === "Residential") {
      if (
        ["Apartment", "Independent House", "Independent Villa"].includes(
          propertySubType
        )
      ) {
        return bhk ? `${bhk} BHK` : "N/A";
      }
      if (propertySubType === "Land") {
        return "Land";
      }
      if (propertySubType === "Plot") {
        return "Plot";
      }
    }
    return propertySubType || "N/A";
  };

  const getPriceDisplay = () => {
    if (propertyFor === "Rent") {
      return monthly_rent
        ? `₹ ${formatToIndianCurrency(monthly_rent)}/month`
        : "N/A";
    }
    return price ? `₹ ${formatToIndianCurrency(price)}` : "N/A";
  };

  const getOccupancyDisplay = () => {
    if (["Plot", "Land"].includes(propertySubType)) {
      return "";
    }
    if (propertyFor === "Rent") {
      return formatDate(available_from);
    }
    return occupancy || "N/A";
  };
  const showFurnishedStatus = !["Plot", "Land"].includes(propertySubType);
  const handleEdit = () => {
    router.push(`/addProperty?property_id=${id}`);
  };

  const handleViewContacted = () => {
    

    
    router.push(`/enquiry/contact-details`);
  };

  return (
    <CustomCard className="group overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white border-0 shadow-lg hover:scale-[1.02] transform">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 h-full">
          <div className="lg:col-span-2 relative">
            <div className="aspect-[4/3] w-full lg:aspect-auto h-[100%] relative overflow-hidden">
              <img
                src={image}
                alt={title}
                crossOrigin="anonymous"
                className="w-full h-[100%] max-h-80 object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 left-4">
                <Badge
                  className={`text-xs font-semibold px-3 py-1 rounded-full shadow-lg ${
                    status === "Active"
                      ? "bg-emerald-500 text-white border border-emerald-400"
                      : "bg-amber-500 text-white border border-amber-400"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      status === "Active" ? "bg-emerald-300" : "bg-amber-300"
                    }`}
                  />
                  {status}
                </Badge>
              </div>

              <div className="absolute bottom-1 left-4">
                <Badge
                  variant="outline"
                  className="bg-white/95 backdrop-blur-sm text-gray-800 border-white/50 shadow-lg"
                >
                  <Camera className="w-3 h-3 mr-1" />
                  {enquiries} Photos
                </Badge>
              </div>
            </div>
          </div>
          {}
          <div className="lg:col-span-3 px-2 py-2 lg:px-4 lg:py-2 flex flex-col justify-between">
            <div className="space-y-1">
              {}
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <Building className="w-4 h-4 text-[#1D3A76]" />
                    <span className="text-sm font-medium text-[#6586c9]">
                      {developer}
                    </span>
                  </div>
                  <h3 className="text-sm lg:text-md font-bold text-gray-900 group-hover:text-[#1D3A76] transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Property ID:{" "}
                    <span className="font-mono font-medium">{id}</span>
                  </p>
                </div>
                <div className="xl:text-right">
                  <div className="text-sm lg:text-md font-bold bg-[#1D3A76] bg-clip-text text-transparent">
                    {getPriceDisplay()}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-[#1D3A76] bg-blue-50 font-medium px-3 py-1"
                    >
                      {getBHKDisplay()} {propertyIn}
                    </Badge>
                    {getOccupancyDisplay() && (
                      <Badge
                        variant="outline"
                        className="border-blue-200 text-[#1D3A76] bg-blue-50 font-medium px-3 py-1"
                      >
                        {propertyFor === "Rent"
                          ? "Available From"
                          : "Occupancy"}
                        : {getOccupancyDisplay()}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {}
              <div className="space-y-1">
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">{location}</span>
                </div>
                <div className="flex items-center text-gray-600 gap-2">
                  {showFurnishedStatus && (
                    <span className="text-sm">{furnished_status}</span>
                  )}
                  <span className="text-sm">{facing} Facing</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 py-1">
                  <div className="flex items-center gap-2 bg-blue-50 text-[#1D73A6] px-3 py-1.5 rounded-full text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    <span>{enquiries} Enquiries</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 text-[#1D73A6] px-3 py-1.5 rounded-full text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    <span>{favourites} Favourites</span>
                  </div>
                </div>
              </div>
            </div>
            {}
            <div className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="bg-[#1D3A76] cursor-pointer text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                  onClick={handleEdit}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="border-2 cursor-pointer border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleViewContacted}
                  variant="outline"
                  className="border-2 border-blue-200 text-[#1D73A6] hover:bg-blue-50 hover:border-blue-300 font-medium rounded-lg transition-all cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button
                  variant="outline"
                  className="border-2 cursor-pointer border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 font-medium rounded-lg transition-all"
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </CustomCard>
  );
};
export default PropertyCard;
