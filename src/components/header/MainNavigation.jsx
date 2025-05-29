"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  MessageSquare,
  Building,
  Package,
  MoreHorizontal,
  User,
  FileText,
  ExternalLink,
  LogOut,
  ChevronDown,
  CreditCard,
  Eye,
  HelpCircle,
} from "lucide-react";
import LoadingOverlay from "../shared/LoadingOverlay";

const Mainnavigation = ({ toggleSidebar, isMobile = false }) => {
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    setIsLoadingEffect(true);
    setTimeout(() => {
      setIsLoadingEffect(false);
      sessionStorage.clear();
      localStorage.clear();
      router.push("/");
      if (toggleSidebar) toggleSidebar();
    }, 2000);
  };

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/enquiry", label: "Enquiries", icon: MessageSquare,  },
    { href: "/listings", label: "Listings", icon: Building,  },
    { href: "/packages", label: "Packages", icon: Package },
  ];

  const accountItems = [
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/invoice", label: "Invoice", icon: FileText },
  ];

  const moreMenuItems = [
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/invoice", label: "Invoice", icon: FileText },
    {
      href: "https://meetowner.in/",
      label: "Go to MeetOwner.in",
      icon: ExternalLink,
      external: true,
    },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Scrollable Content */}
        <div className="flex-1  py-4 px-2">
          {/* Main Navigation */}
          <div className="space-y-1 mb-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleSidebar}
                  className="block rounded-lg transition-all duration-200"
                >
                  <div
                    className={`flex items-center px-4 py-3 rounded-lg ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive(item.href) ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span className="font-medium ml-3">{item.label}</span>
                    {isActive(item.href) && (
                      <Badge className="ml-auto bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Active
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

         
          <div className="space-y-1">
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">
              Account
            </h2>
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleSidebar}
                  className="block rounded-lg transition-all duration-200"
                >
                  <div
                    className={`flex items-center px-4 py-3 rounded-lg ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive(item.href) ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span className="font-medium ml-3">{item.label}</span>
                  </div>
                </Link>
              );
            })}

           
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium ml-3">Logout</span>
            </button>
          </div>
        </div>

       
       

        <LoadingOverlay isLoading={isLoadingEffect} />
      </div>
    );
  }

  return (
    <>
      <nav className="flex items-center space-x-1">
     
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative group">
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className={`flex items-center space-x-2 transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-[#1D3A76] to-[#1D3A76] text-white shadow-lg hover:from-[#1D3A76] hover:to-[#1D3A76]"
                    : "text-gray-700 hover:text-[#1D3A76] hover:bg-blue-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
                {item.count && (
                  <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                    {item.count}
                  </Badge>
                )}
              </Button>
              {isActive(item.href) && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#1D3A76] rounded-lg"></div>
              )}
            </Link>
          );
        })}

      
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center space-x-1 text-gray-700 hover:text-[#1D3A76] hover:bg-blue-50 transition-all duration-200"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
          >
            <span className="font-medium">More</span>
            <ChevronDown
              className={`w-3 h-3 opacity-60 transition-transform ${
                isMoreMenuOpen ? "rotate-180" : ""
              }`}
            />
          </Button>

    
          {isMoreMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white/98 backdrop-blur-md border border-gray-200/50 shadow-xl z-50 rounded-lg overflow-hidden">
              <div className="p-2">
                {moreMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        if (toggleSidebar) toggleSidebar();
                      }}
                    >
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-700">
                        {item.label}
                      </span>
                      {item.external && (
                        <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                      )}
                    </Link>
                  );
                })}
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

    
      {isMoreMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMoreMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Mainnavigation;
