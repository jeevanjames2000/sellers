import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';

const EnquirySidebar = ({ activeTab, onTabChange, enquiryCount, tenantCount }) => {
  return (
    <div className="space-y-6">
      {/* Navigation Card */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1D3A76]" />
            Enquiries Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button
            onClick={() => onTabChange('my-enquiries')}
            className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
              activeTab === 'my-enquiries'
                ? 'bg-gradient-to-r from-[#1D3A76] to-blue-600 text-white shadow-lg'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className={`w-5 h-5 ${
                  activeTab === 'my-enquiries' ? 'text-white' : 'text-blue-500'
                }`} />
                <span className="font-semibold text-sm">My Enquiries</span>
              </div>
              <Badge 
                variant="secondary" 
                className={`${
                  activeTab === 'my-enquiries' 
                    ? 'bg-white/20 text-white border-white/30' 
                    : 'bg-blue-100 text-blue-800'
                } font-bold px-3 py-1`}
              >
                {enquiryCount}
              </Badge>
            </div>
           
          </button>
          
          <button
            onClick={() => onTabChange('matching-tenants')}
            className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
              activeTab === 'matching-tenants'
                ? 'bg-gradient-to-r from-[#1D3A76] to-blue-600 text-white shadow-lg'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className={`w-5 h-5 ${
                  activeTab === 'matching-tenants' ? 'text-white' : 'text-green-500'
                }`} />
                <span className="font-semibold text-sm">Matching Tenants</span>
              </div>
              <Badge 
                variant="secondary" 
                className={`${
                  activeTab === 'matching-tenants' 
                    ? 'bg-white/20 text-white border-white/30' 
                    : 'bg-gray-100 text-gray-600'
                } font-bold px-3 py-1`}
              >
                {tenantCount}
              </Badge>
            </div>
           
          </button>
        
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1D3A76] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Total Enquiries</h3>
            <p className="text-3xl font-bold text-[#1D3A76] mb-2">{enquiryCount}</p>
            <p className="text-sm text-gray-600">
              This month's property enquiries
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card className="shadow-lg border-0 bg-white/90">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 border border-green-200">
            <div className="font-semibold text-green-800">Export Data</div>
            <div className="text-sm text-green-600">Download enquiry reports</div>
          </button>
          <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 border border-purple-200">
            <div className="font-semibold text-purple-800">Set Alerts</div>
            <div className="text-sm text-purple-600">Get notified of new enquiries</div>
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnquirySidebar;