import React from 'react';
import { Card, CardContent, CustomCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Eye, Edit, Trash2, BarChart3, ArrowUp, Camera, Heart, Building, Phone, Star } from 'lucide-react';

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
  expiry,
  visibility,
  enquiries,
  image,
  developer
}) => {
  return (
    <CustomCard className="group overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white border-0 shadow-lg hover:scale-[1.02] transform">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 h-full">
          {/* Enhanced Image Section */}
          <div className="lg:col-span-2 relative">
            <div className="aspect-[4/3] w-full lg:aspect-auto h-[100%]  relative overflow-hidden ">
             <img
                src={image}
                alt={title}
                className="w-full h-[100%]  object-cover transition-all duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`text-xs font-semibold px-3 py-1 rounded-full shadow-lg ${
                  status === 'Active' 
                    ? 'bg-emerald-500 text-white border border-emerald-400' 
                    : 'bg-amber-500 text-white border border-amber-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${status === 'Active' ? 'bg-emerald-300' : 'bg-amber-300'}`} />
                  {status}
                </Badge>
              </div>
              
              {/* Heart Icon */}
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="sm" className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-red-500 p-2 rounded-full shadow-lg transition-all">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Photo Count */}
              <div className="absolute bottom-1 left-4">
                <Badge variant="outline" className="bg-white/95 backdrop-blur-sm text-gray-800 border-white/50 shadow-lg">
                  <Camera className="w-3 h-3 mr-1" />
                  {enquiries} Photos
                </Badge>
              </div>

            
            </div>
          </div>

          {/* Enhanced Content Section */}
          <div className="lg:col-span-3 px-2 py-2 lg:px-4 lg:py-2 flex flex-col justify-between">
            <div className="space-y-1">
              {/* Header Section */}
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <Building className="w-4 h-4 text-[#1D3A76]" />
                    <span className="text-sm font-medium text-[#6586c9]">{developer}</span>
                  </div>
                  <h3 className="text-sm lg:text-md font-bold text-gray-900  group-hover:text-[#1D3A76] transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 ">
                    Property ID: <span className="font-mono font-medium">{id}</span>
                  </p>
                </div>
                
                <div className="xl:text-right">
                  <div className="text-sm lg:text-md font-bold bg-[#1D3A76] bg-clip-text text-transparent ">
                    ₹ {price}
                  </div>
                  <Badge variant="outline" className="border-blue-200 text-[#1D3A76] bg-blue-50 font-medium px-3 py-1">
                    {bhk} {type}
                  </Badge>
            
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-1">
                <div>
                  
                </div>
                <div className="flex items-center text-gray-600">
               
                  <span className="text-sm">{location}</span>
                  <div className="mx-3 w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-sm">{facing}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 py-1">
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    <span>{enquiries} Enquiries</span>
                  </div>
                  <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 px-3 py-1">
                    {visibility}
                  </Badge>
                </div>
              
              </div>

              {/* Stats Grid */}
              {/* <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                  <div className="font-semibold text-gray-900 text-sm">{lastUpdated}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Expiry</div>
                  <div className="font-semibold text-gray-900 text-sm">{expiry}</div>
                </div>
              </div> */}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-[#1D3A76] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium rounded-lg transition-all">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-medium rounded-lg transition-all">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" className="border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 font-medium rounded-lg transition-all">
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
