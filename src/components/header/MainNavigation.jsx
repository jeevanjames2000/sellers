"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LoadingOverlay from "../shared/LoadingOverlay";

const Mainnavigation = ({ toggleSidebar }) => {
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const [open, setOpen] = useState(false);

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

  // Handle mouse enter for "More" link and dropdown
  const handleMouseEnter = () => {
    setOpen(true);
  };

  // Handle mouse leave for the entire dropdown container
  const handleMouseLeave = () => {
    setOpen(false);
  };

  // Handle click for mobile/touch devices to toggle dropdown
  const handleToggleDropdown = (e) => {
    if (window.innerWidth < 768) {
      // Only toggle on mobile (md breakpoint)
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between px-5 md:px-0 gap-5 md:gap-10">
        <Link
          href="/"
          className={`font-semibold w-fit text-sm 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] text-[#1D3A76] ${
            isActive("/") ? "border-b-2 border-[#1D3A76]" : ""
          }`}
          prefetch={true}
          onClick={toggleSidebar}
        >
          Dashboard
        </Link>
        <Link
          href="/enquiry"
          className={`font-semibold w-fit text-sm 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] text-[#1D3A76] ${
            isActive("/enquiry") ? "border-b-2 border-[#1D3A76]" : ""
          }`}
          onClick={toggleSidebar}
        >
          Enquires
        </Link>
        <Link
          href="/listings"
          className={`font-semibold w-fit text-sm 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] text-[#1D3A76] ${
            isActive("/listings") ? "border-b-2 border-[#1D3A76]" : ""
          }`}
          prefetch={true}
          onClick={toggleSidebar}
        >
          Listings
        </Link>
        <Link
          href="/packages"
          className={`font-semibold w-fit text-sm 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] text-[#1D3A76] ${
            isActive("/packages") ? "border-b-2 border-[#1D3A76]" : ""
          }`}
          prefetch={true}
          onClick={toggleSidebar}
        >
          Packages
        </Link>
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href="#"
            className="font-semibold text-sm 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] text-[#1D3A76] w-fit px-5"
            onClick={handleToggleDropdown}
          >
            More
          </Link>
          {open && (
            <div
              className="absolute top-full left-0 mt-2 w-[170px] bg-[#F2F2F2] p-4 flex flex-col gap-3 rounded-md shadow-lg z-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/profile" onClick={toggleSidebar}>
                <p className="text-[12px] 2xl:text-[16px] 3xl:text-[18px] 4xl:text-[20px] text-[#909090] font-semibold hover:text-[#1D3A76]">
                  My Profile
                </p>
              </Link>
              <Link href="/invoice" onClick={toggleSidebar}>
                <p className="text-[12px] 2xl:text-[16px] 3xl:text-[18px] 4xl:text-[20px] text-[#909090] font-semibold hover:text-[#1D3A76]">
                  Invoice
                </p>
              </Link>
              <Link href="https://meetowner.in/" target="_blank" onClick={toggleSidebar}>
                <p className="text-[12px] 2xl:text-[16px] 3xl:text-[18px] 4xl:text-[20px] text-[#909090] font-semibold hover:text-[#1D3A76]">
                  Go to MeetOwner.in
                </p>
              </Link>
              <div>
                <div className="border-t-[1px] border-gray-300 my-2"></div>
                <div onClick={handleLogout} className="cursor-pointer">
                  <p className="text-[12px] 2xl:text-[16px] 3xl:text-[18px] 4xl:text-[20px] text-[#D23F4F] font-semibold text-center hover:text-[#B0303F]">
                    Logout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <LoadingOverlay isLoading={isLoadingEffect} />
    </>
  );
};

export default Mainnavigation;