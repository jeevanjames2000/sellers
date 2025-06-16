"use client";
import { useFormContext } from "react-hook-form";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  setCity,
  setLocality,
  setState,
} from "@/store/slices/addPropertySlice/addressSlice";

export default function Address({ property }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const dispatch = useDispatch();
  const {
    state: selectedState,
    city: selectedCity,
    locality: selectedLocality,
  } = useSelector((store) => store.address);
  const locality = watch("locality");
  const totalFloors = watch("total_floors");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localitySuggestions, setLocalitySuggestions] = useState([]);
  const [localityInput, setLocalityInput] = useState("");
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [openLocality, setOpenLocality] = useState(false);

  const fetchStates = useCallback(async () => {
    try {
      const res = await fetch("https://api.meetowner.in/api/v1/getAllStates");
      const data = await res.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  }, []);

  const fetchCities = useCallback(async (state = null) => {
    try {
      const url = state
        ? `https://api.meetowner.in/api/v1/getAllCities?state=${encodeURIComponent(
            state
          )}`
        : `https://api.meetowner.in/api/v1/getAllCities`;
      const res = await fetch(url);
      const data = await res.json();
      const activeCities = data
        .filter((city) => city.status === "active")
        .reduce((acc, city) => {
          if (!acc.find((c) => c.city === city.city)) {
            acc.push(city);
          }
          return acc;
        }, []);
      setCities(activeCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    }
  }, []);

  const fetchLocalities = useCallback(
    async (city, query) => {
      if (!city || !query) {
        setLocalitySuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://api.meetowner.in/api/v1/search?city=${encodeURIComponent(
            city
          )}&query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        // Ensure property?.location_id is included if not in API response
        const suggestions = data || [];
        if (
          property?.location_id &&
          !suggestions.find((item) => item.locality === property.location_id)
        ) {
          suggestions.unshift({ locality: property.location_id });
        }
        setLocalitySuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching localities:", error);
        setLocalitySuggestions([]);
      }
    },
    [property?.location_id]
  );

  // Initialize form and state with property data
  useEffect(() => {
    fetchStates();

    // Set state
    if (property?.state_id) {
      dispatch(setState(property.state_id));
      setValue("state_id", property.state_id, { shouldValidate: true });
    }

    // Set city and fetch cities
    if (property?.state_id || property?.city_id) {
      fetchCities(property?.state_id || selectedState);
    }

    // Set city
    if (property?.city_id) {
      dispatch(setCity(property.city_id));
      setValue("city_id", property.city_id, { shouldValidate: true });
    }

    // Set locality
    if (property?.location_id) {
      dispatch(setLocality(property.location_id));
      setValue("locality", property.location_id, { shouldValidate: true });
      setLocalityInput(property.location_id);
      if (property?.city_id) {
        fetchLocalities(property.city_id, property.location_id);
      }
    }

    // Set other fields
    setValue("property_name", property?.property_name || "", {
      shouldValidate: true,
    });
    setValue("floors", property?.floors || "", { shouldValidate: true });
    setValue("total_floors", property?.total_floors || "", {
      shouldValidate: true,
    });
    setValue("unit_flat_house_no", property?.unit_flat_house_no || "", {
      shouldValidate: true,
    });
  }, [
    property,
    dispatch,
    setValue,
    fetchStates,
    fetchCities,
    fetchLocalities,
    selectedState,
  ]);

  // Handle state changes
  useEffect(() => {
    if (selectedState) {
      setValue("state_id", selectedState, { shouldValidate: true });
      fetchCities(selectedState);
      if (selectedState !== property?.state_id) {
        dispatch(setCity(""));
        setValue("city_id", "", { shouldValidate: true });
        dispatch(setLocality(""));
        setValue("locality", "", { shouldValidate: true });
        setLocalityInput("");
        setLocalitySuggestions([]);
      }
    } else {
      fetchCities();
      dispatch(setCity(""));
      setValue("city_id", "", { shouldValidate: true });
      dispatch(setLocality(""));
      setValue("locality", "", { shouldValidate: true });
      setLocalityInput("");
    }
  }, [selectedState, setValue, fetchCities, dispatch, property?.state_id]);

  // Handle city changes
  useEffect(() => {
    if (selectedCity) {
      setValue("city_id", selectedCity, { shouldValidate: true });
      if (selectedCity !== property?.city_id) {
        dispatch(setLocality(""));
        setValue("locality", "", { shouldValidate: true });
        setLocalityInput("");
        setLocalitySuggestions([]);
      }
      if (localityInput || selectedLocality || property?.location_id) {
        fetchLocalities(
          selectedCity,
          localityInput || selectedLocality || property?.location_id || ""
        );
      }
    } else {
      setLocalitySuggestions([]);
      dispatch(setLocality(""));
      setValue("locality", "", { shouldValidate: true });
      setLocalityInput("");
    }
  }, [
    selectedCity,
    localityInput,
    selectedLocality,
    setValue,
    fetchLocalities,
    dispatch,
    property?.city_id,
    property?.location_id,
  ]);

  // Handle locality changes
  useEffect(() => {
    if (selectedLocality) {
      setValue("locality", selectedLocality, { shouldValidate: true });
      setLocalityInput(selectedLocality);
    }
  }, [selectedLocality, setValue]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>
          State <span className="text-red-500">*</span>
        </Label>
        <input
          type="hidden"
          {...register("state_id", {
            required: "Please select a state",
          })}
        />
        <Popover open={openState} onOpenChange={setOpenState}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openState}
              className="w-full justify-between"
            >
              {selectedState || "Select State"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 max-h-[50vh]" align="start">
            <Command>
              <CommandInput placeholder="Search states…" />
              <CommandEmpty>No state found.</CommandEmpty>
              <CommandList>
                {states.map((state) => (
                  <CommandItem
                    key={state.state}
                    value={state.state}
                    onSelect={() => {
                      dispatch(setState(state.state));
                      setOpenState(false);
                    }}
                  >
                    {state.state}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedState === state.state
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.state_id && (
          <p className="text-red-500 text-sm">{errors.state_id.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>
          City <span className="text-red-500">*</span>
        </Label>
        <input
          type="hidden"
          {...register("city_id", {
            required: "Please select a city",
          })}
        />
        <Popover open={openCity} onOpenChange={setOpenCity}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCity}
              className="w-full justify-between"
            >
              {selectedCity || "Select City"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 max-h-[50vh]" align="start">
            <Command>
              <CommandInput placeholder="Search cities…" />
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandList>
                {cities.map((city) => (
                  <CommandItem
                    key={city.city}
                    value={city.city}
                    onSelect={() => {
                      dispatch(setCity(city.city));
                      setOpenCity(false);
                    }}
                  >
                    {city.city}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedCity === city.city ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.city_id && (
          <p className="text-red-500 text-sm">{errors.city_id.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>
          Locality <span className="text-red-500">*</span>
        </Label>
        <input
          type="hidden"
          {...register("locality", {
            required: "Please select a locality",
          })}
        />
        <Popover open={openLocality} onOpenChange={setOpenLocality}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openLocality}
              className="w-full justify-between"
            >
              {localityInput ||
                selectedLocality ||
                locality ||
                "Select Locality"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 max-h-[50vh]" align="start">
            <Command>
              <CommandInput
                placeholder="Search localities"
                value={localityInput}
                onValueChange={(value) => {
                  setLocalityInput(value);
                  if (selectedCity) {
                    fetchLocalities(selectedCity, value);
                  }
                }}
              />
              <CommandEmpty>No locality found.</CommandEmpty>
              <CommandList>
                {localitySuggestions.map((item) => (
                  <CommandItem
                    key={item.locality}
                    value={item.locality}
                    onSelect={() => {
                      dispatch(setLocality(item.locality));
                      setOpenLocality(false);
                    }}
                  >
                    {item.locality}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedLocality === item.locality
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.locality && (
          <p className="text-red-500 text-sm">{errors.locality.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>
          Property/Project Name <span className="text-red-500">*</span>
        </Label>
        <Input
          {...register("property_name", {
            required: "Property name is required",
            minLength: {
              value: 2,
              message: "Property name must be at least 2 characters",
            },
          })}
          placeholder="Enter property/project name"
        />
        {errors.property_name && (
          <p className="text-red-500 text-sm">{errors.property_name.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Flat No. <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("unit_flat_house_no", {
              required: "Flat number is required",
              minLength: {
                value: 1,
                message: "Flat number must be at least 1 character",
              },
            })}
            placeholder="Enter flat number"
          />
          {errors.unit_flat_house_no && (
            <p className="text-red-500 text-sm">
              {errors.unit_flat_house_no.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>
            Floor No. <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            {...register("floors", {
              required: "Floor number is required",
              min: { value: 0, message: "Floor number cannot be negative" },
              max: { value: 100, message: "Floor number cannot exceed 100" },
              validate: (value) =>
                !totalFloors ||
                parseInt(value) <= parseInt(totalFloors) ||
                "Floor number cannot exceed total floors",
            })}
            placeholder="Enter floor number"
          />
          {errors.floors && (
            <p className="text-red-500 text-sm">{errors.floors.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label>
          Total Floors <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          {...register("total_floors", {
            required: "Total floors is required",
            min: { value: 1, message: "Total floors must be at least 1" },
            max: { value: 100, message: "Total floors cannot exceed 100" },
          })}
          placeholder="Enter total floors"
        />
        {errors.total_floors && (
          <p className="text-red-500 text-sm">{errors.total_floors.message}</p>
        )}
      </div>
    </div>
  );
}
