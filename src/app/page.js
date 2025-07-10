"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import SignupPage from "./signup/Page";

export default function Home() {
  const { token, user } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const minLoaderDuration = 1500;
    const startTime = Date.now();
    const checkSession = async () => {
      if (!token && !user) {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
          } catch (error) {
            console.error("Failed to parse stored user:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        }
      }
      const elapsed = Date.now() - startTime;
      if (elapsed < minLoaderDuration) {
        await new Promise((resolve) =>
          setTimeout(resolve, minLoaderDuration - elapsed)
        );
      }
      setIsLoading(false);
    };
    checkSession();
  }, [dispatch, token, user]);
  useEffect(() => {
    if (pathname === "/" && token && user && !isLoading) {
      router.replace("/dashboard");
    }
  }, [token, user, pathname, router, isLoading]);

  if (token && user) {
    return null;
  }
  return (
    <div className="flex flex-col justify-center min-h-screen">
      <SignupPage />
    </div>
  );
}
