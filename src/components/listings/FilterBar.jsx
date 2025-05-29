"use client";
import React, { useState } from 'react';
import { Search, Filter, X, MapPin, Home, Bed, Shield, ChevronDown } from 'lucide-react';

const FilterBar = ({ filters = {
  searchLocation: '',
  propertyFor: 'all',
  propertyType: 'all',
  bhk: 'all',
  verificationStatus: 'all'
}, onFilterChange = () => {} }) => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const clearFilters = () => {
    Object.keys(filters).forEach(key => {
      onFilterChange(
        key,
        ['propertyFor', 'propertyType', 'bhk', 'verificationStatus'].includes(key) ? 'all' : ''
      );
    });
  };

  const hasActiveFilters = () => {
    return filters.searchLocation || 
           filters.propertyFor !== 'all' || 
           filters.propertyType !== 'all' || 
           filters.bhk !== 'all' || 
           filters.verificationStatus !== 'all';
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchLocation) count++;
    if (filters.propertyFor !== 'all') count++;
    if (filters.propertyType !== 'all') count++;
    if (filters.bhk !== 'all') count++;
    if (filters.verificationStatus !== 'all') count++;
    return count;
  };

  const CustomSelect = ({ value, onChange, placeholder, options, icon: Icon, className = "" }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-blue-600 transition-colors z-10">
        <Icon size={16} color='#1D37A6' />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 pl-10 pr-8 bg-white border-2 border-gray-200 rounded-xl text-gray-800 font-medium
                   hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                   transition-all duration-200 shadow-sm hover:shadow-md
                   appearance-none cursor-pointer text-sm
                   bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-no-repeat bg-[length:10px_6px] bg-[position:calc(100%-12px)_center]"
      >
        <option value="all">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const filterOptions = {
    propertyFor: [
      { value: 'sell', label: 'For Sale' },
      { value: 'rent', label: 'For Rent' },
      { value: 'pg', label: 'PG/Co-living' }
    ],
    propertyType: [
      { value: 'apartment', label: '🏢 Apartment' },
      { value: 'villa', label: '🏡 Villa' },
      { value: 'plot', label: '📐 Plot' },
      { value: 'commercial', label: '🏬 Commercial' }
    ],
    bhk: [
      { value: '1', label: '1 BHK' },
      { value: '2', label: '2 BHK' },
      { value: '3', label: '3 BHK' },
      { value: '4', label: '4 BHK' },
      { value: '5+', label: '5+ BHK' }
    ],
    verificationStatus: [
      { value: 'verified', label: '✅ Verified' },
      { value: 'pending', label: '⏳ Pending' },
      { value: 'rejected', label: '❌ Rejected' }
    ]
  };

  return (
    <>
      {/* Desktop Single Row Layout (lg, xl, 2xl, 3xl) */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3">
              
              {/* Search Location - Flexible width */}
              <div className="relative group flex-1 min-w-0 lg:max-w-xs xl:max-w-sm 2xl:max-w-md">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors z-10">
                  <Search size={16} color='#1D37A6'/>
                </div>
                <input
                  type="text"
                  placeholder="Search location..."
                  value={filters.searchLocation}
                  onChange={(e) => onFilterChange('searchLocation', e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 font-medium
                           placeholder:text-gray-500 placeholder:font-normal
                           hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                           transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                />
              </div>

              {/* Property For */}
              <CustomSelect
                value={filters.propertyFor}
                onChange={(value) => onFilterChange('propertyFor', value)}
                placeholder="All Properties"
                icon={MapPin}
                options={filterOptions.propertyFor}
                className="w-40 flex-shrink-0"
              />

              {/* Property Type */}
              <CustomSelect
                value={filters.propertyType}
                onChange={(value) => onFilterChange('propertyType', value)}
                placeholder="All Types"
                icon={Home}
                options={filterOptions.propertyType}
                className="w-44 flex-shrink-0"
              />

              {/* BHK Configuration */}
              <CustomSelect
                value={filters.bhk}
                onChange={(value) => onFilterChange('bhk', value)}
                placeholder="All BHK"
                icon={Bed}
                options={filterOptions.bhk}
                className="w-32 flex-shrink-0"
              />

              {/* Verification Status */}
              <CustomSelect
                value={filters.verificationStatus}
                onChange={(value) => onFilterChange('verificationStatus', value)}
                placeholder="All Status"
                icon={Shield}
                options={filterOptions.verificationStatus}
                className="w-36 flex-shrink-0"
              />

              {/* Clear Filters Button */}
             
            </div>

            <div className='flex justify-end'>
                 {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-3 mt-2 bg-[#1D37A6] hover:bg-[#1D37A6] text-white font-medium rounded-xl 
                           transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0 text-sm"
                >
                  <X size={16} className="mr-1" />
                  Clear
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Layout (sm, md) */}
      <div className="lg:hidden">
        {/* Top Filter Button */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-4">
          <div className="p-4">
            {/* Search Bar */}
            <div className="relative group mb-3">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-[#1D37A6] transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search location and name..."
                value={filters.searchLocation}
                onChange={(e) => onFilterChange('searchLocation', e.target.value)}
                className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800
                         placeholder:text-gray-500 focus:border-[#1D37A6] focus:ring-2 focus:ring-blue-100 
                         transition-all duration-200"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowBottomSheet(true)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1D37A6] to-[#1D37A6] 
                       hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl 
                       transition-all duration-200 shadow-md"
            >
              <div className="flex items-center">
                <Filter size={18} className="mr-2" />
                <span>Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </div>
              <ChevronDown size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Overlay */}
      {showBottomSheet && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowBottomSheet(false)}
          />
          
          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center">
                <Filter size={20} className="mr-2 text-[#1D37A6]" />
                <h3 className="text-lg font-semibold text-gray-800">Filter Properties</h3>
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-[#1D37A6] rounded-full text-xs font-medium">
                    {getActiveFiltersCount()} active
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowBottomSheet(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(80vh-140px)]">
              
              {/* Property For */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property For</label>
                <CustomSelect
                  value={filters.propertyFor}
                  onChange={(value) => onFilterChange('propertyFor', value)}
                  placeholder="All Properties"
                  icon={MapPin}
                  options={filterOptions.propertyFor}
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <CustomSelect
                  value={filters.propertyType}
                  onChange={(value) => onFilterChange('propertyType', value)}
                  placeholder="All Types"
                  icon={Home}
                  options={filterOptions.propertyType}
                />
              </div>

              {/* BHK and Verification in a row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
                  <CustomSelect
                    value={filters.bhk}
                    onChange={(value) => onFilterChange('bhk', value)}
                    placeholder="All BHK"
                    icon={Bed}
                    options={filterOptions.bhk}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <CustomSelect
                    value={filters.verificationStatus}
                    onChange={(value) => onFilterChange('verificationStatus', value)}
                    placeholder="All Status"
                    icon={Shield}
                    options={filterOptions.verificationStatus}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-3">
                {hasActiveFilters() && (
                  <button
                    onClick={clearFilters}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-[#1D37A6] hover:bg-[#1D37A6] 
                             text-white font-semibold rounded-xl transition-all duration-200 shadow-md"
                  >
                    <X size={16} className="mr-2" />
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowBottomSheet(false)}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-[#1D37A6] hover:bg-[#1D37A6]
                           text-white font-semibold rounded-xl transition-all duration-200 shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBar;