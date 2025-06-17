"use client";

import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ServiceCard = ({
  title,
  description,
  buttonText,
  icon,
  gradient,
  numberOfListings,
  remainingListings,
  start_date,
  end_date,
  city,
  package_name,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (title === "Upload Property") {
      router.prefetch("/addProperty");
    } else if (title === "Verify Your Identity") {
      router.prefetch("/verify");
    } else if (title === "Subscription Status") {
      router.prefetch("/packages");
    }
  }, [router, title]);

  const handleButtonClick = () => {
    if (title === "Upload Property") {
      router.push("/addProperty");
    } else if (title === "Verify Your Identity") {
      router.push("/verify");
    } else if (title === "Subscription Status") {
      router.push("/packages");
    }
  };

  return (
    <Card className="h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0">
      <CardContent className="p-6">
        <div className="flex-col items-center justify-between mb-4">
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center ${gradient} shadow-lg`}
          >
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {title === "Total Properties Uploaded" ? (
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Uploaded:{" "}
            <span className="font-semibold">{numberOfListings || 0}</span>
            <br />
            Remaining:{" "}
            <span className="font-semibold">{remainingListings || 0}</span>
            <br />
            City: <span className="font-semibold">{city || "N/A"}</span>
          </p>
        ) : title === "Subscription Status" ? (
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Package:{" "}
            <span className="font-semibold">{package_name || "None"}</span>
            <br />
            Subscription ends on:{" "}
            <span className="font-semibold">{end_date || "N/A"}</span>
            <br />
            City: <span className="font-semibold">{city || "N/A"}</span>
          </p>
        ) : (
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {description}
          </p>
        )}
        {buttonText && (
          <Button
            onClick={handleButtonClick}
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-medium cursor-pointer"
          >
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
