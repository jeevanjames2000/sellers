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
import { Loading } from "@/lib/loader";

const ListingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const dispatch = useDispatch();
  const { property_for, property_in, sub_type, bhk, location, loading, error, statusFilter } =
    useSelector((state) => state.search);

  const filters = {
    searchLocation: location,
    propertyFor: property_for,
    propertyType: property_in,
    propertySubType: sub_type,
    bhk: bhk,
    verificationStatus: statusFilter[property_for === 'Sell' ? 'buy' : 'rent'] || '1',
    propertyId: "",
  };

  useEffect(() => {
    const fetchProperties = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const storedUser = localStorage.getItem("userDetails");
      let userId;
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.user_id;
        } catch (error) {
          console.error("Error parsing userDetails from localStorage:", error);
          userId = null;
        }
      } else {
        console.log("No userDetails found in localStorage");
        userId = null;
      }

      try {
        let apiPropertyFor = property_for || "Sell";
        let apiPropertyStatus = statusFilter[apiPropertyFor === 'Sell' ? 'buy' : 'rent'] ?? '1';

        const queryParams = {
          page: currentPage,
          property_for: apiPropertyFor,
          property_in: property_in || "Residential",
          sub_type: sub_type || "",
          search: location || "",
          bedrooms: bhk || "",
          property_cost: "",
          priceFilter: "Relevance",
          occupancy: "",
          property_status: apiPropertyStatus,
          city_id: "",
          user_id: userId,
        };

        const url = new URL("https://api.meetowner.in/listings/v1/getAllListingsByType");
        Object.keys(queryParams).forEach((key) => {
          if (queryParams[key] !== null && queryParams[key] !== "") {
            url.searchParams.append(key, queryParams[key]);
          }
        });

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        console.log(data.properties.length, "length");
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
  }, [currentPage, property_for, property_in, sub_type, bhk, location, statusFilter, dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (filterName, value) => {
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
      case "propertySubType":
        dispatch(setSubType(value));
        break;
      case "bhk":
        dispatch(setBHK(value));
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      <FilterBar onFilterChange={handleFilterChange} />
      {loading ? (
        <div className="text-center py-16">
          <Loading color="[#1D7A36]" />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-600 text-lg">Error: {error}</p>
        </div>
      ) : null}
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
            status={property.property_status === 1 ? "Approved" : property.property_status === 0 ? "Review" : "Rejected"}
            location={property.google_address}
            facing={property.facing}
            lastUpdated={property.updated_date}
            expiry={property.expiry_date || "N/A"}
            furnished_status={property.furnished_status || "N/A"}
            enquiries={property.enquiries || 0}
            favourites={property.favourites || 0}
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