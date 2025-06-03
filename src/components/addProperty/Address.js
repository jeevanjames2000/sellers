"use client";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
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
  setAddress,
  setCity,
  setLocality,
  setState,
} from "@/store/slices/addPropertySlice/addressSlice";
export default function Address({ property }) {
  console.log("property: ", property);
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
  console.log("city: ", selectedCity);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localityInput, setLocalityInput] = useState("");
  const [localitySuggestions, setLocalitySuggestions] = useState([]);
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [openLocality, setOpenLocality] = useState(false);
  useEffect(() => {
    if (property) {
      setValue("property_name", property?.property_name);
      dispatch(setCity(property.city_id || null));
      dispatch(setLocality(property.google_address || ""));
    }
    fetchStates();
    fetchCities();
  }, []);

  const fetchStates = async () => {
    try {
      const res = await fetch("https://api.meetowner.in/api/v1/getAllStates");
      const data = await res.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };
  const fetchCities = async (state) => {
    try {
      const res = await fetch(`https://api.meetowner.in/api/v1/getAllCities`);
      const data = await res.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  const fetchLocalities = async (city, query) => {
    try {
      const res = await fetch(
        `https://api.meetowner.in/api/v1/search?city=${city}&query=${query}`
      );
      const data = await res.json();
      setLocalitySuggestions(data || []);
    } catch (error) {
      console.error("Error fetching localities:", error);
    }
  };
  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState);
      setValue("state", selectedState);
    }
  }, [selectedState]);
  useEffect(() => {
    if (selectedCity) {
      fetchLocalities(selectedCity, localityInput);
    } else {
      setLocalitySuggestions([]);
    }
    setValue("city", selectedCity);
  }, [localityInput, selectedCity]);
  useEffect(() => {
    setValue("locality", selectedLocality);
  }, [selectedLocality]);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>State</Label>
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
      </div>

      <div className="space-y-2">
        <Label>City</Label>
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
      </div>

      <div className="space-y-2">
        <Label>Locality</Label>
        <Popover open={openLocality} onOpenChange={setOpenLocality}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openLocality}
              className="w-full justify-between"
            >
              {selectedLocality || "Select locality"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 max-h-50" align="start">
            <Command>
              <CommandInput
                placeholder="Search localities"
                value={localityInput}
                onValueChange={setLocalityInput}
              />
              <CommandEmpty>No locality found.</CommandEmpty>
              <CommandList>
                {localitySuggestions.map((item, id) => (
                  <CommandItem
                    key={id}
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
        {errors.propertyName && (
          <p className="text-red-500 text-sm">{errors.propertyName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Flat No. <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register("flatNumber", {
              required: "Flat number is required",
            })}
            placeholder="Flat No."
          />
          {errors.flatNumber && (
            <p className="text-red-500 text-sm">{errors.flatNumber.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>
            Floor No. <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            {...register("floorNumber", {
              required: "Floor number is required",
              max: {
                value: 100,
                message: "Floor number cannot exceed 100",
              },
            })}
            placeholder="Floor No."
          />
          {errors.floorNumber && (
            <p className="text-red-500 text-sm">{errors.floorNumber.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Total Floors <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          {...register("totalFloors", {
            required: "Total floors is required",
            max: {
              value: 100,
              message: "Total floors cannot exceed 100",
            },
          })}
          placeholder="Total Floors"
        />
        {errors.totalFloors && (
          <p className="text-red-500 text-sm">{errors.totalFloors.message}</p>
        )}
      </div>
    </div>
  );
}
