"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Authuserverify({ children }) {
  const { token, user } = useSelector((state) => state.login); 
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    
    const checkHydration = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); 
      setIsHydrated(true);
    };
    checkHydration();
  }, []);

  useEffect(() => {
    if (isHydrated) {

      if (!token && !user) {
        window.location.href = "/login"; 
      } else {
        setIsLoading(false);
      }
    }
  }, [token, user, isHydrated]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
}

export default Authuserverify;