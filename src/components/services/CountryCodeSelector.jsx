"use client";
import { useState, useMemo, useId } from "react";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import countries from "./countryCodes.json";
const CountryCodeSelector = ({ selectedCode, onSelect, setCountry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filteredCountries = useMemo(
    () =>
      countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dial_code.includes(search)
      ),
    [search]
  );
  const selectedCountry = countries.find((c) => c.dial_code === selectedCode);
  const flag = selectedCountry?.flag || "🇮🇳";
  const handleSelect = (item) => {
    onSelect(item.dial_code);
    setCountry(item.name);
    setIsOpen(false);
    setSearch("");
  };
  const popoverId = useId();
  return (
    <div className="relative inline-block z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen} id={popoverId}>
        <PopoverTrigger asChild>
          <div
            className="flex items-center p-1 cursor-pointer text-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            <span className="font-semibold text-black flex items-center">
              {flag} {selectedCode}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500 ml-1" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="absolute w-54 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto p-0"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <Input
            type="text"
            placeholder="Search country"
            className="w-full p-2 border-b border-gray-200 focus:outline-none focus:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="max-h-36   overflow-y-auto">
            {filteredCountries.map((item) => (
              <div
                key={item.code}
                className="p-2 text-left hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSelect(item)}
              >
                <span className="text-gray-800">
                  {item.flag} {item.name} ({item.dial_code})
                </span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default CountryCodeSelector;
