'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, MapPin, Building, Award, Edit3, Camera } from 'lucide-react';
import EditProfilePopup from './EditProfilePopup';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile, setLoading, setError } from '@/store/slices/profileSlice';

const userTypeMap = {
  1: 'Admin',
  2: 'User',
  3: 'Builder',
  4: 'Agent',
  5: 'Owner',
  6: 'Channel Partner',
  7: 'Manager',
  8: 'Telecaller',
  9: 'Marketing Executive',
  10: 'Customer Support',
  11: 'Customer Service',
};

const ProfileScreen = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { profile, loading, error } = useSelector((state) => state.profile);
  const { user, token } = useSelector((state) => state.login);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedToken = localStorage.getItem('userToken');
      const storedUser = localStorage.getItem('userDetails');
      let userId;
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser); 
          userId = parsedUser.user_id;
          
        } catch (error) {
          console.error('Error parsing userDetails from localStorage:', error);
          userId = null; 
        }
      } else {
        console.log('No userDetails found in localStorage');
        userId = null; 
      }
      

      try {
        dispatch(setLoading());

        const response = await fetch(
          `https://api.meetowner.in/user/v1/getProfile?user_id=${userId}`,

        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }

        dispatch(setProfile(data));
      } catch (err) {
        dispatch(setError(err.message || 'An error occurred while fetching the profile'));
      }
    };

    fetchProfile();
  }, [dispatch, user, token, router]);

 
  const profileData = profile || {
    name: 'Guest',
    mobile: 'N/A',
    email: 'N/A',
    address: 'N/A',
    city: 'N/A',
    state: 'N/A',
    pincode: 'N/A',
    gst_number: 'N/A',
    rera_number: 'N/A',
    user_type: 0, 
    photo: null, 
  };

   const getUserTypeName = (userTypeId) => {
    return userTypeMap[userTypeId] || 'Unknown'; 
  };

  const baseURL = 'https://api.meetowner.in/';
  const profileImageURL = profileData.photo ? `${baseURL}${profileData.photo}` : null;

  const getProxiedImageUrl = (url) => {
  
      return `/api/imageProxy?url=${encodeURIComponent(url)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <p className="text-lg font-semibold text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <p className="text-lg font-semibold text-red-600">Error: {error}</p>
      </div>
    );
  }

  // Add a check for profileData being null before rendering
  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <p className="text-lg font-semibold text-gray-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="w-full max-w-[1920px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-[#1D3A76] bg-clip-text text-transparent">
                  Profile Management
                </h1>
                <p className="text-gray-600 mt-2">Manage your account information and settings</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-[#1D3A76] text-white text-center p-8">
                  <div className="relative inline-block">
                     <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border-4 border-white/30">
                      {profileImageURL ? (
                       <img
                            src={getProxiedImageUrl(profileImageURL)}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                      ) : null}
                      <User
                        className={`w-12 h-12 sm:w-16 sm:h-16 text-white ${profileImageURL ? 'hidden' : 'flex'}`}
                      />
                    </div>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white/20 hover:bg-white/30 border-2 border-white/50"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">{profileData.name}</CardTitle>
                  <Badge className="bg-white text-black mt-2">
                    <Award className="w-3 h-3 mr-1" />
                 {getUserTypeName(profileData.user_type)}
                  </Badge>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Phone className="w-5 h-5 text-[#1D3A76]" />
                      <span className="text-sm font-medium text-gray-700">{profileData.mobile}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Mail className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700 truncate">{profileData.email}</span>
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

            {/* Details Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
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
                      <label className="text-sm font-medium text-[#1D3A76]">Name</label>
                      <p className="text-lg font-semibold text-gray-900">{profileData.name}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-[#1D3A76]">Phone Number</label>
                      <p className="text-lg font-semibold text-gray-900">{profileData.mobile}</p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-medium text-[#1D3A76]">Email Address</label>
                      <p className="text-lg font-semibold text-gray-900">{profileData.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-medium text-emerald-600">Address</label>
                      <p className="text-lg font-semibold text-gray-900">{profileData.address}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-emerald-600">City</label>
                      <p className="text-lg font-semibold text-gray-900">{profileData.city}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-emerald-600">State</label>
                      <p className="text-lg font-semibold text-gray-900">{profileData.state}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-emerald-600">Pin Code</label>
                      <p className="text-lg font-semibold text-gray-900">{profileData.pincode}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-purple-600">GST Number</label>
                      <p className="text-lg font-semibold text-gray-900">{profileData.gst_number}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-purple-600">RERA Number</label>
                      <p className="text-lg font-semibold text-gray-900">{profileData.rera_number}</p>
                    </div>
                  </div>
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