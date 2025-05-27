
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const PlanFinder = () => {
  return (
    <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-0 mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white rounded-lg p-3 shadow-sm">
              <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 rounded-md flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-orange-500 text-xs font-bold">?</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Not sure which Package is best for you?
              </h3>
              <p className="text-gray-600 text-sm">
                Let us help you out with our interactive plan finder
              </p>
            </div>
          </div>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg shadow-sm">
            Find plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanFinder;
