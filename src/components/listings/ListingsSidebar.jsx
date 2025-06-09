"use client";
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Building2, Home } from 'lucide-react';

import { setPropertyFor, setPropertyIn, setStatusFilter,  } from '@/store/slices/searchSlice';

const ListingsSidebar = () => {
  const dispatch = useDispatch();
  const { property_in, statusFilter } = useSelector((state) => state.search);

  const [openSections, setOpenSections] = useState({
    category: true,
    buy: true,
    rent: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const categories = [
    { label: 'Residential Properties', value: 'Residential', active: property_in === 'Residential', icon: Home },
    { label: 'Commercial Properties', value: 'Commercial', active: property_in === 'Commercial', icon: Building2 },
  ];

  const subCategories = {
    buy: [
      { label: 'Review', value: 0, count: 0 },
      { label: 'Approved', value: 1, count: 0 },
      { label: 'Rejected', value: 2, count: 0 },
    ],
    rent: [
      { label: 'Review', value: 0, count: 0 },
      { label: 'Approved', value: 1, count: 0 },
      { label: 'Rejected', value: 2, count: 0 },
    ],
  };

  const handleCategoryChange = (value) => {
    dispatch(setPropertyIn(value));
  };

  const handleStatusFilter = (type, value) => {
    dispatch(setStatusFilter({ type, value }));
     dispatch(setPropertyFor(type === 'buy' ? 'Sell' : 'Rent'));
  };

  return (
    <div className="space-y-3">
      {/* Category Selection Card */}
      <Card className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-2">
          <div className="space-y-1">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`flex items-center space-x-4 cursor-pointer group p-3 rounded-xl transition-all duration-200 w-full ${
                    category.active ? 'bg-blue-50 text-[#1D73A6] font-semibold border-l-4 border-blue-500' : 'hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <IconComponent
                      className={`w-5 h-5 ${category.active ? 'text-[#1D73A6]' : 'text-gray-400'} group-hover:text-[#1D73A6] transition-colors`}
                    />
                    <span
                      className={`font-medium text-sm ${
                        category.active ? 'text-[#1D73A6]' : 'text-gray-700'
                      } group-hover:text-[#1D73A6] transition-colors`}
                    >
                      {category.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sub Categories Card */}
      <Card className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-1 space-y-1">
          {/* Buy Section */}
          <Collapsible open={openSections.buy} onOpenChange={() => toggleSection('buy')}>
            <CollapsibleTrigger
              className="flex items-center justify-between w-full p-4 text-left hover:bg-blue-50 rounded-xl transition-all duration-200 group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-sm text-gray-900 group-hover:text-[#1D73A6] transition-colors">
                  Buy Properties
                </span>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-800 font-semibold px-3 py-1">
                    {subCategories.buy.reduce((sum, item) => sum + item.count, 0)}
                  </Badge>
                  {openSections.buy ? (
                    <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-[#1D73A6] transition-colors" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#1D73A6] transition-colors" />
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 ml-4 space-y-2">
              {subCategories.buy.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleStatusFilter('buy', item.value)}
                  className={`w-full flex items-center justify-between p-3 text-sm rounded-lg transition-all duration-200 ${
                    statusFilter?.buy === item.value
                      ? 'bg-blue-50 text-[#1D73A6] font-semibold border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <Badge
                    variant={statusFilter?.buy === item.value ? 'default' : 'secondary'}
                    className={`text-xs font-medium ${
                      statusFilter?.buy === item.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.count}
                  </Badge>
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Rent Section */}
          <Collapsible open={openSections.rent} onOpenChange={() => toggleSection('rent')}>
            <CollapsibleTrigger
              className="flex items-center justify-between w-full p-4 text-left hover:bg-green-50 rounded-xl transition-all duration-200 group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-sm text-gray-900 group-hover:text-green-700 transition-colors">
                  Rent Properties
                </span>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800 font-semibold px-3 py-1">
                    {subCategories.rent.reduce((sum, item) => sum + item.count, 0)}
                  </Badge>
                  {openSections.rent ? (
                    <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-colors" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-colors" />
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 ml-4 space-y-2">
              {subCategories.rent.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleStatusFilter('rent', item.value)}
                  className={`w-full flex items-center justify-between p-3 text-sm rounded-lg transition-all duration-200 ${
                    statusFilter?.rent === item.value
                      ? 'bg-green-50 text-green-700 font-semibold border-l-4 border-green-500'
                      : 'text-gray-600 hover:bg-green-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <Badge
                    variant={statusFilter?.rent === item.value ? 'default' : 'secondary'}
                    className={`text-xs font-medium ${
                      statusFilter?.rent === item.value ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.count}
                  </Badge>
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingsSidebar;