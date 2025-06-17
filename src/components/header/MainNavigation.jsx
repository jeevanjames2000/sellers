"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
} from "lucide-react";
import LoadingOverlay from "../shared/LoadingOverlay";
import { useDispatch } from "react-redux";
import { clearLogin } from "@/store/slices/loginSlice";
import { clearSignup } from "@/store/slices/signupSlice";

const MainNavigation = React.memo(({ toggleSidebar, isMobile = false }) => {
  const dispatch = useDispatch();
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const prefetchDone = useRef(false);

  const isActive = useCallback((path) => pathname === path, [pathname]);

  const navigationItems = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/enquiry", label: "Enquiries", icon: MessageSquare },
      { href: "/listings", label: "Listings", icon: Building },
      { href: "/packages", label: "Packages", icon: Package },
    ],
    []
  );

  const accountItems = useMemo(
    () => [
      { href: "/profile", label: "My Profile", icon: User },
      { href: "/invoice", label: "Invoice", icon: FileText },
    ],
    []
  );

  const moreMenuItems = useMemo(
    () => [
      { href: "/profile", label: "My Profile", icon: User },
      { href: "/invoice", label: "Invoice", icon: FileText },
      {
        href: "https://meetowner.in/",
        label: "Go to MeetOwner.in",
        icon: ExternalLink,
        external: true,
      },
    ],
    []
  );

  // Prefetch routes when on /dashboard
  useEffect(() => {
    if (pathname === "/dashboard" && !prefetchDone.current) {
      const routesToPrefetch = ["/packages", "/profile", "/invoice"];
      routesToPrefetch.forEach((route) => {
        router.prefetch(route); // Use Next.js prefetch
      });
      prefetchDone.current = true;
    }
  }, [pathname, router]);

  // Handle navigation (no caching needed)
  const handleNavigation = useCallback(
    (route, external = false) => {
      if (!external && toggleSidebar) {
        toggleSidebar();
      }
    },
    [toggleSidebar]
  );

  // Handle logout
  const handleLogout = useCallback(() => {
    setIsLoadingEffect(true);
    try {
      dispatch(clearLogin());
      dispatch(clearSignup());
      localStorage.removeItem("userToken");
      localStorage.removeItem("userDetails");
      router.replace("/loginotp");
    } finally {
      if (isMobile && toggleSidebar) toggleSidebar();
      setIsLoadingEffect(false);
    }
  }, [dispatch, router, isMobile, toggleSidebar]);

  // Toggle more menu
  const toggleMoreMenu = useCallback(() => {
    setIsMoreMenuOpen((prev) => !prev);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 py-4 px-2">
          <div className="space-y-1 mb-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className="block rounded-lg transition-all duration-200 cursor-pointer"
                  prefetch={true}
                >
                  <div
                    className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
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
            <h2 className="text-xs font-medium cursor-pointer text-gray-500 uppercase tracking-wider px-3 mb-2">
              Account
            </h2>
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className="block rounded-lg transition-all duration-200"
                  prefetch={true}
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
    <nav className="flex items-center space-x-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => handleNavigation(item.href)}
            className="relative group cursor-pointer"
            prefetch={true}
          >
            <Button
              variant={isActive(item.href) ? "default" : "ghost"}
              className={`flex items-center space-x-2 transition-all cursor-pointer duration-200 ${
                isActive(item.href)
                  ? "bg-gradient-to-r from-[#1D3A76] to-[#1D3A76] text-white shadow-lg hover:from-[#1D3A76] hover:to-[#1D3A76]"
                  : "text-gray-700 hover:text-[#1D3A76] hover:bg-blue-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </Button>
            {isActive(item.href) && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#1D3A76] rounded-lg"></div>
            )}
          </Link>
        );
      })}
      <div className="relative inline-block">
        <Button
          variant="ghost"
          className="flex items-center space-x-1 text-gray-700 cursor-pointer hover:text-[#1D3A76] hover:bg-blue-50 transition-all duration-200 min-w-[70px]"
          onClick={toggleMoreMenu}
        >
          <span className="font-medium">More</span>
          <ChevronDown
            className={`w-3 h-3 opacity-60 transition-transform duration-200 ease-in-out ${
              isMoreMenuOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </Button>
        {isMoreMenuOpen && (
          <div
            className="fixed inset-0 z-[9999]"
            onClick={() => setIsMoreMenuOpen(false)}
          >
            <div
              className="absolute top-full right-0 mt-2 w-56 bg-white/98 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-lg overflow-hidden animate-in slide-in-from-top-2 fade-in-0 duration-200"
              style={{ top: "calc(100% + 8px)", right: "0px" }}
              onClick={(e) => e.stopPropagation()}
            >
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
                      className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors cursor-pointer group"
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        handleNavigation(item.href, item.external);
                      }}
                      prefetch={!item.external}
                    >
                      <Icon className="w-4 h-4 text-gray-500 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
                      <span className="font-medium text-gray-700 group-hover:text-gray-900">
                        {item.label}
                      </span>
                      {item.external && (
                        <ExternalLink className="w-3 h-3 ml-auto text-gray-400 flex-shrink-0 group-hover:text-blue-500" />
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
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer transition-colors group"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0 group-hover:text-red-700" />
                  <span className="font-medium group-hover:text-red-700">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <LoadingOverlay isLoading={isLoadingEffect} />
    </nav>
  );
});

MainNavigation.displayName = "MainNavigation";

export default MainNavigation;
