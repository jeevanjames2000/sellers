import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Building,
  Home,
  Building2,
  MapPin,
  Landmark,
  House,
  IndianRupee,
  Hotel,
  Store,
  Trees,
  Trash,
  CalendarIcon,
  MapPinHouse,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { formatCurrencyInWords } from "@/components/shared/formatCurrencyInWords";
import { useSelector } from "react-redux";
import config from "@/components/api/config";
export default function PropertyDetails({
  property,
  setProperty,
  unique_property_id,
  places,
  setPlaces,
  fac,
  setFac,
}) {
  console.log("places: ", places);
  const { register, watch, setValue, getValues } = useFormContext();
  const formValues = watch();
  const propertySubtype = watch("sub_type");
  const commercialSubType = watch("sub_type");
  const isRent = formValues?.property_for === "Rent";
  const isSell = formValues?.property_for === "Sell";
  const securityDeposit = watch("security_deposit");
  const lockinPeriod = watch("lock_in");
  const landSubType = watch("land_sub_type");
  const brokerage = watch("brokerage_charge");
  const propertyCost = watch("property_cost");
  const preferredTenantType = watch("types");
  const constructionStatus = watch("occupancy");
  const pentHouse = watch("pent_house");
  const loanFacility = watch("loan_facility");
  const investorProperty = watch("investor_property");
  const servantRoom = watch("servant_room");
  const facing = watch("facing");
  const carParking = watch("car_parking");
  const bikeParking = watch("bike_parking");
  const openParking = watch("open_parking");
  const bhk = watch("bedrooms");
  const bathroom = watch("bathroom");
  const balcony = watch("balconies");
  const furnishType = watch("furnished_status");
  const possessionStatus = watch("possession_status");
  const facilities = watch("facilities") || [];
  const areaUnit = watch("area_units");
  const nearbyPlace = watch("nearbyPlace");
  const distanceFromProperty = watch("distanceFromProperty");
  const reraApproved = watch("rera_approved");
  const ownership = watch("ownership_type");
  const [unit, setUnit] = useState("M");
  const propertyAge = watch("property_age");
  const [carCustomMode, setCarCustomMode] = useState(false);
  const [bikeCustomMode, setBikeCustomMode] = useState(false);
  const [openCustomMode, setOpenCustomMode] = useState(false);
  const [bathroomCustom, setBathroomCustom] = useState(false);
  const [balconyCustom, setBalconyCustom] = useState(false);
  const [bhkCustom, setBhkCustom] = useState(false);
  function formatDistance(meters) {
    if (meters < 1000) {
      return meters + "m";
    }
    const km = meters / 1000;
    return km % 1 === 0 ? km + "km" : km.toFixed(1) + "km";
  }
  const handleAdd = () => {
    const distNum = Number(distanceFromProperty);
    if (!nearbyPlace?.trim() || !distanceFromProperty || isNaN(distNum)) return;
    const distInMeters = unit === "km" ? distNum * 1000 : distNum;
    setPlaces((prev) => [
      ...prev,
      { place: nearbyPlace.trim(), distance: distInMeters },
    ]);
    setValue("nearbyPlace", "");
    setValue("distanceFromProperty", "");
  };
  const handleDelete = async (placeid) => {
    await deleteAroundProperty(placeid, property.unique_property_id);

    const updatedPlaces = places.filter((p) => p.place_id !== placeid);
    setPlaces(updatedPlaces);
  };

  const propertySubtypes = [
    { id: "Apartment", label: "Apartment", icon: Building },
    { id: "Independent House", label: "Independent House", icon: Home },
    { id: "Independent Villa", label: "Independent Villa", icon: Building2 },
    { id: "Plot", label: "Plot", icon: MapPin },
    { id: "Land", label: "Land", icon: Landmark },
  ];
  const commercialSubTypes = [
    { id: "Office", label: "Office", icon: Building },
    { id: "Retail Shop", label: "Retail Shop", icon: Home },
    { id: "Show Room", label: "Showroom", icon: Building2 },
    { id: "Plot", label: "Plot", icon: MapPin },
    { id: "Warehouse", label: "Warehouse", icon: Landmark },
    { id: "Others", label: "Others", icon: MapPinHouse },
  ];
  const landSubtypes = [
    { id: "Villa Development", label: "Villa Development", icon: House },
    {
      id: "Apartment Development",
      label: "Apartment development",
      icon: Hotel,
    },
    {
      id: "Commercial Development",
      label: "Commercial Development",
      icon: Store,
    },
    { id: "Out Rate Sale", label: "Out Rate Sale", icon: IndianRupee },
    { id: "Farm Land", label: "Farm Land", icon: Trees },
  ];
  const facilitiesOptions = [
    "Lift",
    "CCTV",
    "Gym",
    "Garden",
    "Club House",
    "Sports",
    "Swimming Pool",
    "Intercom",
    "Power Backup",
    "Gated Community",
    "Regular Water",
    "Community Hall",
    "Pet Allowed",
    "Entry / Exit",
    "Outdoor Fitness Station",
    "Half Basket Ball Court",
    "Gazebo",
    "Badminton Court",
    "Children Play area",
    "Ample Greenery",
    "Water Harvesting Pit",
    "Water Softener",
    "Solar Fencing",
    "Security Cabin",
    "Lawn",
    "Transformer Yard",
    "Amphitheatre",
    "Lawn with Stepping Stones",
    "None",
  ];
  const facingOptions = ["East", "West", "South", "North"];
  const parkingOptions = ["0", "1", "2", "3", "4", "4+"];
  const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];
  const bathroomOptions = ["1", "2", "3", "4", "4+"];
  const balconyOptions = ["1", "2", "3", "4", "4+"];
  const furnishOptions = ["Fully", "Semi", "Unfurnished"];
  const isApartment = propertySubtype === "Apartment";
  const isIndependentHouse = propertySubtype === "Independent House";
  const isIndependentVilla = propertySubtype === "Independent Villa";
  const isCommercial = formValues.property_in === "Commercial";
  const shouldShowCommercialSubTypes = isCommercial;
  const isPlot = propertySubtype === "Plot";
  const isLand = propertySubtype === "Land";
  const isCommercialSell = isCommercial && isSell;
  const shouldShowConstruction =
    isApartment || isIndependentHouse || isIndependentVilla;
  const shouldShowLandSubtypes = isLand;
  const shouldShowBHK = isApartment || isIndependentHouse || isIndependentVilla;
  const shouldShowPlotArea = isIndependentHouse || isIndependentVilla || isPlot;
  const shouldShowLenthAreas = isLand || isPlot;
  const shouldShowCarpetArea =
    isIndependentHouse || isIndependentVilla || isApartment;
  const shouldShowBathroom =
    isApartment || isIndependentHouse || isIndependentVilla;
  const shouldShowBalcony =
    isApartment || isIndependentHouse || isIndependentVilla;
  const shouldShowFurnish =
    isApartment || isIndependentHouse || isIndependentVilla;
  const shouldShowAge =
    isApartment || isIndependentHouse || isIndependentVilla || isPlot;
  const shouldShowInvestor = isApartment || isIndependentVilla || isPlot;
  const shouldShowPossession = isSell && (isPlot || isLand);
  const shouldShowRentPossession = isRent;
  const shouldShowServant =
    isApartment || isIndependentHouse || isIndependentVilla;
  const shouldShowPlotNo =
    commercialSubType === "Plot" ||
    commercialSubType === "Warehouse" ||
    commercialSubType === "Others";
  const shouldShowLifts =
    commercialSubType === "Office" ||
    commercialSubType === "Retail Shop" ||
    commercialSubType === "Show Room";
  useEffect(() => {
    const currentFacilities = getValues("facilities");
    let cleanedArray = [];
    if (typeof currentFacilities === "string") {
      cleanedArray = currentFacilities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item && facilitiesOptions.includes(item));
    } else if (Array.isArray(currentFacilities)) {
      cleanedArray = currentFacilities.filter((item) =>
        facilitiesOptions.includes(item)
      );
    }
    setFac(cleanedArray);
  }, [getValues]);
  useEffect(() => {
    const cleanedString = fac.join(", ");
    setValue("facilities", cleanedString, { shouldDirty: true });
  }, [fac, setValue]);
  const handleFacilityChange = (facility, checked) => {
    setFac((prev) => {
      let updated = [...prev];
      if (facility === "None" && checked) {
        return ["None"];
      } else {
        updated = updated.filter((f) => f !== "None");
        if (checked && !updated.includes(facility)) {
          updated.push(facility);
        } else if (!checked) {
          updated = updated.filter((f) => f !== facility);
        }
        return updated;
      }
    });
  };
  useEffect(() => {
    const config = [
      {
        value: carParking,
        key: "car_parking",
        setCustom: setCarCustomMode,
        rawValue: property?.car_parking,
      },
      {
        value: bikeParking,
        key: "bike_parking",
        setCustom: setBikeCustomMode,
        rawValue: property?.bike_parking,
      },
      {
        value: openParking,
        key: "open_parking",
        setCustom: setOpenCustomMode,
        rawValue: property?.open_parking,
      },
      {
        value: bhk,
        key: "bedrooms",
        setCustom: setBhkCustom,
        rawValue: property?.bedrooms,
      },
      {
        value: bathroom,
        key: "bathroom",
        setCustom: setBathroomCustom,
        rawValue: property?.bathroom,
      },
      {
        value: balcony,
        key: "balconies",
        setCustom: setBalconyCustom,
        rawValue: property?.balconies,
      },
    ];
    config.forEach(({ value, key, setCustom, rawValue }) => {
      const numericValue = parseInt(value);
      const numericRawValue = parseInt(rawValue);
      if (!isNaN(numericRawValue) && numericRawValue > 4) {
        setCustom(true);
        setValue(key, `${numericRawValue}`, { shouldDirty: true });
      } else if (value === "4+" || value === "4+ BHK") {
        setCustom(true);
        setValue(key, `${numericRawValue || ""}`, { shouldDirty: true });
      } else if (!isNaN(numericValue) && numericValue <= 4) {
        setCustom(false);
        setValue(key, `${numericValue}`, { shouldDirty: true });
      }
    });
  }, [
    carParking,
    bikeParking,
    openParking,
    bhk,
    bathroom,
    balcony,
    property,
    setValue,
  ]);
  const formatFieldValue = (key, value) => {
    const intVal = parseInt(value);
    switch (key) {
      case "brokerage_charge":
        return intVal === 30 ? "30 Days" : intVal === 15 ? "15 Days" : "None";
      case "security_deposit":
      case "lock_in":
        return isNaN(intVal)
          ? "0 Months"
          : `${intVal} Month${intVal > 1 ? "s" : ""}`;
      case "rera_approved":
        return value === 1 || value === "1" ? "Yes" : "No";
      case "bedrooms":
      case "bathroom":
      case "balconies":
      case "bike_parking":
      case "car_parking":
      case "open_parking":
        return !isNaN(intVal) ? `${intVal}` : "0";
      default:
        return value;
    }
  };
  const normalizeAreaUnit = (unit) => {
    const mapping = {
      "sq.ft": "Sq.ft",
      "sq.yd": "Sq.yd",
      acres: "Acres",
      sq: "Sq.ft",
    };
    return mapping[unit?.toLowerCase()] || "Sq.ft";
  };
  useEffect(() => {
    let defaultUnit;
    if (
      ["Apartment", "Independent Villa", "Independent House"].includes(
        propertySubtype
      )
    ) {
      defaultUnit = "Sq.ft";
    } else if (propertySubtype === "Plot") {
      defaultUnit = "Sq.yd";
    } else if (propertySubtype === "Land") {
      defaultUnit = "Acres";
    } else {
      defaultUnit = "Sq.ft";
    }
    setValue("area_units", defaultUnit);
  }, [propertySubtype]);
  useEffect(() => {
    if (property && property.id) {
      Object.entries(property).forEach(([key, value]) => {
        const formattedVal = formatFieldValue(key, value);
        setValue(key, formattedVal ?? "");
      });
    }
    if (property?.around_places?.length) {
      const mappedPlaces = property.around_places.map((place) => ({
        place_id: place.id,
        place: place.title.trim(),
        distance: parseInt(place.distance),
      }));
      setPlaces(mappedPlaces);
    }
  }, [property, setValue]);
  const deleteAroundProperty = async (placeid, unique_property_id) => {
    try {
      const res = await fetch(
        `https://api.meetowner.in/property/deleteplacesaroundproperty`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            placeid,
            unique_property_id,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        console.log("Place deleted successfully:", data);
      } else {
        console.error("Failed to delete place:", data);
      }
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-2 gap-4">
      {!shouldShowCommercialSubTypes && (
        <div className="space-y-4 mb-4">
          <div className="flex items-center gap-2">
            <Label>Property Sub Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {propertySubtypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = propertySubtype === type.id;
              return (
                <Button
                  key={type.id}
                  type="button"
                  onClick={() => setValue("sub_type", type.id)}
                  className={`h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 text-xs ${
                    isSelected
                      ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-center leading-tight">
                    {type.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
      {shouldShowCommercialSubTypes && (
        <div className="space-y-4 mb-4">
          <div className="flex items-center gap-2 ">
            <Label>Commercial Sub Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {commercialSubTypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = propertySubtype === type.id;
              return (
                <Button
                  key={type.id}
                  type="button"
                  onClick={() => setValue("sub_type", type.id)}
                  className={`h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 text-xs ${
                    isSelected
                      ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-center leading-tight">
                    {type.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
      {shouldShowLandSubtypes && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Land Sub Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {landSubtypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = landSubType === type.id;
              return (
                <Button
                  key={type.id}
                  type="button"
                  onClick={() => setValue("land_sub_type", type.id)}
                  className={`h-16 sm:h-20 p-1 w-auto flex flex-col items-center justify-center space-y-1 text-xs text-center break-words ${
                    isSelected
                      ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="w-full truncate text-center leading-tight">
                    {type.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
      {isSell && (
        <div className="w-full sm:w-3/4 md:w-1/2 space-y-2">
          <Label>
            <div className="flex items-center gap-1">
              <span>Rera Approved</span>
              <span className="text-red-500">*</span>
            </div>
          </Label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Yes", "No"].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                onClick={() => setValue("rera_approved", val)}
                className={`px-6 sm:px-8 py-3 capitalize ${
                  reraApproved === val
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {val}
              </Button>
            ))}
          </div>
        </div>
      )}
      {shouldShowConstruction && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Construction Status</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Ready to move", "Under Construction"].map((status) => (
              <Button
                key={status}
                type="button"
                onClick={() => setValue("occupancy", status)}
                className={`px-4 sm:px-6 py-3 ${
                  constructionStatus === status
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      )}
      {shouldShowBHK && (
        <div className="space-y-4">
          <Label>BHK</Label>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
            {bhkOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={
                  bhk === option || (bhkCustom && option === "4+ BHK")
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  if (option === "4+ BHK") {
                    setBhkCustom(true);
                    setValue("bedrooms", "");
                  } else {
                    setBhkCustom(false);
                    setValue("bedrooms", option);
                  }
                }}
                className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
                  bhk === option || (bhkCustom && option === "4+ BHK")
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
          {bhkCustom && (
            <Input
              type="number"
              placeholder="Enter custom bedrooms"
              className="w-full sm:w-1/2"
              {...register("bedrooms", {
                validate: (value) =>
                  !value || parseInt(value) > 4
                    ? true
                    : "Value must be greater than 4",
              })}
              onChange={(e) =>
                setValue("bedrooms", e.target.value, { shouldDirty: true })
              }
            />
          )}
        </div>
      )}
      {shouldShowBathroom && (
        <div className="space-y-4">
          <Label>Bathroom</Label>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
            {bathroomOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={
                  bathroom === option || (bathroomCustom && option === "4+")
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  if (option === "4+") {
                    setBathroomCustom(true);
                    setValue("bathroom", "");
                  } else {
                    setBathroomCustom(false);
                    setValue("bathroom", option);
                  }
                }}
                className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
                  bathroom === option || (bathroomCustom && option === "4+")
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
          {bathroomCustom && (
            <Input
              type="number"
              placeholder="Enter custom bathroom"
              className="w-full sm:w-1/2"
              {...register("bathroom", {
                validate: (value) =>
                  !value || parseInt(value) > 4
                    ? true
                    : "Value must be greater than 4",
              })}
              onChange={(e) =>
                setValue("bathroom", e.target.value, { shouldDirty: true })
              }
            />
          )}
        </div>
      )}
      {shouldShowBalcony && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Balcony</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
            {balconyOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={
                  (balcony === option) === option ||
                  (balconyCustom && option === "4+")
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  if (option === "4+") {
                    setBalconyCustom(true);
                    setValue("balconies", "");
                  } else {
                    setBalconyCustom(false);
                    setValue("balconies", option);
                  }
                }}
                className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
                  balcony === option || (balconyCustom && option === "4+")
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
          {balconyCustom && (
            <Input
              type="number"
              placeholder="Enter Custom Balcony"
              className="w-full sm:w-1/2"
              {...register("balconies", {
                validate: (value) =>
                  !value || parseInt(value) > 4
                    ? true
                    : "Value must be greater than 4",
              })}
              onChange={(e) =>
                setValue("balconies", e.target.value, { shouldDirty: true })
              }
            />
          )}
        </div>
      )}
      {shouldShowFurnish && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Furnish Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
            {furnishOptions.map((option) => (
              <Button
                key={option}
                type="button"
                onClick={() => setValue("furnished_status", option)}
                className={`px-4 sm:px-6 py-3 ${
                  furnishType === option
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      )}
      {shouldShowAge && (
        <div className="space-y-2">
          <Label>Age of Property</Label>
          <Select
            value={watch("property_age")}
            onValueChange={(value) => setValue("property_age", value)}
            className="bg-white"
          >
            <SelectTrigger className="w-full sm:w-1/2 mb-2 bg-white">
              <SelectValue placeholder="0-5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5.00">0-5 years</SelectItem>
              <SelectItem value="10.00">5-10 years</SelectItem>
              <SelectItem value="15.00">10-15 years</SelectItem>
              <SelectItem value="20.00">15+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {isRent && (
        <>
          {shouldShowLifts && (
            <>
              <Label className="text-base sm:text-lg font-medium mt-10">
                Lifts & Stair Cases
              </Label>
              <div className="grid grid-cols-1 lg:grid-cols-3 mb-4  gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label>
                    Passenger Lifts
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("passenger_lifts", {
                      required: "Passenger lifts is required",
                    })}
                    placeholder="Enter Passenger lifts"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Service Lifts
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("service_lifts", {
                      required: "Service lifts is required",
                    })}
                    placeholder="Enter Service lifts"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Stair Cases
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("stair_cases", {
                      required: "Stair Cases is required",
                    })}
                    placeholder="Enter Stair cases"
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4   sm:gap-6">
            <div className="space-y-2">
              <Label>
                Available from <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch("available_from")
                      ? format(watch("available_from"), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watch("available_from")}
                    onSelect={(date) => setValue("available_from", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 mb-2 ">
              <Label>
                Monthly Rent <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("monthly_rent", {
                  required: "Monthly rent is required",
                })}
                placeholder="Monthly Rent"
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2 sm:gap-6">
            <div className="space-y-2">
              <Label>
                Maintenance Charge (per Month){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("maintenance", {
                  required: "Maintenance charge is required",
                })}
                placeholder="Maintenance Charge"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>
                <div className="flex items-center gap-1">
                  <span>Loan Facility</span>
                  <span className="text-red-500">*</span>
                </div>
              </Label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                {["Yes", "No"].map((val) => {
                  const mappedValue = val === "Yes" ? "1" : "0";
                  return (
                    <Button
                      key={val}
                      type="button"
                      variant="outline"
                      onClick={() => setValue("loan_facility", mappedValue)}
                      className={`px-6 sm:px-8 py-3 capitalize ${
                        loanFacility === mappedValue
                          ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                          : "bg-white text-black hover:bg-gray-100 border"
                      }`}
                    >
                      {val}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 sm:gap-6">
        <div className="space-y-2">
          <Label>Area units</Label>
          <Select
            value={normalizeAreaUnit(areaUnit)}
            onValueChange={(value) => setValue("area_units", value)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sq.ft">Sq.ft</SelectItem>
              <SelectItem value="Sq.yd">Sq.yd</SelectItem>
              <SelectItem value="Acres">Acres</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label>Built-up Area (Sq.ft)</Label>
            <span className="text-red-500">*</span>
          </div>
          <Input
            {...register("builtup_area")}
            placeholder="Built-up Area"
            className="w-full"
          />
        </div>
        {shouldShowCarpetArea && (
          <div className="space-y-2">
            <Label>Carpet Area (Sq.ft)</Label>
            <Input
              {...register("carpet_area")}
              placeholder="Carpet Area"
              className="bg-white w-full"
            />
          </div>
        )}
        {shouldShowPlotArea && (
          <div className="space-y-2">
            <Label>Plot Area (Sq.yd)</Label>
            <Input
              {...register("plot_area")}
              placeholder="Plot Area"
              className="w-full"
            />
          </div>
        )}
        {shouldShowLenthAreas && (
          <>
            <div className="space-y-2">
              <Label>Length Area (Sq.ft)</Label>
              <Input
                {...register("length_area")}
                placeholder="Length Area"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Width Area (Sq.ft)</Label>
              <Input
                {...register("width_area")}
                placeholder="Width Area"
                className="w-full"
              />
            </div>
          </>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Total Project Area</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex items-center border rounded-md overflow-hidden">
            <Input
              {...register("total_project_area")}
              placeholder="Enter Total Project Area"
              className="flex-1 border-none focus:ring-0 focus:outline-none px-3"
            />
            <Select
              value={watch("total_project_area_type")}
              onValueChange={(value) =>
                setValue("total_project_area_type", value)
              }
            >
              <SelectTrigger className="border-l px-3 h-full w-24">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="acres">Acres</SelectItem>
                <SelectItem value="sq.yd">Sq.yd</SelectItem>
                <SelectItem value="sq.ft">Sq.ft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Unit Cost (₹)</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex items-center border rounded-md overflow-hidden">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <Input
                {...register("builtup_unit")}
                placeholder="Unit Cost"
                className="pl-8 border-none focus:ring-0 focus:outline-none w-full"
              />
            </div>
            <Select
              value={watch("unit_cost_type")}
              onValueChange={(value) => setValue("unit_cost_type", value)}
            >
              <SelectTrigger className="border-l px-3 h-full w-28">
                <SelectValue placeholder="Select price type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="onwards">Onwards</SelectItem>
                <SelectItem value="between">Between</SelectItem>
                <SelectItem value="on-request">On Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Property Cost</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex items-center border rounded-md overflow-hidden">
            <Input
              {...register("property_cost")}
              placeholder="Property Cost"
              className="flex-1 border-none focus:ring-0 focus:outline-none px-3"
            />
            <Select
              value={watch("property_cost_type")}
              onValueChange={(value) => setValue("property_cost_type", value)}
            >
              <SelectTrigger className="border-l px-3 h-full w-28">
                <SelectValue placeholder="Onwards" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="onwards">Onwards</SelectItem>
                <SelectItem value="between">Between</SelectItem>
                <SelectItem value="on-request">On Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {propertyCost && !isNaN(propertyCost) && (
            <p className="text-sm text-gray-500 italic mt-1">
              {formatCurrencyInWords(propertyCost)}
            </p>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Pent House</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Yes", "No"].map((val) => {
              const mappedValue = val === "Yes" ? "1" : "0";
              return (
                <Button
                  key={val}
                  type="button"
                  variant="outline"
                  onClick={() => setValue("pent_house", mappedValue)}
                  className={`px-6 sm:px-8 py-3 capitalize ${
                    pentHouse === mappedValue
                      ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  {val}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      {isRent && (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label>Security Deposit</Label>
              <span className="text-red-500">*</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
              {["1 Month", "2 Months", "3 Months"].map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant="outline"
                  onClick={() => setValue("security_deposit", item)}
                  className={`px-4 sm:px-6 py-3 capitalize ${
                    securityDeposit === item
                      ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label>Lock in period</Label>
              <span className="text-red-500">*</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
              {["1 Month", "2 Months", "3 Months"].map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant="outline"
                  onClick={() => setValue("lock_in", item)}
                  className={`px-4 sm:px-6 py-3 capitalize ${
                    lockinPeriod === item
                      ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label>Do you charge Brokerage</Label>
              <span className="text-red-500">*</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
              {["None", "15 Days", "30 Days"].map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant="outline"
                  onClick={() => setValue("brokerage_charge", item)}
                  className={`px-4 sm:px-6 py-3 capitalize ${
                    brokerage === item
                      ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label>Preferred Tenant Type</Label>
              <span className="text-red-500">*</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
              {[
                "Anyone",
                "Family",
                "Bachelors",
                "Single Men",
                "Single Women",
              ].map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant="outline"
                  onClick={() => setValue("types", item)}
                  className={`px-3 sm:px-6 py-3 text-xs sm:text-sm capitalize ${
                    preferredTenantType === item
                      ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
      {isCommercialSell && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Ownership</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {[
              "Freehold",
              "Leasehold",
              "Cooperative society",
              "Power of attorney",
            ].map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                onClick={() => setValue("ownership_type", item)}
                className={`px-3 sm:px-6 py-3 text-xs sm:text-sm capitalize ${
                  ownership === item
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      )}
      {!isPlot && !isLand && (
        <div className="space-y-4 mb-10">
          <Label className="text-base sm:text-lg font-medium">Facilities</Label>
          <p className="text-xs sm:text-sm text-gray-600">
            Available facilities in the property
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {facilitiesOptions.map((facility) => (
              <div key={facility} className="flex items-center space-x-2">
                <Checkbox
                  id={facility}
                  checked={fac.includes(facility)}
                  onCheckedChange={(checked) =>
                    handleFacilityChange(facility, checked)
                  }
                  className={`border-gray-500 data-[state=checked]:bg-[#1D3A76] data-[state=checked]:border-[#1D3A76]`}
                />
                <label
                  htmlFor={facility}
                  className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {facility}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      {shouldShowPossession && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Possession Status</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Immediate", "Future"].map((status) => (
              <Button
                key={status}
                type="button"
                variant="outline"
                onClick={() => setValue("possession_status", status)}
                className={`px-4 sm:px-6 py-3 capitalize ${
                  possessionStatus === status
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      )}
      {shouldShowRentPossession && (
        <div className="space-y-4 mb-4">
          <div className="flex items-center gap-2">
            <Label>Possession Status</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Ready To Move In", "Available From"].map((status) => (
              <Button
                key={status}
                type="button"
                variant="outline"
                onClick={() => setValue("possession_status", status)}
                className={`px-4 sm:px-6 py-3 capitalize ${
                  possessionStatus === status
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      )}
      {shouldShowInvestor && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Investor Property</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Yes", "No"].map((val) => {
              const mappedValue = val === "Yes" ? "1" : "0";
              return (
                <Button
                  key={val}
                  type="button"
                  variant="outline"
                  onClick={() => setValue("investor_property", mappedValue)}
                  className={`px-6 sm:px-8 py-3 capitalize ${
                    investorProperty === mappedValue
                      ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  {val}
                </Button>
              );
            })}
          </div>
        </div>
      )}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-base sm:text-lg font-medium">
          Add Additional Details
        </h3>
        <div className="space-y-4">
          <Label>Facing</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-4">
            {facingOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={facing === option ? "default" : "outline"}
                onClick={() => setValue("facing", option)}
                className={`px-3 sm:px-8 py-3 text-xs sm:text-sm capitalize ${
                  facing === option
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        {shouldShowPossession || shouldShowPlotNo ? (
          <div className="space-y-2">
            <Label>
              Plot No
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              {...register("plot_number", {
                required: "Plot Number is required",
              })}
              placeholder="Plot No"
              className="w-1/2"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label>
              Flat No
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              {...register("unit_flat_house_no", {
                required: "Flat Number is required",
              })}
              placeholder="Flat No"
              className="w-1/2"
            />
          </div>
        )}
        {isCommercial && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label>Zone Type</Label>
              <Select onValueChange={(value) => setValue("zoneType", value)}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Special Economic Zone">
                    Special Economic Zone
                  </SelectItem>
                  <SelectItem value="Open Spaces">Open Spaces</SelectItem>
                  <SelectItem value="Agriculture Zone">
                    Agriculture Zone
                  </SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Suitable</Label>
              <Select onValueChange={(value) => setValue("suitable", value)}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select Suitable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jewellery">Jewellery</SelectItem>
                  <SelectItem value="Gym">Gym</SelectItem>
                  <SelectItem value="Grocery">Grocery</SelectItem>
                  <SelectItem value="Clinic">Clinic</SelectItem>
                  <SelectItem value="Footwear">Footwear</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {!isPlot && !isLand && (
          <>
            <div className="space-y-4">
              <Label>Car Parking</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
                {parkingOptions.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={
                      carParking === option ||
                      (carCustomMode && option === "4+")
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      if (option === "4+") {
                        setCarCustomMode(true);
                        setValue("car_parking", "");
                      } else {
                        setCarCustomMode(false);
                        setValue("car_parking", option);
                      }
                    }}
                    className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
                      carParking === option ||
                      (carCustomMode && option === "4+")
                        ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                        : "bg-white text-black hover:bg-gray-100 border"
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {carCustomMode && (
                <Input
                  type="number"
                  placeholder="Enter custom car parking"
                  className="w-full sm:w-1/2"
                  {...register("car_parking", {
                    validate: (value) =>
                      !value || parseInt(value) > 4
                        ? true
                        : "Value must be greater than 4",
                  })}
                  onChange={(e) =>
                    setValue("car_parking", e.target.value, {
                      shouldDirty: true,
                    })
                  }
                />
              )}
            </div>
            <div className="space-y-4">
              <Label>Bike Parking</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
                {parkingOptions.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={
                      bikeParking === option ||
                      (bikeCustomMode && option === "4+")
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      if (option === "4+") {
                        setBikeCustomMode(true);
                        setValue("bike_parking", "");
                      } else {
                        setBikeCustomMode(false);
                        setValue("bike_parking", option);
                      }
                    }}
                    className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
                      bikeParking === option ||
                      (bikeCustomMode && option === "4+")
                        ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                        : "bg-white text-black hover:bg-gray-100 border"
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {bikeCustomMode && (
                <Input
                  type="number"
                  placeholder="Custom Bike Parking"
                  className="w-full sm:w-1/2"
                  {...register("bike_parking", {
                    validate: (value) =>
                      !value || parseInt(value) > 4
                        ? true
                        : "Value must be greater than 4",
                  })}
                  onChange={(e) =>
                    setValue("bike_parking", e.target.value, {
                      shouldDirty: true,
                    })
                  }
                />
              )}
            </div>
            <div className="space-y-4">
              <Label>Open Parking</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
                {parkingOptions.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={
                      openParking === option ||
                      (openCustomMode && option === "4+")
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      if (option === "4+") {
                        setOpenCustomMode(true);
                        setValue("open_parking", "");
                      } else {
                        setOpenCustomMode(false);
                        setValue("open_parking", option);
                      }
                    }}
                    className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
                      openParking === option ||
                      (openCustomMode && option === "4+")
                        ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                        : "bg-white text-black hover:bg-gray-100 border"
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {openCustomMode && (
                <Input
                  type="number"
                  placeholder="Custom Open Parking"
                  className="w-full sm:w-1/2"
                  {...register("open_parking", {
                    validate: (value) =>
                      !value || parseInt(value) > 4
                        ? true
                        : "Value must be greater than 4",
                  })}
                  onChange={(e) =>
                    setValue("open_parking", e.target.value, {
                      shouldDirty: true,
                    })
                  }
                />
              )}
            </div>
          </>
        )}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Around This Property</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              {...register("nearbyPlace")}
              placeholder="Place around Property"
              className="w-full"
            />
            <div className="flex gap-2">
              <Input
                {...register("distanceFromProperty")}
                placeholder="Distance from property"
                type="number"
                min={0}
                className="flex-1"
              />
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="w-16 sm:w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="KM">KM</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                type="button"
                className="px-3 sm:px-6 bg-[#1D3A76] hover:bg-blue-800 text-xs sm:text-sm"
                onClick={handleAdd}
              >
                + Add
              </Button>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {places.map(({ place, distance, place_id }, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-3 rounded gap-2"
              >
                <span className="font-semibold text-sm sm:text-base">
                  {place}
                </span>
                <div className="flex items-center gap-3 sm:gap-5">
                  <span className="bg-blue-900 rounded-lg p-2 text-white text-xs sm:text-sm">
                    {formatDistance(distance)}
                  </span>
                  <Trash
                    className="cursor-pointer text-red-500 hover:text-red-700 w-4 h-4 sm:w-5 sm:h-5"
                    onClick={() => handleDelete(place_id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {shouldShowServant && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label>Servant Room?</Label>
              <span className="text-red-500">*</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {["Yes", "No"].map((val) => {
                const mappedValue = val === "Yes" ? "1" : "0";
                return (
                  <Button
                    key={val}
                    type="button"
                    variant="outline"
                    onClick={() => setValue("servent_room", mappedValue)}
                    className={`px-6 sm:px-8 py-3 capitalize ${
                      servantRoom === mappedValue
                        ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                        : "bg-white text-black hover:bg-gray-100 border"
                    }`}
                  >
                    {val}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Property Description</Label>
            <span className="text-red-500">*</span>
          </div>
          <Textarea
            {...register("description")}
            placeholder="Property Description"
            rows={4}
            className="w-full resize-y"
          />
        </div>
      </div>
    </div>
  );
}
