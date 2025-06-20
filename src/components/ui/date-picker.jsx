// DatePicker.jsx - Fixed Component
import { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Calendar } from "lucide-react";
import { Label } from "./label";

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
}) {
  const flatpickrRef = useRef(null);
  const inputRef = useRef(null);
  const initializedRef = useRef(false); // Track initialization state

  useEffect(() => {
    const initFlatpickr = () => {
      if (!inputRef.current || initializedRef.current) return;
      
      try {
        flatpickrRef.current = flatpickr(inputRef.current, {
          mode: mode || "single",
          static: false, // Always use absolute positioning
          monthSelectorType: "static",
          dateFormat: "Y-m-d",
          defaultDate,
          onChange,
          disableMobile: true, // Disable mobile native picker
          position: "auto", // Automatic positioning
          appendTo: document.body, // Append to body to avoid layout issues
          clickOpens: true,
          allowInput: true,
        });
        
        initializedRef.current = true;
      } catch (error) {
        console.error('Failed to initialize flatpickr:', error);
      }
    };

    // Initialize with a small delay to ensure DOM is ready
    const timer = setTimeout(initFlatpickr, 100);
    
    return () => {
      clearTimeout(timer);
      if (flatpickrRef.current) {
        try {
          flatpickrRef.current.destroy();
        } catch (error) {
          console.error('Error destroying flatpickr:', error);
        }
        flatpickrRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [mode, id, onChange]);

  // Handle defaultDate changes
  useEffect(() => {
    if (flatpickrRef.current && defaultDate) {
      try {
        flatpickrRef.current.setDate(defaultDate, false);
      } catch (error) {
        console.error('Error setting date:', error);
      }
    }
  }, [defaultDate]);

  return (
    <div className="w-full">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border appearance-none px-4 py-2 pr-10 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}