"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Mainnavigation from "./MainNavigation";
import { Home, Menu, X, Plus } from "lucide-react";
import logo from "../../../public/assets/logo.svg";
import Image from "next/image";

function Header() {
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('#mobile-sidebar') && !event.target.closest('#mobile-menu-trigger')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`h-16 lg:h-20 bg-white/95 backdrop-blur-md w-full transition-all duration-300 border-b border-gray-200/50 flex items-center justify-between px-4 lg:px-8 xl:px-12 sticky top-0 z-50 ${
        scrollY > 50 ? "shadow-lg bg-white/98" : "shadow-sm"
      }`}
    >
      {/* Logo Section */}
      <Link href="/">
        <Image
          src={logo}
          alt="Meetowner Logo"
          height={80}
          width={120}
          className="3xl:h-20 3xl:w-56 object-cover"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-8">
        <Mainnavigation />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* Add Property Button */}
        {pathname !== "/addProperty" && (
          <Link href="/addProperty">
            <Button 
              className="bg-gradient-to-r from-[#1D3A76] to-[#1D3A76] hover:from-[#1D3A76] hover:to-[#1D3A76] text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-semibold">Add Property</span>
              <span className="sm:hidden font-semibold">Add</span>
            </Button>
          </Link>
        )}

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
          <Button 
            id="mobile-menu-trigger"
            variant="outline" 
            size="sm"
            className="w-10 h-10 p-0 border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
            onClick={toggleMobileMenu}
          >
            <Menu className="w-5 h-5 text-[#1D3A76]" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" />
      )}

      {/* Custom Mobile Sidebar */}
      <div
        id="mobile-sidebar"
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white/98 backdrop-blur-md border-l border-gray-200/50 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#1D3A76] to-[#1D3A76] rounded-xl flex items-center justify-center shadow-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
                  MEET OWNER
                </h1>
              </div>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-8 h-8 p-0 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 ">
          <Mainnavigation toggleSidebar={() => setIsMobileMenuOpen(false)} isMobile={true} />
        </div>

        {/* Mobile Menu Footer */}
      
      </div>
    </header>
  );
}

export default Header;