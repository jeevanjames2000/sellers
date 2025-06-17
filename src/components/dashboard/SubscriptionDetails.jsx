"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Upload, Shield, Calculator } from "lucide-react";

const SubscriptionDetails = () => {
  const services = [
    {
      title: "Total Properties Uploaded",
      value: "150",
      city: "Hyderabad",
      icon: <Upload className="w-8 h-8 text-white" />,
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      title: "Subscription Details",
      start_date: "01-05-2025",
      end_date: "01-09-2025",
      icon: <Shield className="w-8 h-8 text-white" />,
      package_name: "Prime Plus",
      gradient: "bg-gradient-to-br from-green-500 to-teal-500",
    },
    {
      title: "Remaining Listings",
      value: "You can still upload 3 more listings in Hyderabad",
      city: "Upgrade your package to increase limits",
      icon: <Calculator className="w-8 h-8 text-white" />,
      gradient: "bg-gradient-to-br from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
      {services.map((service, index) => (
        <Card key={index} className="shadow-md border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{service.title}</CardTitle>
              <CardDescription>
                {service.package_name && (
                  <span className="capitalize text-sm text-gray-600">
                    Package: {service.package_name}
                  </span>
                )}
                {service.start_date && service.end_date && (
                  <div className="text-sm text-muted-foreground">
                    {service.start_date} - {service.end_date}
                  </div>
                )}
              </CardDescription>
            </div>
            <div
              className={`p-2 rounded-md text-white ${
                service.gradient || "bg-gray-400"
              }`}
            >
              {service.icon}
            </div>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            {service.value && <p>{service.value}</p>}
            {service.city && (
              <p className="text-muted-foreground">{service.city}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionDetails;
