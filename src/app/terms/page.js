"use client";
import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; 


const TermsAndConditions = () => {
  const [terms, setTerms] = useState({ description: "" });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        const response = await fetch(`https://api.meetowner.in/api/v1/terms`);
        const data = await response.json();
        setTerms(data[0] || { description: "" });
      } catch (err) {
        console.error("Failed to fetch terms and conditions:", err);
      }
    };
    fetchTermsAndConditions();
  }, []);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      
      <div className="min-h-screen flex items-center justify-center relative">
        <div
          className="terms-container text-left flex flex-col justify-center my-10 w-[70%]"
          dangerouslySetInnerHTML={{ __html: terms.description }}
        />
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

    
    </>
  );
};

export default TermsAndConditions;