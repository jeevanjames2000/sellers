"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
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
  setStatusFilter,
} from "@/store/slices/searchSlice";
import { Loading } from "@/lib/loader";
import { Button } from "@/components/ui/button";
import config from "../api/config";

const ListingsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    property_for,
    property_in,
    sub_type,
    bhk,
    location,
    loading,
    error,
    statusFilter,
  } = useSelector((state) => state.search);
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [properties, setProperties] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);

  const filters = {
    searchLocation: location,
    propertyFor: property_for,
    propertyType: property_in,
    propertySubType: sub_type,
    bhk: bhk,
    verificationStatus:
      statusFilter[property_for === "Sell" ? "buy" : "rent"] ?? null, // Remove default to '1'
    propertyId: "",
  };

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page")) || 1;
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }
  }, [searchParams]);

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
      userId = null;
    }
    try {
      let apiPropertyFor = property_for || "Sell";
      let apiPropertyStatus =
        statusFilter[apiPropertyFor === "Sell" ? "buy" : "rent"] ?? ""; 
      const queryParams = {
        page: currentPage,
        property_for: apiPropertyFor,
        property_in: property_in || "Residential",
        sub_type: sub_type || "",
        search: location || "",
        bedrooms: bhk || "",
        property_cost: "",
        priceFilter: "",
        occupancy: "",
        property_status: apiPropertyStatus,
        city_id: "",
        user_id: userId,
      };
      const url = new URL(`${config.api_url}/listings/v1/getAllListingsByType`);
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
      setProperties(data.properties || []);
      setTotalPages(data.total_pages || 1);
      setTotalCount(data.total_count || 0);
      setCurrentCount(data.current_count || 0);
    } catch (err) {
      dispatch(setError(err.message));
      setProperties([]);
      setTotalPages(1);
      setTotalCount(0);
      setCurrentCount(0);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [
    currentPage,
    property_for,
    property_in,
    sub_type,
    bhk,
    location,
    statusFilter,
    dispatch,
  ]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentPage === 1) {
      params.delete("page");
    } else {
      params.set("page", currentPage);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [currentPage, router, searchParams]);

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
      case "statusFilter":
        dispatch(
          setStatusFilter({
            type: property_for === "Sell" ? "buy" : "rent",
            value: value ? parseInt(value) : null,
          })
        );
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  return (
    <div className="p-6 sm:p-2 lg:p-6 space-y-8">
      <FilterBar onFilterChange={handleFilterChange} />
      {loading ? (
        <div className="text-center py-16">
          <Loading color="[#1D7A36]" />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-600 text-lg">Error: {error}</p>
          <Button
            onClick={() => handlePageChange(currentPage)}
            className="mt-4 bg-[#1D3A76] hover:bg-[#2B4A86] text-white px-8 py-3 rounded-lg"
          >
            Retry
          </Button>
        </div>
      ) : null}
      {!loading && !error && properties.length === 0 && (
        <p className="text-center text-gray-600 text-lg">
          No properties found.
        </p>
      )}
      {!loading && properties.length > 0 && (
        <div className="mb-2">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-600 text-base sm:text-lg">
              Displaying{" "}
              <span className="font-semibold text-[#1D3A76]">
                {currentCount}
              </span>{" "}
              out of{" "}
              <span className="font-semibold text-[#1D3A76]">{totalCount}</span>{" "}
              Listings
            </p>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {properties.map((property, index) => (
          <div
            key={property.id}
            className="animate-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <PropertyCard
              id={property.unique_property_id}
              title={property.property_name}
              price={property.property_cost || "N/A"}
              bhk={property.bedrooms || "N/A"}
              type={property.property_in}
              status={
                property.property_status === 1
                  ? "Approved"
                  : property.property_status === 0
                  ? "Review"
                  : "Rejected"
              }
              location={
                property.google_address ||
                property.city_id ||
                property.location_id ||
                "N/A"
              }
              facing={property.facing || null}
              lastUpdated={property.updated_date || "N/A"}
              expiryDate={property.expiry_date || "N/A"}
              furnished_status={property.furnished_status || "N/A"}
              enquiries={property.enquiries || 0}
              favourites={property.favourites || 0}
              image={
                property.image
                  ? `https://api.meetowner.in/uploads/${property.image}`
                  : "https://placehold.co/400x300"
              }
              developer={property.user?.name || "N/A"}
              propertyFor={property.property_for || "N/A"}
              propertyType={property.property_in || "N/A"}
              propertySubType={property.sub_type || "N/A"}
              monthly_rent={property.monthly_rent || "N/A"}
              occupancy={property.occupancy || "N/A"}
              available_from={property.available_from || "N/A"}
              user_id={property.user_id}
              fetchProperties={fetchProperties}
            />
          </div>
        ))}
      </div>
      {totalCount > 0 && totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <PaginationWrapper
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
