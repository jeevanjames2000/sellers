
import React from 'react';

import { FileText, Upload, Calculator, Shield } from 'lucide-react';
import ServiceCard from '../ui/servicesCard';

const ServicesGrid = () => {
  const services = [
   
    {
      title: "Upload Property",
      description: "100% complete listing with specific details about the rooms gets you more leads",
      buttonText: "Add property",
      icon: <Upload className="w-8 h-8 text-white" />,
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
   
    {
      title: "Verify Your Identity",
      description: "Complete verification with Aadhar eKYC!",
      buttonText: "Add property",
      icon: <Shield className="w-8 h-8 text-white" />,
      gradient: "bg-gradient-to-br from-green-500 to-teal-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
      {services.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </div>
  );
};

export default ServicesGrid;
