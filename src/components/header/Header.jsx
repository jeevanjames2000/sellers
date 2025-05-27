"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import logo from "../../../public/assets/logo.svg";
import addproperty from "../../../public/assets/addproperty.svg";
import downloadapp_svg from "../../../public/assets/downloadapp_svg.svg";
import login from "../../../public/assets/login.svg";
import { usePathname } from "next/navigation";
import Backdrop from "../shared/Backdrop";
import Mainnavigation from "./MainNavigation";
import { IoHomeOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";

function Header() {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const [scrollY, setScrollY] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`h-[65px] 3xl:h-[120px] bg-[#F2F2F2] w-full py-2 transition-all duration-1000 shadow-xl flex flex-row justify-between items-center px-4 md:px-[4vw] lg:px-[6vw] sticky top-0 z-50 ${
        scrollY > 120 ? "shadow-lg" : ""
      }`}
    >
      {/* Logo */}
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
      <div className="hidden md:flex items-center gap-4">
        <Mainnavigation />
        {pathname !== "/addproperty" && (
          <Link
            href="/addproperty"
            className="bg-[#1D3A76] flex flex-row items-center gap-2 p-2 rounded-md"
          >
            <IoHomeOutline size={25} color="white" />
            <button className="text-white text-[12px] md:text-sm 2xl:text-[18px] 3xl:text-[20px] 4xl:text-[22px] font-[700]">
              Add Property
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Actions */}
      <div className="flex md:hidden items-center gap-2">
        {pathname !== "/addproperty" && (
          <>
            <Link
              href="/addproperty"
              className="bg-[#1D3A76] flex flex-row items-center gap-2 p-2 rounded-md"
            >
              <IoHomeOutline size={25} color="white" />
              <button className="text-white text-[12px] font-[700] hidden xs:flex">
                Add Property
              </button>
            </Link>
          </>
        )}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-10 h-10 rounded-md bg-[#1D3A76] text-white"
          aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          {isSidebarOpen ? (
            <IoCloseOutline size={25} />
          ) : (
            <IoMenuOutline size={25} />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        id="sidebar"
        className={`fixed top-0 right-0 h-full w-[70%] z-[99999] bg-[#F2F2F2] md:hidden flex flex-col gap-4 transition-transform duration-300 ease-linear ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-row justify-between items-center p-4">
          <Link href="/" onClick={toggleSidebar}>
            <Image
              src={logo}
              alt="Meetowner Logo"
              height={60}
              width={90}
              className="object-cover"
            />
          </Link>
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-md hover:bg-gray-100"
            aria-label="Close Sidebar"
          >
            <IoCloseOutline size={25} color="#1D3A76" />
          </button>
        </div>
        <div className="px-5">
          <Mainnavigation toggleSidebar={toggleSidebar} />
        </div>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      <Backdrop isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Guest User Links */}
      {false && (
        <div className="flex flex-row justify-start items-center gap-4">
          <Link
            href="/downloadapp"
            className="flex flex-row items-center justify-start gap-2 3xl:gap-4"
          >
            <Image
              src={downloadapp_svg}
              alt="Download App"
              className="h-[16px] w-fit 3xl:h-9 3xl:w-fit object-cover"
            />
            <button className="text-[#1D3A76] hidden sm:flex text-[12px] md:text-[12px] lg:text-sm 2xl:text-[16px] 3xl:text-[32px] font-medium font-sans">
              Download App
            </button>
          </Link>
          <Link
            href="/addproperty"
            className="flex flex-row items-center justify-center gap-2 3xl:gap-4 p-2 rounded-md"
          >
            <IoHomeOutline size={25} color="#1D3A76" />
            <button className="text-[#1D3A76] hidden sm:flex text-[12px] md:text-[12px] lg:text-sm 2xl:text-[16px] 3xl:text-[32px] font-medium font-sans">
              Add Property
            </button>
          </Link>
          <Link
            href={pathname === "/signup" ? "/login" : "/signup"}
            className="bg-[#1D3A76] flex flex-row items-center py-1 md:py-2 lg:py-2 3xl:py-6 px-2 md:px-4 lg:px-4 3xl:px-8 rounded-md 3xl:rounded gap-2 3xl:gap-2"
          >
            <Image
              src={login}
              alt={pathname === "/signup" ? "Login" : "Signup"}
              className="h-[16px] w-fit 3xl:h-9 3xl:w-fit object-cover"
            />
            <button className="text-white text-[12px] md:text-[12px] lg:text-sm 2xl:text-[16px] 3xl:text-[32px] font-medium font-sans">
              {pathname === "/signup" ? "Login" : "Signup"}
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;