"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Award,
  Edit3,
  Camera,
  Briefcase,
  CheckCircle,
  BadgeCheck,
} from "lucide-react";
import EditProfilePopup from "./EditProfilePopup";
import { useDispatch, useSelector } from "react-redux";
import {
  setProfile,
  setLoading,
  setError,
  updateImageSuccess,
} from "@/store/slices/profileSlice";
import axios from "axios";
import config from "../api/config";
const userTypeMap = {
  1: "Admin",
  2: "User",
  3: "Builder",
  4: "Agent",
  5: "Owner",
  6: "Channel Partner",
  7: "Manager",
  8: "Telecaller",
  9: "Marketing Executive",
  10: "Customer Support",
  11: "Customer Service",
};
const ProfileScreen = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const fileInputRef = useRef(null);
  const isFetching = useRef(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { profile, loading, error } = useSelector((state) => state.profile);
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const fetchProfile = async () => {
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
      dispatch(setError("User ID not found. Please log in again."));
      return;
    }
    try {
      dispatch(setLoading());
      const response = await fetch(
        `https://api.meetowner.in/user/v1/getProfile?user_id=${userId}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }
      dispatch(setProfile(data));
    } catch (err) {
      dispatch(
        setError(err.message || "An error occurred while fetching the profile")
      );
    }
  };
  const fetchSubscriptionData = useCallback(async (userId, city) => {
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;
    try {
      setSubscriptionLoading(true);
      setSubscriptionError(null);
      if (!userId) {
        throw new Error(
          "User not logged in. Please log in to view subscription details."
        );
      }
      const response = await axios.get(
        `${config.api_url}/property/v1/getAllPropertiesUploaded`,
        {
          params: { user_id: userId, city },
        }
      );
      const apiData = response.data.data || {};
      setSubscriptionData({
        package_name: apiData.subscriptionPackage || "None",
        start_date: formatDate(apiData.subscription_start_date),
        end_date: formatDate(apiData.subscription_expiry_date),
        city: apiData.city || "N/A",
      });
    } catch (err) {
      console.error("Error fetching subscription data:", err);
      setSubscriptionError(err.message || "Failed to load subscription data");
      setSubscriptionData({
        package_name: "None",
        start_date: "N/A",
        end_date: "N/A",
        city: "N/A",
      });
    } finally {
      setSubscriptionLoading(false);
      isFetching.current = false;
    }
  }, []);
  useEffect(() => {
    fetchProfile();
    const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
    const userId = userDetails.user_id;
    const city = localStorage.getItem("City") || "Hyderabad";
    fetchSubscriptionData(userId, city);
  }, [fetchSubscriptionData]);
  const handleImageUpload = async (file) => {
    if (!file) {
      setUploadError("Please select a file to upload");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please upload a JPEG, JPG, or PNG image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }
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
    }
    if (!userId) {
      setUploadError("User ID not found. Please log in again.");
      return;
    }
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("photo", file);
    setUploading(true);
    setUploadError(null);
    setUploadMessage(null);
    try {
      const response = await fetch(
        "https://api.meetowner.in/user/v1/uploadUserImage",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image");
      }
      const cleanedUserId = data.user_id
        ? data.user_id.replace(/\n/g, "").trim()
        : userId;
      dispatch(
        updateImageSuccess({
          message: data.message,
          updatedData: {
            photo: data.photo,
            user_id: cleanedUserId,
          },
        })
      );
      setUploadMessage(data.message);
      await fetchProfile();
    } catch (err) {
      setUploadError(
        err.message || "An error occurred while uploading the image"
      );
    } finally {
      setUploading(false);
    }
  };
  const handleCameraClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };
  const profileData = profile || {
    name: "Guest",
    mobile: "N/A",
    email: "N/A",
    address: "N/A",
    city: "N/A",
    state: "N/A",
    pincode: "N/A",
    gst_number: "N/A",
    rera_number: "N/A",
    user_type: 0,
    photo: null,
  };
  const getUserTypeName = (userTypeId) => {
    return userTypeMap[userTypeId] || "Unknown";
  };
  const baseURL = "https://api.meetowner.in/";
  const profileImageURL = profileData.photo
    ? `${baseURL}${profileData.photo}`
    : null;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <p className="text-lg font-semibold text-gray-600">
          Loading profile...
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Error: {error}</p>
          <Button
            onClick={() => fetchProfile()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <p className="text-lg font-semibold text-gray-600">
          No profile data available.
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="w-full max-w-[1920px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
          {}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-[#1D3A76] bg-clip-text text-transparent">
                  Profile Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your account information and settings
                </p>
              </div>
              <Button
                onClick={() => setIsEditOpen(true)}
                className="bg-gradient-to-r bg-[#1D3A76] text-white shadow-lg"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </div>
          </div>
          {uploading && (
            <div className="mb-4 text-center">
              <p className="text-blue-600">Uploading image...</p>
            </div>
          )}
          {uploadError && (
            <div className="mb-4 text-center">
              <p className="text-red-600">{uploadError}</p>
              <Button
                onClick={() => fileInputRef.current.click()}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Retry Upload
              </Button>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-[#1D3A76] text-white text-center p-8">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border-4 border-white/30">
                      {profileImageURL ? (
                        <img
                          src={profileImageURL}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                          crossOrigin="anonymous"
                        />
                      ) : null}
                      <User
                        className={`w-12 h-12 sm:w-16 sm:h-16 text-white ${
                          profileImageURL ? "hidden" : "flex"
                        }`}
                      />
                    </div>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white/20 hover:bg-white/30 border-2 border-white/50"
                      onClick={handleCameraClick}
                      disabled={uploading}
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </Button>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <CardTitle className="text-xl font-semibold text-white flex justify-center items-center gap-2">
                    {profileData.name}
                  </CardTitle>
                  <div className="flex gap-2 justify-center">
                    <Badge className="bg-white text-green-600 mt-2 text-base flex items-center px-3 ">
                      <BadgeCheck className="!w-5 !h-5 shrink-0 mr-1" />
                      {profileData.verified === 1 ? "Verified" : "Not Verified"}
                    </Badge>
                    <Badge className="bg-white text-black mt-2 text-sm flex items-center px-3">
                      <Award className="!w-5 !h-5 mr-1" />
                      {getUserTypeName(profileData.user_type)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Phone className="w-5 h-5 text-[#1D3A76]" />
                      <span className="text-sm font-medium text-gray-700">
                        {profileData.mobile}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Mail className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {profileData.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-[#1D3A76]" />
                      <span className="text-sm font-medium text-gray-700">
                        {profileData.city}, {profileData.state}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-[#1D3A76]">
                        Name
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-[#1D3A76]">
                        Phone Number
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.mobile}
                      </p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-medium text-[#1D3A76]">
                        Email Address
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-emerald-600">
                        Address
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.address}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-emerald-600">
                        City
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.city}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-emerald-600">
                        State
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.state}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-emerald-600">
                        Pin Code
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.pincode}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-[#1D3A76] text-white p-6">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-purple-600">
                        GST Number
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.gst_number}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-purple-600">
                        RERA Number
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {profileData.rera_number}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-[#1D3A76] text-white p-6">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Subscription Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {subscriptionLoading ? (
                    <p className="text-gray-600">
                      Loading subscription details...
                    </p>
                  ) : subscriptionError ? (
                    <p className="text-red-600">Error: {subscriptionError}</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-violet-600">
                          Package Name
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {subscriptionData.package_name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-violet-600">
                          City
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {subscriptionData.city}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-violet-600">
                          Start Date
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {subscriptionData.start_date}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-violet-600">
                          End Date
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {subscriptionData.end_date}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <EditProfilePopup
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profileData={profileData}
      />
    </>
  );
};
export default ProfileScreen;
