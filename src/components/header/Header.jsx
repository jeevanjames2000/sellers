"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MainNavigation from "./MainNavigation";
import { Home, Menu, X, Download, LogIn } from "lucide-react";
import logo from "../../../public/assets/logo.svg";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, clearLogin } from "@/store/slices/loginSlice";
import { QRCodeSVG } from "qrcode.react";
function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.login);
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const isLoggedIn = !!token;

  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=com.meetowner.app&pcampaignid=web_share";

  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    const storedUser = localStorage.getItem("userDetails");
    if (storedToken && storedUser && !token) {
      try {
        const userDetails = JSON.parse(storedUser);
        dispatch(setLogin({ user: userDetails, token: storedToken }));
      } catch (error) {
        console.error("Error parsing user details from localStorage:", error);
        localStorage.removeItem("userToken");
        localStorage.removeItem("userDetails");
        dispatch(clearLogin());
      }
    }
    router.prefetch("/addProperty");
    router.prefetch("/listings");
    router.prefetch("/enquiry");
  }, [router, dispatch, token]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddProperty = () => {
    if (!isLoggedIn) {
      router.push("/");
    } else {
      router.push("/addProperty");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMobileMenuOpen &&
        !e.target.closest("#mobile-sidebar") &&
        !e.target.closest("#mobile-menu-trigger")
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`h-16 lg:h-20 bg-white/95 backdrop-blur-md w-full transition-all duration-300 border-b border-gray-200/50 flex items-center justify-between px-4 lg:px-8 xl:px-12 sticky top-0 z-50 ${
        scrollY > 50 ? "shadow-lg bg-white/98" : "shadow-sm"
      }`}
    >
      <Link href="/dashboard">
        <Image
          src={logo}
          alt="Meetowner Logo"
          height={80}
          width={120}
          className="3xl:h-20 3xl:w-56 object-cover"
        />
      </Link>
      <div className="flex items-center space-x-3">
        {isLoggedIn ? (
          <>
            <div className="hidden lg:flex items-center space-x-8">
              <MainNavigation isLoggedIn={isLoggedIn} />
            </div>
            <Button
              onClick={handleAddProperty}
              className="bg-gradient-to-r from-[#1D3A76] to-[#1D3A76] hover:from-[#1D3A76] hover:to-[#1D3A76] text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              size="sm"
            >
              <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-semibold">
                Add Property
              </span>
              <span className="sm:hidden font-semibold">Add</span>
            </Button>

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
          </>
        ) : (
          <div className="flex items-center space-x-3">
            <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Download App
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-gray-200/50">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-[#1D3A76]">
                    Download Meetowner App
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 p-4">
                  <p className="text-gray-600 text-center">
                    Scan the QR code to download the Meetowner app from the
                    Google Play Store.
                  </p>
                  <div className="p-4 bg-white rounded-lg shadow-md">
                    <QRCodeSVG value={playStoreUrl} size={160} />
                  </div>
                  <Link
                    href={playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="bg-gradient-to-r from-[#1D3A76] to-[#1D3A76] hover:from-[#1D3A76] hover:to-[#1D3A76] text-white shadow-lg"
                      size="sm"
                    >
                      Open in Play Store
                    </Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>

            <div className="hidden md:block">
              {pathname !== "/addProperty" && (
                <Button
                  onClick={handleAddProperty}
                  className="bg-gradient-to-r from-[#1D3A76] to-[#1D3A76] hover:from-[#1D3A76] hover:to-[#1D3A76] text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  size="sm"
                >
                  <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline font-semibold">
                    Add Property
                  </span>
                  <span className="sm:hidden font-semibold">Add</span>
                </Button>
              )}
            </div>

            <div className="hidden md:block">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" />
          <div
            id="mobile-sidebar"
            className="fixed top-0 right-0 h-full w-80 sm:w-96 bg-white/98 backdrop-blur-md border-l border-gray-200/50 z-50 lg:hidden"
          >
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

            <div className="flex-1">
              <MainNavigation
                toggleSidebar={() => setIsMobileMenuOpen(false)}
                isMobile={true}
                isLoggedIn={isLoggedIn}
              />
              {!isLoggedIn && (
                <div className="p-3 space-y-2">
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push("/");
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                  <Dialog
                    open={isQRDialogOpen}
                    onOpenChange={setIsQRDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download App
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-gray-200/50">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-[#1D3A76]">
                          Download Meetowner App
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center gap-4 p-4">
                        <p className="text-gray-600 text-center">
                          Scan the QR code to download the Meetowner app from
                          the Google Play Store.
                        </p>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                          <QRCodeSVG value={playStoreUrl} size={160} />
                        </div>
                        <Link
                          href={playStoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            className="bg-gradient-to-r from-[#1D3A76] to-[#1D3A76] hover:from-[#1D3A76] hover:to-[#1D3A76] text-white shadow-lg"
                            size="sm"
                          >
                            Open in Play Store
                          </Button>
                        </Link>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
