"use client"
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Grid3X3, List, ArrowUpDown } from 'lucide-react';
import FilterBar from './FilterBar';
import PropertyCard from './PropertyCard';
import { listingsData } from './ListingsData';

const ListingsPage = () => {
  const [filters, setFilters] = useState({
    searchLocation: '',
    propertyFor: 'all',
    propertyType: 'all',
    bhk: 'all',
    verificationStatus: 'all',
    propertyId: ''
  });

  const [viewMode, setViewMode] = useState('grid');

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      
      {/* Enhanced Results Header */}
      <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Property Listings
                </h2>
              </div>
              <p className="text-gray-600 text-lg">
                Showing <span className="font-semibold text-blue-600">{listingsData.length}</span> out of <span className="font-semibold">{listingsData.length}</span> Premium Properties
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>5 Active</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>2 Pending</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>10 Total</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <Select defaultValue="latest">
                <SelectTrigger className="w-48 h-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl border-0 shadow-2xl">
                  <SelectItem value="latest">🕒 Latest First</SelectItem>
                  <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                  <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
                  <SelectItem value="area-large">📐 Area: Large to Small</SelectItem>
                  <SelectItem value="enquiries">👥 Most Enquiries</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Cards */}
      <div className="space-y-8">
        {listingsData.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>

      {/* Enhanced Pagination */}
      <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">1-5</span> of <span className="font-semibold">5</span> results
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all">
                Previous
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg">
                1
              </Button>
              <Button variant="outline" className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all">
                2
              </Button>
              <Button variant="outline" className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all">
                3
              </Button>
              <Button variant="outline" className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingsPage;
