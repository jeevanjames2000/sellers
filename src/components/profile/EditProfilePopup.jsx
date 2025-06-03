'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, User, Phone, Mail, MapPin, Building, CreditCard } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileStart, updateProfileSuccess, updateProfileFailure } from '@/store/slices/profileSlice';

const EditProfilePopup = ({ isOpen, onClose, profileData }) => {
  const dispatch = useDispatch();
  const { updateLoading, updateError, updateMessage } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    name: profileData.name || '',
    mobile: profileData.mobile || profileData.phoneNumber || '',
    email: profileData.email || '',
    address: profileData.address || '',
    city: profileData.city || '',
    state: profileData.state || '',
    pincode: profileData.pincode || profileData.pinCode || '',
    gst_number: profileData.gst_number || profileData.gstNumber || '',
    rera_number: profileData.rera_number || profileData.reraNumber || '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve userId and token from localStorage
    const storedUser = localStorage.getItem('userDetails');
    const storedToken = localStorage.getItem('userToken');
    let userId;

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser.user_id;
      } catch (error) {
        console.error('Error parsing userDetails from localStorage:', error);
        dispatch(updateProfileFailure('Failed to retrieve user ID.'));
        return;
      }
    } else {
      dispatch(updateProfileFailure('User details not found in localStorage.'));
      return;
    }

    if (!storedToken) {
      dispatch(updateProfileFailure('Authentication token not found.'));
      return;
    }

    const payload = {
      id: userId, // Required by the API
      ...formData,
    };

    try {
      dispatch(updateProfileStart());

      const response = await fetch('https://api.meetowner.in/user/v1/updateUser', {
        method: 'POST', // Assuming POST method for update; change to PUT if required
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Dispatch success action with the API response and updated data
      dispatch(updateProfileSuccess({ message: data.message, updatedData: formData }));
      onClose(); // Close the popup on success
    } catch (err) {
      dispatch(updateProfileFailure(err.message || 'An error occurred while updating the profile'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-gradient-to-r from-[#1D37A6] to-blue-700 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center">
              <User className="w-5 h-5 mr-2" />
              Update Profile
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2"
              disabled={updateLoading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Display success message */}
        {updateMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
            {updateMessage}
          </div>
        )}

        {/* Display error message */}
        {updateError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
            {updateError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-emerald-900">Address Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter complete address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                  City *
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                  State *
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter state"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                  Pin Code *
                </Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter pin code"
                  maxLength="6"
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-purple-200">
              <Building className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-900">Business Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gst_number" className="text-sm font-medium text-gray-700">
                  GST Number
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="gst_number"
                    value={formData.gst_number}
                    onChange={(e) => handleInputChange('gst_number', e.target.value)}
                    className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter GST number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rera_number" className="text-sm font-medium text-gray-700">
                  RERA Number
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="rera_number"
                    value={formData.rera_number}
                    onChange={(e) => handleInputChange('rera_number', e.target.value)}
                    className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter RERA number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={updateLoading}
              className="flex-1 bg-[#1D37A6] text-white font-medium py-3"
            >
              {updateLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateLoading}
              className="flex-1 border-gray-300 hover:bg-gray-50 py-3"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfilePopup;