"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CustomCard,
} from "@/components/ui/card";
import {
  MessageSquare,
  Download,
  Bell,
  Users,
  Phone,
  Mail,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loading } from "@/lib/loader";
import {
  setActivity,
  setResultsLoading,
  setResultsError,
} from "@/store/slices/enquirySlice";
import { fetchAllCities } from "@/store/slices/places";
import EnquiryFilterBar from "@/components/shared/EnquiryFilterBar";
import { PaginationWrapper } from "@/components/enquires/PaginationWrapper";
function ContactedDetailsContent({ initialPage }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { results, resultsLoading, resultsError } = useSelector(
    (state) => state.enquiries
  );
  const { cities, citiesLoading, citiesError } = useSelector(
    (state) => state.places
  );
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [visibleContacts, setVisibleContacts] = useState(new Set());
  const [cityFilter, setCityFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const fetchActivity = async () => {
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
    if (!userId) {
      dispatch(setResultsError("User ID not found. Please log in again."));
      return;
    }
    dispatch(setResultsLoading());
    try {
      const response = await fetch(
        `https://api.meetowner.in/enquiry/v1/getAllFavouritesByUserId?user_id=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch property activity");
      }
      const data = await response.json();
      dispatch(setActivity({ results: data.favourites || [] }));
    } catch (err) {
      dispatch(setResultsError(err.message));
    }
  };
  useEffect(() => {
    fetchActivity();
  }, [dispatch]);
  useEffect(() => {
    if (selectedState) {
      dispatch(fetchAllCities({ state: selectedState }));
    } else {
      dispatch(fetchAllCities());
    }
  }, [dispatch, selectedState]);
  const filteredResults = results.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.userDetails?.name?.toLowerCase().includes(searchLower) ||
      item.property_name?.toLowerCase().includes(searchLower) ||
      item.unique_property_id?.toLowerCase().includes(searchLower);
    const matchesCity = cityFilter
      ? item.city_id?.toLowerCase() === cityFilter.toLowerCase()
      : true;
    const itemDate = new Date(item.created_date);
    const matchesDate =
      (!startDate || itemDate >= new Date(startDate)) &&
      (!endDate || itemDate <= new Date(endDate));
    return matchesSearch && matchesCity && matchesDate;
  });
  const totalItems = filteredResults.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredResults.slice(startIndex, endIndex);
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleBack = () => {
    router.back();
  };
  const hideUserDetails = (id) => {
    if (!id) return "N/A";
    return `${id.slice(0, 3)}xxxxxxx`;
  };
  const toggleContactVisibility = (id) => {
    setVisibleContacts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  const handleClearFilters = () => {
    setSearchTerm("");
    setCityFilter("");
    setStartDate(null);
    setEndDate(null);
    setSelectedState("");
    setCurrentPage(1);
  };
  const handleViewDetails = (propertyId) => {
    router.push(`/propertyDetails?Id=${propertyId}`);
  };
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Favourites
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {results.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-[#1D37A6] rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <CustomCard className="bg-white shadow-lg border-0 py-4">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 bg-green-50 border-green-200 hover:bg-green-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Download className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-green-800">
                        Export Reports
                      </p>
                      <p className="text-xs text-wrap text-green-600">
                        Download detailed analytics
                      </p>
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 bg-purple-50 border-purple-200 hover:bg-purple-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Bell className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-purple-800">Set Alerts</p>
                      <p className="text-xs text-wrap text-purple-600">
                        Get notified of new enquiries
                      </p>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </CustomCard>
          </div>
          {}
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="border-b border-gray-200 bg-gray-50 py-4">
                <div className="flex flex-col space-y-4">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Contact Details
                  </CardTitle>
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-row justify-between items-center">
                      <Input
                        placeholder="Search by name, property name, or ID..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full sm:w-64"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handleBack}
                          className="text-gray-600 border-gray-200 hover:bg-gray-50"
                        >
                          Back
                        </Button>
                      </div>
                    </div>
                    <EnquiryFilterBar
                      showDateFilters={true}
                      showCityFilter={true}
                      showStateFilter={true}
                      onStartDateChange={setStartDate}
                      onEndDateChange={setEndDate}
                      onStateChange={setSelectedState}
                      onCityChange={setCityFilter}
                      onClearFilters={handleClearFilters}
                      startDate={startDate}
                      endDate={endDate}
                      stateValue={selectedState}
                      cityValue={cityFilter}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Showing {paginatedData.length} of {totalItems} enquiries
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {resultsLoading || citiesLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <Loading color="#1D37A6" />
                    <p className="text-lg">Loading enquiries...</p>
                  </div>
                ) : resultsError || citiesError ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Contacted Sellers found for this property
                    </h3>
                    <p className="text-sm text-center max-w-sm">
                      {resultsError || citiesError}
                    </p>
                  </div>
                ) : paginatedData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-gray-900">
                            Sl.No
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Name
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Communication
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Enquiry Date
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Property ID
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Property Name
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Property For
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Property Type
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Property In
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            City
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((item, index) => (
                          <TableRow
                            key={item.id}
                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                            }`}
                          >
                            <TableCell className="py-4">
                              {startIndex + index + 1}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {item.userDetails?.name || "Unknown"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                  {visibleContacts.has(item.id)
                                    ? item.userDetails?.email || "N/A"
                                    : hideUserDetails(item.userDetails?.email)}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                  {visibleContacts.has(item.id)
                                    ? item.userDetails?.mobile || "N/A"
                                    : hideUserDetails(item.userDetails?.mobile)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-500">
                                  {new Date(
                                    item.created_date
                                  ).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-2">
                                {item.unique_property_id || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-2">
                                {item.property_name || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-2">
                                {item.property_for || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-2">
                                {item.sub_type || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-2">
                                {item.property_in || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-2">
                                {item.city_id || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    toggleContactVisibility(item.id)
                                  }
                                  aria-label={
                                    visibleContacts.has(item.id)
                                      ? "Hide contact details"
                                      : "Show contact details"
                                  }
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    handleViewDetails(item.unique_property_id)
                                  }
                                  aria-label="View property details"
                                  disabled={!item.unique_property_id}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No enquiries found
                    </h3>
                    <p className="text-sm text-center max-w-sm">
                      Try adjusting your search terms or filters to find what
                      you're looking for.
                    </p>
                  </div>
                )}
              </CardContent>
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center p-4">
                  <PaginationWrapper
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function ContactedDetails() {
  const [initialPage, setInitialPage] = useState(1);
  function SearchParamsWrapper({ setInitialPage }) {
    const searchParams = useSearchParams();
    useEffect(() => {
      const page = parseInt(searchParams.get("page")) || 1;
      setInitialPage(page);
    }, [searchParams, setInitialPage]);
    return null;
  }
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
          <Loading color="#1D37A6" />
          <p className="text-lg ml-4">Loading contact details...</p>
        </div>
      }
    >
      <SearchParamsWrapper setInitialPage={setInitialPage} />
      <ContactedDetailsContent initialPage={initialPage} />
    </Suspense>
  );
}
