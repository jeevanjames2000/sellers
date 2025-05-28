"use client"
import React, { useState } from 'react';
import { Card, CardContent, CustomCard } from '@/components/ui/card';
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
      {/* <FilterBar filters={filters} onFilterChange={handleFilterChange} /> */}
      

  

      {/* Property Cards */}
      <div className="space-y-3">
        {listingsData.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>

      {/* Enhanced Pagination */}
      <CustomCard className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden py-3">
        <CardContent className="">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm xl:text-md text-gray-600">
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
      </CustomCard>
    </div>
  );
};

export default ListingsPage;
