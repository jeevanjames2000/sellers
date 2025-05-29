
import React from 'react';
import { Card, CardContent, CustomCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Heart, Building, Ruler, User, IdCard } from 'lucide-react';

const EnquiryCard = ({
  companyName,
  contactPerson,
  propertyId,
  phone,
  email,
  propertyType,
  location,
  builtupArea,
  price,
  avatar,
  isFavorite,
}) => {
  return (
    <CustomCard className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white hover:scale-[1.02] overflow-hidden">
      <CardContent className="p-2">
        <div className="p-6 sm:px-4 md:px-2 md:py-2  lg:px-4 lg:py-4 sm:py-2">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-start gap-4 lg:w-80 xl:w-96">
              <div className="relative flex-shrink-0">
                <img
                  src={avatar}
                  alt={companyName}
                  className="w-16 h-16 sm:w-15 sm:h-15  rounded-2xl object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-xs md:text-md lg:text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1D3A76] transition-colors">
                  {companyName}
                </h3>
                <div >
                 
                  <div className="flex items-center text-gray-500">
                    <IdCard className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-xs sm:text-sm">{propertyId}</span>
                  </div>
                   <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-3 text-green-500" />
                    <span className="text-sm sm:text-base font-medium">Contacted - {10}</span>
                  </div>
                  {/* <div className="flex items-center text-gray-700">
                    <Phone className="w-4 h-4 mr-3 text-green-500" />
                    <span className="font-medium">{phone}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-4 h-4 mr-3 text-blue-500" />
                    <span className="truncate">{email}</span>
                  </div> */}
                </div>
              </div>
              
          
            </div>
            
            {/*  Property Details */}
            <div className="flex-1 space-y-1">
               
              
              
              {/* Property Details */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-2 sm:p-2 md:p-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-1  tracking-wide">Property Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="">
                    
                    
                      <div>
                        <p className="text-sm text-gray-500  tracking-wide">Type</p>
                        <p className="font-semibold text-gray-900">{propertyType}</p>
                      </div>
                   
                   
                     
                      <div>
                        <p className="text-sm text-gray-500  tracking-wide">Location</p>
                        <p className="font-medium text-gray-700 truncate">{location}</p>
                      </div>
                   
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-center sm:text-right">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors px-4 py-2 text-sm font-semibold">
                        <Ruler className="w-4 h-4 mr-2" />
                        {builtupArea}
                      </Badge>
                    </div>
                    <div className="text-center sm:text-right">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors px-4 py-2 text-lg font-bold">
                        ₹ {price}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          
          <div className="mt-2 pt-4 mb-1 ">
            <div className="flex flex-col md:flex-row md:flex-start gap-3 sm:gap-4 ">
              <Button
                variant="outline"
                className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-semibold py-3"
              >
                 Favourites
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 font-semibold py-3"
              >
                View Contacted
              </Button>
              {/* <Button className="flex-1 bg-[#1D3A76]  hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                Contact CRM
              </Button> */}
            </div>
          </div>
        </div>
      </CardContent>
    </CustomCard>
  );
};

export default EnquiryCard;