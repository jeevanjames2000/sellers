"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Upload, Shield, Home, Briefcase } from "lucide-react";
import ServiceCard from "../ui/servicesCard";
import axios from "axios";
import config from "../api/config";

const ServicesGrid = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFetching = useRef(false); // Prevent concurrent API calls

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchData = useCallback(async (userId, city) => {
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;

    try {
      setIsLoading(true);
      setError(null);

      if (!userId) {
        throw new Error(
          "User not logged in. Please log in to view your services."
        );
      }

      const response = await axios.get(
        `${config.api_url}/property/v1/getAllPropertiesUploaded`,
        {
          params: { user_id: userId, city },
        }
      );

      const apiData = response.data.data || {};

      const servicesData = [
        {
          title: "Upload Property",
          description:
            "100% complete listing with specific details about the rooms gets you more leads",
          buttonText: "Add property",
          icon: <Upload className="w-8 h-8 text-white" />,
          gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
        },
        {
          title: "Verify Your Identity",
          description: "Complete verification with Aadhar eKYC!",
          buttonText: "Verify",
          icon: <Shield className="w-8 h-8 text-white" />,
          gradient: "bg-gradient-to-br from-green-500 to-teal-500",
        },
        {
          title: "Total Properties Uploaded",
          description: "",
          numberOfListings: apiData.uploadedCount || 0,
          remainingListings: apiData.remaining || 0,
          buttonText: "",
          city: apiData.city || "",
          icon: <Home className="w-8 h-8 text-white" />,
          gradient: "bg-blue-900",
        },
        {
          title: "Subscription Status",
          description: "",
          package_name: apiData.subscriptionPackage || "None",
          start_date: formatDate(apiData.subscription_start_date),
          end_date: formatDate(apiData.subscription_expiry_date),
          city: apiData.city || "",
          buttonText: "Upgrade Package",
          icon: <Briefcase className="w-8 h-8 text-white" />,
          gradient: "bg-gradient-to-br from-orange-500 to-red-100",
        },
      ];

      setServices(servicesData);
    } catch (err) {
      console.error("Error fetching services data:", err);
      setError(err.message || "Failed to load services data");
      setServices([
        {
          title: "Upload Property",
          description:
            "100% complete listing with specific details about the rooms gets you more leads",
          buttonText: "Add property",
          icon: <Upload className="w-8 h-8 text-white" />,
          gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
        },
        {
          title: "Verify Your Identity",
          description: "Complete verification with Aadhar eKYC!",
          buttonText: "Verify",
          icon: <Shield className="w-8 h-8 text-white" />,
          gradient: "bg-gradient-to-br from-green-500 to-teal-500",
        },
        {
          title: "Total Properties Uploaded",
          description: "",
          numberOfListings: 0,
          remainingListings: 0,
          buttonText: "",
          icon: <Home className="w-8 h-8 text-white" />,
          gradient: "bg-blue-900",
        },
        {
          title: "Subscription Status",
          description: "",
          package_name: "None",
          start_date: "N/A",
          city: "Hyderabad",
          end_date: "N/A",
          buttonText: "Upgrade Package",
          icon: <Briefcase className="w-8 h-8 text-white" />,
          gradient: "bg-gradient-to-br from-orange-500 to-red-100",
        },
      ]);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
    const userId = userDetails.user_id;
    const city = localStorage.getItem("City") || "Hyderabad";
    fetchData(userId, city);
  }, [fetchData]);

  if (isLoading) {
    return <div className="text-center p-6">Loading services...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
      {services.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </div>
  );
};

export default ServicesGrid;
