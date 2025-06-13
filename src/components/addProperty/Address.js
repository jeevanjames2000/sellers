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
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localityInput, setLocalityInput] = useState(
    property?.location_id || ""
  );
  const [localitySuggestions, setLocalitySuggestions] = useState([]);
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
  const fetchCities = useCallback(
    async (state) => {
      try {
        const res = await fetch(`https://api.meetowner.in/api/v1/getAllCities`);
        const data = await res.json();
        setCities(data);
        if (property?.city_id) {
          const matchedCity = data.find(
            (city) => city.city.toLowerCase() === property.city_id.toLowerCase()
          );
          if (matchedCity) {
            dispatch(setCity(matchedCity.city));
            setValue("city_id", matchedCity.city, { shouldValidate: true });
          }
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    },
    [property, dispatch, setValue]
  );
  const fetchLocalities = useCallback(async (city, query) => {
    if (!city) return;
    try {
      const res = await fetch(
        `https://api.meetowner.in/api/v1/search?city=${city}&query=${query}`
      );
      const data = await res.json();
      setLocalitySuggestions(data || []);
    } catch (error) {
      console.error("Error fetching localities:", error);
    }
  }, []);
  useEffect(() => {
    fetchStates();
    if (property?.state_id) {
      dispatch(setState(property.state_id));
      fetchCities(property.state_id);
    }
    if (property?.city_id) {
      dispatch(setCity(property.city_id));
      fetchLocalities(property.city_id, property?.location_id || "");
    }
    if (property?.location_id) {
      dispatch(setLocality(property.location_id));
      setValue("locality", property.location_id, { shouldValidate: true });
      setLocalityInput(property.location_id);
    }
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
  }, [property, dispatch, setValue, fetchStates, fetchCities, fetchLocalities]);
  useEffect(() => {
    if (selectedState) {
      setValue("state_id", selectedState, { shouldValidate: true });
      fetchCities(selectedState);
    }
  }, [selectedState, setValue, fetchCities]);
  useEffect(() => {
    if (selectedCity) {
      setValue("city_id", selectedCity, { shouldValidate: true });
      fetchLocalities(selectedCity, localityInput || selectedLocality || "");
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
  ]);
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
          {...register("state_id", { required: "State is required" })}
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
          <PopoverContent className="w-full p-0 max-h-50" align="start">
            <Command>
              <CommandInput placeholder="Search states…" />
              <CommandEmpty>No state found.</CommandEmpty>
              <CommandList>
                {states.map((state, id) => (
                  <CommandItem
                    key={id}
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
          {...register("city_id", { required: "City is required" })}
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
          <PopoverContent className="w-full p-0 max-h-50" align="start">
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
          {...register("locality", { required: "Locality is required" })}
        />
        <Popover open={openLocality} onOpenChange={setOpenLocality}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openLocality}
              className="w-full justify-between"
            >
              {selectedLocality || locality || "Select locality"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 max-h-50" align="start">
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
                {localitySuggestions.map((item, id) => (
                  <CommandItem
                    key={id}
                    value={item.locality}
                    onSelect={() => {
                      dispatch(setLocality(item.locality));
                      setLocalityInput(item.locality);
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
          })}
          placeholder="Search Projects"
        />
        {errors.property_name && (
          <p className="text-red-500 text-sm">{errors.property_name.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Flat No.{" "}
            <span
              className="text-red-
500"
            >
              *
            </span>
          </Label>
          <Input
            {...register("unit_flat_house_no", {
              required: "Flat number is required",
            })}
            placeholder="Flat No."
          />
          {errors.unit_flat_house && (
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
              max: {
                value: 100,
                message: "Floor number cannot exceed 100",
              },
            })}
            placeholder="Floor No."
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
            max: {
              value: 100,
              message: "Total floors cannot exceed 100",
            },
          })}
          placeholder="Total Floors"
        />
        {errors.total_floors && (
          <p className="text-red-500 text-sm">{errors.total_floors.message}</p>
        )}
      </div>
    </div>
  );
}
