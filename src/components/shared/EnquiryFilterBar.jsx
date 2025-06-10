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
    <div className={`flex flex-col sm:flex-row gap-3 py-2 w-full ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {showDateFilters && (
          <>
            <DatePicker
              id="startDate"
              placeholder="Select start date"
              onChange={handleStartDateChange}
              defaultDate={startDate ? new Date(startDate) : undefined}
            />
            <DatePicker
              id="endDate"
              placeholder="Select end date"
              onChange={handleEndDateChange}
              defaultDate={endDate ? new Date(endDate) : undefined}
            />
          </>
        )}
        {showStateFilter && (
          <div className="max-w-xs state_dropdown">
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
                className="block w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#1D3A76]"
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
          <div className="max-w-xs city_dropdown">
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
                className="block w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#1D3A76]"
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
        {(showDateFilters || showStateFilter || showCityFilter) && (
          <button
            variant="outline"
            onClick={handleClearFilters}
            className="px-3 py-1 w-full sm:w-auto border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default EnquiryFilterBar;