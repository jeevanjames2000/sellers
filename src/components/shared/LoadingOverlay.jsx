import React from "react";

const LoadingOverlay = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="absolute inset-0 z-50 flex flex-col gap-2 items-center justify-center bg-[#e3e3e399] bg-opacity-50">
            <div className="w-12 h-12 border-[6px] border-t-transparent border-[#31539A] rounded-full animate-spin"></div>
            <p className="text-[#31539A] text-[14px] font-semibold ml-2">Loading...</p>
        </div>
    );
};

export default LoadingOverlay;
