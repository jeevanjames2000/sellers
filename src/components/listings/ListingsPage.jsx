"use client"
import React, { useState } from 'react';
import { Card, CardContent, CustomCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Grid3X3, List, ArrowUpDown } from 'lucide-react';
import FilterBar from './FilterBar';
import PropertyCard from './PropertyCard';
import { listingsData } from './ListingsData';
import { PaginationWrapper } from '../enquires/PaginationWrapper';

const ListingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const totalPages = 15; 
    const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = listingsData.slice(startIndex, endIndex);
  const [filters, setFilters] = useState({
    searchLocation: '',
    propertyFor: 'all',
    propertyType: 'all',
    bhk: 'all',
    verificationStatus: 'all',
    propertyId: ''
  });

  const [viewMode, setViewMode] = useState('grid');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      

  

     
      <div className="space-y-3">
        {paginatedData.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
        <div className="mt-6 flex justify-center">
            <PaginationWrapper
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

      
    </div>
  );
};

export default ListingsPage;
