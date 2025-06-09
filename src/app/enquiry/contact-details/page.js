"use client";
import React, { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Download,
  Bell,
  ArrowLeft,
  Users,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  MapPin,
  Building2,
  Eye,
  MoreHorizontal,
  Star,
  Clock,
} from "lucide-react";

import { Loading } from "@/lib/loader";
import {
  setActivity,
  setResultsError,
  setResultsLoading,
} from "@/store/slices/enquirySlice";

export default function ContactedDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { results, resultsLoading, resultsError } = useSelector(
    (state) => state.enquiries
  );

  const property_name = searchParams.get("property_name") || "Unknown Property";
  const bedrooms = searchParams.get("bedrooms") || "N/A";
  const propertyType = searchParams.get("propertyType") || "N/A";
  const location = searchParams.get("location") || "N/A";
  const propertyId = searchParams.get("propertyId");

  
  const [visibleContacts, setVisibleContacts] = useState(new Set());

  // Fetch activity data when propertyId exists
  useEffect(() => {
    if (propertyId) {
      const fetchActivity = async () => {
        dispatch(setResultsLoading());
        try {
          const response = await fetch(
            `https://api.meetowner.in/listings/v1/getPropertyActivity?property_id=${propertyId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch property activity");
          }
          const data = await response.json();
          dispatch(setActivity({ results: data.results || [] }));
        } catch (err) {
          dispatch(setResultsError(err.message));
        }
      };

      fetchActivity();
    }
  }, [propertyId, dispatch]);

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

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Property Info Card */}
            <Card className="bg-white shadow-lg border-0 overflow-hidden">
              <div className="bg-[#1D37A6] p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{property_name}</h3>
                    <p className="text-blue-100 text-sm">
                      {bedrooms}BHK {propertyType}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-blue-100">
                  <MapPin className="w-4 h-4 mr-2" />
                  <p className="text-sm">{location}</p>
                </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Enquiries
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

            {/* Quick Actions */}
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
                      <p className="text-xs text-green-600">
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
                      <p className="text-xs text-purple-600">
                        Get notified of new enquiries
                      </p>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </CustomCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="border-b border-gray-200 bg-gray-50 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Contact Details
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Showing {results.length} of {results.length} enquiries
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {resultsLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <Loading color="#1D37A6" />
                    <p className="text-lg">Loading enquiries...</p>
                  </div>
                ) : resultsError ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Contacted Sellers found for this property
                    </h3>
                    <p className="text-sm text-center max-w-sm">
                      {resultsError}
                    </p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-gray-900">
                            Contact
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Communication
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Enquiry Details
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((item, index) => (
                          <TableRow
                            key={item.id}
                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                            }`}
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                  {item.userDetails.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {item.userDetails.name || "Unknown"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                  {visibleContacts.has(item.id)
                                    ? item.userDetails.email || "N/A"
                                    : hideUserDetails(item.userDetails.email)}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                  {visibleContacts.has(item.id)
                                    ? item.userDetails.mobile || "N/A"
                                    : hideUserDetails(item.userDetails.mobile)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.enquiry_type || "N/A"}
                                </Badge>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="w-4 h-4 mr-1" />
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
                                <Badge variant="outline" className="text-xs">
                                  Active
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => toggleContactVisibility(item.id)}
                                  aria-label={
                                    visibleContacts.has(item.id)
                                      ? "Hide contact details"
                                      : "Show contact details"
                                  }
                                >
                                  <Eye className="w-4 h-4" />
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}