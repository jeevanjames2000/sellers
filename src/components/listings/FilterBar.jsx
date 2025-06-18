'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Filter, X, MapPin, Home, Bed, ChevronDown } from 'lucide-react';
import { setPropertyFor, setPropertyIn, setSubType, setBHK, setLocation, setStatusFilter } from '@/store/slices/searchSlice';

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const FilterBar = ({ onFilterChange = () => {} }) => {
  const dispatch = useDispatch();
  const { property_for, property_in, sub_type, bhk, location, statusFilter } = useSelector((state) => state.search);

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [searchValue, setSearchValue] = useState(location || '');

  // Sync filters with Redux state
  const filters = {
    searchLocation: location || '',
    propertyFor: property_for || 'Sell',
    propertyType: property_in || '',
    propertySubType: sub_type || '',
    bhk: bhk || '',
    statusFilterBuy: statusFilter?.buy ?? null,
    statusFilterRent: statusFilter?.rent ?? null,
  };

  // Reset dependent filters when propertyType or propertySubType changes
  useEffect(() => {
    if (property_in !== 'Residential' && property_in !== 'Commercial') {
      dispatch(setSubType(''));
      dispatch(setBHK(''));
    } else if (property_in === 'Commercial') {
      dispatch(setBHK(''));
    }

    if (
      property_in === 'Residential' &&
      !['Apartment', 'Independent House', 'Independent Villa'].includes(sub_type)
    ) {
      dispatch(setBHK(''));
    }
  }, [property_in, sub_type, dispatch]);

  // Sync searchValue with location from Redux
  useEffect(() => {
    setSearchValue(location || '');
  }, [location]);

  // Debounced dispatch for location
  const debouncedSetLocation = useCallback(
    debounce((value) => {
      dispatch(setLocation(value));
      onFilterChange('searchLocation', value);
    }, 500),
    [dispatch, onFilterChange]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSetLocation(value);
  };

  const clearSearch = () => {
    setSearchValue('');
    dispatch(setLocation(''));
    onFilterChange('searchLocation', '');
  };

  const clearFilters = () => {
    dispatch(setLocation(''));
    dispatch(setPropertyFor('Sell'));
    dispatch(setPropertyIn(''));
    dispatch(setSubType(''));
    dispatch(setBHK(''));
    dispatch(setStatusFilter({ type: 'buy', value: null }));
    dispatch(setStatusFilter({ type: 'rent', value: null }));
  };

  const hasActiveFilters = () => {
    return (
      filters.searchLocation !== '' ||
      filters.propertyFor !== 'Sell' ||
      filters.propertyType !== '' ||
      filters.propertySubType !== '' ||
      filters.bhk !== '' ||
      filters.statusFilterBuy !== null ||
      filters.statusFilterRent !== null
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchLocation !== '') count++;
    if (filters.propertyFor !== 'Sell') count++;
    if (filters.propertyType !== '') count++;
    if (filters.propertySubType !== '') count++;
    if (filters.bhk !== '') count++;
    if (filters.statusFilterBuy !== null) count++;
    if (filters.statusFilterRent !== null) count++;
    return count;
  };

  const filterOptions = {
    propertyFor: [
      { value: 'Sell', label: 'Buy' },
      { value: 'Rent', label: 'Rent' },
    ],
    propertyType: [
      { value: 'Residential', label: 'Residential' },
      { value: 'Commercial', label: 'Commercial' },
    ],
    propertySubType: {
      Residential: [
        { value: 'Apartment', label: 'Apartment' },
        { value: 'Independent House', label: 'Independent House' },
        { value: 'Independent Villa', label: 'Independent Villa' },
        { value: 'Plot', label: 'Plot' },
        { value: 'Land', label: 'Land' },
        { value: 'Others', label: 'Others' },
      ],
      Commercial: [
        { value: 'Office', label: 'Office' },
        { value: 'Retail Shop', label: 'Retail Shop' },
        { value: 'Show Room', label: 'Show Room' },
        { value: 'Warehouse', label: 'Warehouse' },
        { value: 'Plot', label: 'Plot' },
        { value: 'Others', label: 'Others' },
      ],
    },
    bhk: [
      { value: '1', label: '1 BHK' },
      { value: '2', label: '2 BHK' },
      { value: '3', label: '3 BHK' },
      { value: '4', label: '4 BHK' },
      { value: '5+', label: '5+ BHK' },
    ],
    status: [
      { value: '0', label: 'Review' },
      { value: '1', label: 'Approved' },
      { value: '2', label: 'Rejected' },
    ],
  };

  const subTypeOptions =
    filters.propertyType === 'Residential'
      ? filterOptions.propertySubType.Residential
      : filters.propertyType === 'Commercial'
      ? filterOptions.propertySubType.Commercial
      : [];

  const showBHK =
    filters.propertyType === 'Residential' &&
    ['Apartment', 'Independent House', 'Independent Villa'].includes(filters.propertySubType);

  const handleFilterChangeInternal = (filterName, value) => {
    switch (filterName) {
      case 'searchLocation':
        dispatch(setLocation(value));
        break;
      case 'propertyFor':
        dispatch(setPropertyFor(value));
        dispatch(setStatusFilter({ type: value === 'Sell' ? 'buy' : 'rent', value: null }));
        break;
      case 'propertyType':
        dispatch(setPropertyIn(value));
        break;
      case 'propertySubType':
        dispatch(setSubType(value));
        break;
      case 'bhk':
        dispatch(setBHK(value));
        break;
      case 'statusFilter':
        dispatch(setStatusFilter({ type: filters.propertyFor === 'Sell' ? 'buy' : 'rent', value: value ? parseInt(value) : null }));
        onFilterChange('statusFilter', value); // Ensure onFilterChange is called for status
        break;
      default:
        break;
    }
    onFilterChange(filterName, value);
  };

  return (
    <>
      <div className="hidden lg:block">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative group flex-1 min-w-0 lg:max-w-xs xl:max-w-sm 2xl:max-w-md">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors z-10">
                  <Search size={16} color="#1D37A6" />
                </div>
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="w-full h-12 pl-10 pr-10 bg-white border-2 border-gray-200 rounded-xl text-gray-800 font-medium
                           placeholder:text-gray-500 placeholder:font-normal
                           hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                           transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                />
                {searchValue && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors z-10"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <CustomSelect
                value={filters.propertyFor}
                onChange={(value) => handleFilterChangeInternal('propertyFor', value)}
                placeholder="Property For"
                icon={MapPin}
                options={filterOptions.propertyFor}
                className="w-40 flex-shrink-0"
              />

              <CustomSelect
                value={filters.propertyType}
                onChange={(value) => handleFilterChangeInternal('propertyType', value)}
                placeholder="Property Types"
                icon={Home}
                options={filterOptions.propertyType}
                className="w-44 flex-shrink-0"
              />

              <CustomSelect
                value={filters.propertySubType}
                onChange={(value) => handleFilterChangeInternal('propertySubType', value)}
                placeholder="Property SubTypes"
                icon={Home}
                options={subTypeOptions}
                className="w-44 flex-shrink-0"
              />

              {showBHK && (
                <CustomSelect
                  value={filters.bhk}
                  onChange={(value) => handleFilterChangeInternal('bhk', value)}
                  placeholder="BHK"
                  icon={Bed}
                  options={filterOptions.bhk}
                  className="w-32 flex-shrink-0"
                />
              )}

              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-3 bg-[#1D37A6] hover:bg-[#1D37A6] text-white font-medium rounded-xl 
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

      <div className="lg:hidden">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-4">
          <div className="p-4">
            <div className="relative group mb-3">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-[#1D37A6] transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search location and name..."
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full h-12 pl-11 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-800
                         placeholder:text-gray-500 focus:border-[#1D37A6] focus:ring-2 focus:ring-blue-100 
                         transition-all duration-200"
              />
              {searchValue && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors z-10"
                >
                  <X size={18} />
                </button>
              )}
            </div>

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

      {showBottomSheet && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowBottomSheet(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property For</label>
                <CustomSelect
                  value={filters.propertyFor}
                  onChange={(value) => handleFilterChangeInternal('propertyFor', value)}
                  placeholder="All Properties"
                  icon={MapPin}
                  options={filterOptions.propertyFor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <CustomSelect
                  value={filters.propertyType}
                  onChange={(value) => handleFilterChangeInternal('propertyType', value)}
                  placeholder="All Types"
                  icon={Home}
                  options={filterOptions.propertyType}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property SubType</label>
                <CustomSelect
                  value={filters.propertySubType}
                  onChange={(value) => handleFilterChangeInternal('propertySubType', value)}
                  placeholder="All SubTypes"
                  icon={Home}
                  options={subTypeOptions}
                />
              </div>

              {showBHK && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
                  <CustomSelect
                    value={filters.bhk}
                    onChange={(value) => handleFilterChangeInternal('bhk', value)}
                    placeholder="All BHK"
                    icon={Bed}
                    options={filterOptions.bhk}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <CustomSelect
                  value={filters.propertyFor === 'Sell' ? filters.statusFilterBuy ?? '' : filters.statusFilterRent ?? ''}
                  onChange={(value) => handleFilterChangeInternal('statusFilter', value)}
                  placeholder="All Statuses"
                  icon={Filter}
                  options={filterOptions.status}
                />
              </div>
            </div>

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

  function CustomSelect({ value, onChange, placeholder, options, icon: Icon, className = '' }) {
    return (
      <div className={`relative group ${className}`}>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-blue-600 transition-colors z-10">
          <Icon size={16} color="#1D37A6" />
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
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
};

export default FilterBar;