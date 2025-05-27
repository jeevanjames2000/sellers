"use client";
import React from "react";

const Backdrop = ({ isOpen, toggleSidebar }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
      onClick={toggleSidebar}
    />
  );
};

export default Backdrop;