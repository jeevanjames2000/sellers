'use client';

import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const ServiceCard = ({ title, description, buttonText, icon, gradient }) => {
  const router = useRouter();
   useEffect(() => {
      router.prefetch("/addProperty");
     
    }, []);
  const handleButtonClick = () => {
     router.push("/addProperty");
  };
  return (
    <Card className="h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0">
      <CardContent className="p-6">
        <div className="flex-col items-center justify-between mb-4">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${gradient} shadow-lg`}>
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
        <Button   onClick={handleButtonClick}
          variant="ghost" 
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-medium cursor-pointer"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;