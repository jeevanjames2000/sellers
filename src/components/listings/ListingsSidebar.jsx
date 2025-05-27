"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Building, Home, Building2, Filter } from 'lucide-react';

const ListingsSidebar = () => {
  const [openSections, setOpenSections] = useState({
    category: true,
    buy: true,
    rent: false,
    pg: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const categories = [
    { label: 'Residential Properties', active: true, icon: Home },
    { label: 'Commercial Properties', active: false, icon: Building2 }
  ];

  const subCategories = {
    buy: [
      { label: 'Buy', count: 10, active: true },
      { label: 'Reported', count: 0 },
      { label: 'Active', count: 5 },
      { label: 'Expired', count: 2 },
      { label: 'Rejected', count: 1 },
      { label: 'Deleted', count: 0 },
      { label: 'Expiring Soon', count: 2 }
    ],
    rent: [
      { label: 'Rent', count: 0 },
      { label: 'Reported', count: 0 },
      { label: 'Active', count: 0 },
      { label: 'Expired', count: 0 },
      { label: 'Rejected', count: 0 },
      { label: 'Deleted', count: 0 },
      { label: 'Under Review', count: 0 }
    ],
    pg: [
      { label: 'PG', count: 0 },
      { label: 'All', count: 0 },
      { label: 'Reported', count: 0 },
      { label: 'Active', count: 0 },
      { label: 'Expired', count: 0 },
      { label: 'Rejected', count: 0 },
      { label: 'Deleted', count: 0 },
      { label: 'Under Review', count: 0 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Category Selection Card */}
      <Card className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-900">Property Categories</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <label key={index} className="flex items-center space-x-4 cursor-pointer group p-3 rounded-xl hover:bg-blue-50 transition-all duration-200">
                  <input
                    type="radio"
                    name="category"
                    defaultChecked={category.active}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <IconComponent className={`w-5 h-5 ${category.active ? 'text-blue-600' : 'text-gray-400'} group-hover:text-blue-600 transition-colors`} />
                    <span className={`font-medium ${
                      category.active ? 'text-blue-700' : 'text-gray-700'
                    } group-hover:text-blue-700 transition-colors`}>
                      {category.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sub Categories Card */}
      <Card className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Building className="w-5 h-5 text-green-600" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-900">Sub Categories</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {/* Buy Section */}
          <Collapsible open={openSections.buy} onOpenChange={() => toggleSection('buy')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-blue-50 rounded-xl transition-all duration-200 group">
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Buy Properties</span>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-800 font-semibold px-3 py-1">
                    10
                  </Badge>
                  {openSections.buy ? (
                    <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 ml-4 space-y-2">
              {subCategories.buy.map((item, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center justify-between p-3 text-sm rounded-lg transition-all duration-200 ${
                    item.active 
                      ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span>{item.label}</span>
                  <Badge variant={item.active ? "default" : "secondary"} className={`text-xs font-medium ${
                    item.active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.count}
                  </Badge>
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Rent Section */}
          <Collapsible open={openSections.rent} onOpenChange={() => toggleSection('rent')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-green-50 rounded-xl transition-all duration-200 group">
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Rent Properties</span>
                <div className="flex items-center gap-3">
                  <Badge className="bg-gray-100 text-gray-600 font-semibold px-3 py-1">
                    0
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
                  className="w-full flex items-center justify-between p-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                >
                  <span>{item.label}</span>
                  <Badge variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-600">
                    {item.count}
                  </Badge>
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* PG Section */}
          <Collapsible open={openSections.pg} onOpenChange={() => toggleSection('pg')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-purple-50 rounded-xl transition-all duration-200 group">
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">PG Properties</span>
                <div className="flex items-center gap-3">
                  <Badge className="bg-gray-100 text-gray-600 font-semibold px-3 py-1">
                    0
                  </Badge>
                  {openSections.pg ? (
                    <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-colors" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-colors" />
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 ml-4 space-y-2">
              {subCategories.pg.map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                >
                  <span>{item.label}</span>
                  <Badge variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-600">
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
