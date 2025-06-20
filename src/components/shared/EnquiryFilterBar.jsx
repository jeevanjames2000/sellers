import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCities, fetchAllStates } from "../../store/slices/places";
import DatePicker from "../ui/date-picker";

const EnquiryFilterBar = ({
  showDateFilters = false,
  showStateFilter = false,
  showCityFilter = false,
  onStartDateChange,
  onEndDateChange,
  onStateChange,
  onCityChange,
  onClearFilters,
  startDate,
  endDate,
  stateValue = "",
  cityValue = "",
  className = "",
}) => {
  const dispatch = useDispatch();
  const { states, statesLoading, statesError, cities, citiesLoading, citiesError } =
    useSelector((state) => state.places);

  const [stateSearchTerm, setStateSearchTerm] = useState(stateValue);
  const [citySearchTerm, setCitySearchTerm] = useState(cityValue);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  // Fetch states on mount if state or city filter is enabled
  useEffect(() => {
    if (showStateFilter || showCityFilter) {
      dispatch(fetchAllStates());
    }
  }, [dispatch, showStateFilter, showCityFilter]);

  // Fetch cities when state changes
  useEffect(() => {
    if (showCityFilter && stateSearchTerm) {
      dispatch(fetchAllCities({ state: stateSearchTerm }));
    } else if (showCityFilter) {
      dispatch(fetchAllCities());
    }
  }, [dispatch, stateSearchTerm, showCityFilter]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutsideDropdowns = (event) => {
      const target = event.target;
      if (!target.closest(".state_dropdown")) {
        setIsStateDropdownOpen(false);
      }
      if (!target.closest(".city_dropdown")) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDropdowns);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdowns);
    };
  }, []);

  // Filtered states and cities
  const filteredStates = useMemo(
    () =>
      states
        .map((state) => state.name)
        .filter((name) => name.toLowerCase().includes(stateSearchTerm.toLowerCase())),
    [stateSearchTerm, states]
  );

  const filteredCities = useMemo(
    () =>
      cities
        .filter(
          (city) =>
            (!stateSearchTerm || city.state === stateSearchTerm) &&
            city.name.toLowerCase().includes(citySearchTerm.toLowerCase())
        )
        .map((city) => city.name),
    [citySearchTerm, cities, stateSearchTerm]
  );

  const handleStartDateChange = (selectedDates) => {
    const dateObj = selectedDates[0];
    let date = "";
    if (dateObj) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      date = `${year}-${month}-${day}`;
    }
    onStartDateChange?.(date || null);
  };

  const handleEndDateChange = (selectedDates) => {
    const dateObj = selectedDates[0];
    let date = "";
    if (dateObj) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      date = `${year}-${month}-${day}`;
      if (startDate && date < startDate) {
        alert("End date cannot be before start date");
        return;
      }
    }
    onEndDateChange?.(date || null);
  };

  const handleClearFilters = () => {
    setStateSearchTerm("");
    setCitySearchTerm("");
    setIsStateDropdownOpen(false);
    setIsCityDropdownOpen(false);
    onClearFilters?.();
  };

  return (
    <div className={`flex flex-col gap-3 py-2 w-full ${className}`}>
      {/* Main filters container */}
      <div className="flex flex-col lg:flex-row gap-3 w-full">
        {/* Date filters - stack on mobile/tablet, row on large screens */}
        {showDateFilters && (
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="w-full sm:w-auto sm:min-w-[180px] lg:min-w-[200px]">
              <DatePicker
                id="startDate"
                placeholder="Select start date"
                onChange={handleStartDateChange}
                defaultDate={startDate ? new Date(startDate) : undefined}
              />
            </div>
            <div className="w-full sm:w-auto sm:min-w-[180px] lg:min-w-[200px]">
              <DatePicker
                id="endDate"
                placeholder="Select end date"
                onChange={handleEndDateChange}
                defaultDate={endDate ? new Date(endDate) : undefined}
              />
            </div>
          </div>
        )}

        {/* Location filters - stack on mobile/tablet */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {showStateFilter && (
            <div className="w-full sm:w-auto sm:min-w-[180px] lg:min-w-[200px] state_dropdown">
              <div className="relative">
                <input
                  id="state-search"
                  type="text"
                  name="state"
                  value={stateSearchTerm}
                  onChange={(e) => {
                    setStateSearchTerm(e.target.value);
                    setIsStateDropdownOpen(true);
                    setCitySearchTerm("");
                    onStateChange?.(e.target.value);
                  }}
                  onClick={() => setIsStateDropdownOpen(true)}
                  onFocus={() => setIsStateDropdownOpen(true)}
                  placeholder="Search for a state..."
                  className="block w-full h-10 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#1D3A76] text-sm"
                  disabled={statesLoading}
                />
                <button
                  type="button"
                  onClick={() => setIsStateDropdownOpen((prev) => !prev)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  disabled={statesLoading}
                >
                  <svg
                    className={`w-4 h-4 transform ${isStateDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isStateDropdownOpen && filteredStates.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                    {filteredStates.map((state) => (
                      <li
                        key={state}
                        onClick={() => {
                          setStateSearchTerm(state);
                          setCitySearchTerm("");
                          setIsStateDropdownOpen(false);
                          onStateChange?.(state);
                        }}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        {state}
                      </li>
                    ))}
                  </ul>
                )}
                {statesError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{statesError}</p>
                )}
              </div>
            </div>
          )}

          {showCityFilter && (
            <div className="w-full sm:w-auto sm:min-w-[180px] lg:min-w-[200px] city_dropdown">
              <div className="relative">
                <input
                  id="city-search"
                  type="text"
                  name="city"
                  value={citySearchTerm}
                  onChange={(e) => {
                    setCitySearchTerm(e.target.value);
                    setIsCityDropdownOpen(true);
                    onCityChange?.(e.target.value);
                  }}
                  onClick={() => setIsCityDropdownOpen(true)}
                  onFocus={() => setIsCityDropdownOpen(true)}
                  placeholder="Search for a city..."
                  className="block w-full h-10 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#1D3A76] text-sm"
                  disabled={citiesLoading}
                />
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen((prev) => !prev)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  disabled={citiesLoading}
                >
                  <svg
                    className={`w-4 h-4 transform ${isCityDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCityDropdownOpen && filteredCities.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                    {filteredCities.map((city) => (
                      <li
                        key={city}
                        onClick={() => {
                          setCitySearchTerm(city);
                          setIsCityDropdownOpen(false);
                          onCityChange?.(city);
                        }}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
                {citiesError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{citiesError}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Clear button - always full width on mobile, auto width on larger screens */}
        {(showDateFilters || showStateFilter || showCityFilter) && (
          <div className="w-full sm:w-auto lg:flex lg:items-start lg:pt-0">
            <button
              onClick={handleClearFilters}
              className="w-full sm:w-auto px-4 py-2 h-10 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryFilterBar;