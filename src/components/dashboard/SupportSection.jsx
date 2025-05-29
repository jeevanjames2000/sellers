
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Phone, Mail } from 'lucide-react';

const SupportSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 py-6">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-lg text-gray-800">Have Questions?</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Explore our FAQ section for commonly asked questions
          </p>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg shadow-sm">
            Explore FAQ's
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 py-6">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-lg text-gray-800">Customer Support</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span className="text-sm">+91 9553919919</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="text-sm">meetowner.in@gmail.com</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportSection;
