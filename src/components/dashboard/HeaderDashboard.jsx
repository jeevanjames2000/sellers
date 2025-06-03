import React from 'react';
import { User, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeaderDashboard = () => {
    const storedUser = localStorage.getItem('userDetails');
     let username;
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser); 
          username = parsedUser.name;
          
        } catch (error) {
          console.error('Error parsing userDetails from localStorage:', error);
          username = null; 
        }
      } else {
        console.log('No userDetails found in localStorage');
        username = null; 
      }


  return (
    <>
      {/* Mobile View: Show only the name with blue background */}
      <div className=" block sm:hidden bg-[#1D3A76] text-white p-4 rounded-lg mb-4">
        <h1 className="text-lg font-semibold">Hello, {username}!</h1>
        
      </div>

      {/* Desktop View: Show the full header */}
      <header className="hidden sm:block bg-[#1D3A76] text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Hello, {username}!</h1>
              <p className="text-blue-100 text-sm">Welcome back to your dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderDashboard;