"use client"
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange }) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const clearFilters = () => {
    Object.keys(filters).forEach(key => {
      onFilterChange(key, key === 'propertyFor' || key === 'propertyType' || key === 'bhk' || key === 'verificationStatus' ? 'all' : '');
    });
  };

  return (
    <div className="space-y-4">
      {/* Modern Filter Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <SlidersHorizontal className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Smart Property Filters</h3>
                <p className="text-blue-100 text-sm">Find your perfect property match</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="text-white hover:bg-white/10 border border-white/30"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showMoreFilters ? 'Less Filters' : 'More Filters'}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Main Filters */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Search Location */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search Location..."
                value={filters.searchLocation}
                onChange={(e) => onFilterChange('searchLocation', e.target.value)}
                className="pl-11 h-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
              />
            </div>

            {/* Property For */}
            <Select value={filters.propertyFor} onValueChange={(value) => onFilterChange('propertyFor', value)}>
              <SelectTrigger className="h-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm">
                <SelectValue placeholder="Property For" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl border-0 shadow-2xl">
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="sell">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
                <SelectItem value="pg">PG/Co-living</SelectItem>
              </SelectContent>
            </Select>

            {/* Property Type */}
            <Select value={filters.propertyType} onValueChange={(value) => onFilterChange('propertyType', value)}>
              <SelectTrigger className="h-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl border-0 shadow-2xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">🏢 Apartment</SelectItem>
                <SelectItem value="villa">🏡 Villa</SelectItem>
                <SelectItem value="plot">📐 Plot</SelectItem>
                <SelectItem value="commercial">🏬 Commercial</SelectItem>
              </SelectContent>
            </Select>

            {/* BHK */}
            <Select value={filters.bhk} onValueChange={(value) => onFilterChange('bhk', value)}>
              <SelectTrigger className="h-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm">
                <SelectValue placeholder="BHK Configuration" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl border-0 shadow-2xl">
                <SelectItem value="all">All BHK</SelectItem>
                <SelectItem value="1">1 BHK</SelectItem>
                <SelectItem value="2">2 BHK</SelectItem>
                <SelectItem value="3">3 BHK</SelectItem>
                <SelectItem value="4">4 BHK</SelectItem>
                <SelectItem value="5+">5+ BHK</SelectItem>
              </SelectContent>
            </Select>

            {/* Verification Status */}
            <Select value={filters.verificationStatus} onValueChange={(value) => onFilterChange('verificationStatus', value)}>
              <SelectTrigger className="h-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl border-0 shadow-2xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">✅ Verified</SelectItem>
                <SelectItem value="pending">⏳ Pending</SelectItem>
                <SelectItem value="rejected">❌ Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters */}
          {showMoreFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Property ID */}
                <Input
                  placeholder="Property ID"
                  value={filters.propertyId}
                  onChange={(e) => onFilterChange('propertyId', e.target.value)}
                  className="h-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
                />

                {/* Price Range */}
                <Select>
                  <SelectTrigger className="h-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm">
                    <SelectValue placeholder="💰 Price Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl border-0 shadow-2xl">
                    <SelectItem value="0-1L">Under ₹1 Lakh</SelectItem>
                    <SelectItem value="1-5L">₹1-5 Lakh</SelectItem>
                    <SelectItem value="5-10L">₹5-10 Lakh</SelectItem>
                    <SelectItem value="10L+">Above ₹10 Lakh</SelectItem>
                  </SelectContent>
                </Select>

                {/* Area */}
                <Select>
                  <SelectTrigger className="h-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm">
                    <SelectValue placeholder="📐 Area" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl border-0 shadow-2xl">
                    <SelectItem value="0-500">Under 500 sq ft</SelectItem>
                    <SelectItem value="500-1000">500-1000 sq ft</SelectItem>
                    <SelectItem value="1000-2000">1000-2000 sq ft</SelectItem>
                    <SelectItem value="2000+">Above 2000 sq ft</SelectItem>
                  </SelectContent>
                </Select>

                {/* Furnishing */}
                <Select>
                  <SelectTrigger className="h-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm">
                    <SelectValue placeholder="🪑 Furnishing" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl border-0 shadow-2xl">
                    <SelectItem value="furnished">Fully Furnished</SelectItem>
                    <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
                    <SelectItem value="unfurnished">Unfurnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 border-2 border-transparent hover:border-red-200 rounded-xl transition-all"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
