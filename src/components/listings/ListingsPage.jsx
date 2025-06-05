"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import FilterBar from "./FilterBar";
import PropertyCard from "./PropertyCard";
import { PaginationWrapper } from "../enquires/PaginationWrapper";
import {
  setPropertyFor,
  setPropertyIn,
  setBHK,
  setLocation,
  setLoading,
  setError,
  setSubType,
} from "@/store/slices/searchSlice";

const ListingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Get filter state from Redux
  const dispatch = useDispatch();
  const { property_for, property_in, sub_type, bhk, location, loading, error } =
    useSelector((state) => state.search);

  // Map FilterBar filters to Redux state
  const filters = {
    searchLocation: location,
    propertyFor: property_for,
    propertyType: property_in,
    propertySubType: sub_type,
    bhk: bhk,
    verificationStatus: "all",
    propertyId: "",
  };

  // Fetch properties when filters or page change
  useEffect(() => {
    const fetchProperties = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        // Map filters to API parameters
        const queryParams = {
          page: currentPage,
          property_for: property_for || "Sell",
          property_in: property_in || "Residential",
          sub_type: sub_type || "", // Use sub_type from Redux
          search: location || "",
          bedrooms: bhk || "",
          property_cost: "",
          priceFilter: "Relevance",
          occupancy: "",
          property_status: 1,
          city_id: "",
        };

        // Construct the API URL
        const url = new URL(
          "https://api.meetowner.in/listings/v1/getAllPropertiesByType"
        );
        Object.keys(queryParams).forEach((key) => {
          if (queryParams[key]) {
            url.searchParams.append(key, queryParams[key]);
          }
        });

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data.properties || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        dispatch(setError(err.message));
        setProperties([]);
        setTotalPages(1);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProperties();
  }, [
    currentPage,
    property_for,
    property_in,
    sub_type,
    bhk,
    location,
    dispatch,
  ]); // Add sub_type to dependencies

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (filterName, value) => {
    // Update Redux state based on filterName
    switch (filterName) {
      case "searchLocation":
        dispatch(setLocation(value));
        break;
      case "propertyFor":
        dispatch(setPropertyFor(value));
        break;
      case "propertyType":
        dispatch(setPropertyIn(value));
        break;
      case "propertySubType": // Handle propertySubType
        dispatch(setSubType(value));
        break;
      case "bhk":
        dispatch(setBHK(value));
        break;
      default:
        break;
    }
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {/* Loading and Error States */}
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-600">Error: {error}</p>}

      {/* Property Listings */}
      {!loading && !error && properties.length === 0 && (
        <p className="text-center text-gray-600">No properties found.</p>
      )}
      <div className="space-y-3">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.unique_property_id}
            title={property.property_name}
            price={property.property_cost || "N/A"}
            bhk={property.bedrooms || "N/A"}
            type={property.property_in}
            status={property.property_status === 1 ? "Active" : "Inactive"}
            location={property.google_address}
            facing={property.facing}
            lastUpdated={property.updated_date}
            expiry={property.expiry_date || "N/A"}
            furnished_status={property.furnished_status || "N/A"}
            enquiries={property.enquiries || 0}
            image={
              property.image
                ? `https://api.meetowner.in/uploads/${property.image}`
                : "https://placehold.co/400x300"
            }
            developer={property.user?.name || "Unknown Developer"}
            propertyFor={property.property_for}
            propertyIn={property.property_in}
            propertySubType={property.sub_type || ""}
            monthly_rent={property.monthly_rent}
            occupancy={property.occupancy}
            available_from={property.available_from}
          />
        ))}
      </div>

      {/* Pagination */}
      {!loading && properties.length > 0 && (
        <div className="mt-6 flex justify-center">
          <PaginationWrapper
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
