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
export default function PropertyDetails({ property }) {
  console.log("property: ", property.around_places);
  const { register, watch, setValue, getValues } = useFormContext();
  const formValues = watch();
  const propertySubtype = watch("sub_type");
  const commercialSubType = watch("sub_type");
  const isRent = formValues?.property_for === "Rent";
  const isSell = formValues?.property_for === "Sell";
  const securityDeposit = watch("security_deposit");
  const lockinPeriod = watch("lock_in");
  const landSubType = watch("landSubType");
  const brokerage = watch("brokerage_charge");
  const propertyCost = watch("property_cost");
  const preferredTenantType = watch("types");
  const constructionStatus = watch("occupancy");
  const pentHouse = watch("pent_house");
  const loanFacility = watch("loan_facility");
  const investorProperty = watch("investor_property");
  console.log("investorProperty: ", investorProperty);
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
  const [places, setPlaces] = useState([]);
  const [unit, setUnit] = useState("M");
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
  const handleDelete = (index) => {
    setPlaces((prev) => prev.filter((_, i) => i !== index));
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
    "Badmenton Court",
    "Children Play area",
    "Ample Greenery",
    "Water Harvesting Pit",
    "Water Softner",
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
  const shouldShowPossession = isPlot || isLand;
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
  const handleFacilityChange = (facility, checked) => {
    const currentFacilities = getValues("facilities") || [];
    if (checked) {
      setValue("facilities", [...currentFacilities, facility]);
    } else {
      setValue(
        "facilities",
        currentFacilities.filter((f) => f !== facility)
      );
    }
  };
  const formatFieldValue = (key, value) => {
    // Convert to integer safely (handles both "5" and 5)
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
        return !isNaN(intVal)
          ? intVal > 4
            ? "4+ BHK"
            : `${intVal} BHK`
          : "0 BHK";

      case "bathroom":
      case "balconies":
      case "bike_parking":
      case "car_parking":
        return !isNaN(intVal) ? (intVal >= 4 ? "4+" : `${intVal}`) : "0";

      // case "investor_property":
      // case "pent_house":
      // case "loan_facility":
      // case "servant_room":
      //   return value === null ||
      //     value === "" ||
      //     value === undefined ||
      //     value === "0"
      //     ? "No"
      //     : "Yes";

      default:
        return value;
    }
  };

  useEffect(() => {
    let defaultUnit = areaUnit?.toLowerCase();
    console.log("propertySubtype: ", propertySubtype);
    if (
      ["Apartment", "Independent Villa", "Independent House"].includes(
        propertySubtype
      )
    ) {
      defaultUnit = "sq.ft";
    } else if (propertySubtype === "Plot") {
      defaultUnit = "sq.yd";
    } else if (propertySubtype === "Land") {
      defaultUnit = "Acres";
    }
    console.log("defaultUnit: ", defaultUnit);
    setValue("area_units", defaultUnit);
  }, [propertySubtype, setValue]);
  useEffect(() => {
    if (property && property.id) {
      Object.entries(property).forEach(([key, value]) => {
        const formattedVal = formatFieldValue(key, value);
        setValue(key, formattedVal ?? "");
      });
    }
    if (property?.around_places?.length) {
      const mappedPlaces = property.around_places.map((place) => ({
        place: place.title.trim(),
        distance: parseInt(place.distance),
      }));
      setPlaces(mappedPlaces);
    }
  }, [property, setValue]);

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
                  onClick={() => setValue("landSubType", type.id)}
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
          <div className="flex items-center gap-2">
            <Label>BHK</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {bhkOptions.map((option) => (
              <Button
                key={option}
                type="button"
                onClick={() => setValue("bedrooms", option)}
                className={`px-3 sm:px-4 py-3 text-sm ${
                  bhk === option
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
          {bhk === "4+ BHK" && (
            <Input
              type="number"
              placeholder="Custom BHK"
              className="w-full sm:w-1/2"
              onChange={(e) => setValue("bedrooms", e.target.value)}
            />
          )}
        </div>
      )}
      {shouldShowBathroom && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Bathroom</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
            {bathroomOptions.map((option) => (
              <Button
                key={option}
                type="button"
                onClick={() => setValue("bathroom", option)}
                className={`w-12 sm:w-16 h-10 sm:h-12 text-sm ${
                  bathroom === option
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
          {bathroom === "4+" && (
            <Input
              type="number"
              placeholder="Custom Bathrooms"
              className="w-full sm:w-1/2"
              onChange={(e) => setValue("customBathroom", e.target.value)}
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
                onClick={() => setValue("balconies", option)}
                className={`w-12 sm:w-16 h-10 sm:h-12 text-sm ${
                  balcony === option
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
          {balcony === "4+" && (
            <Input
              type="number"
              placeholder="Custom Balcony"
              className="w-full sm:w-1/2"
              onChange={(e) => setValue("balconies", e.target.value)}
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
        <div className="space-y-2 ">
          <Label>Age of Property</Label>
          <Select
            onValueChange={(value) => setValue("property_age", value)}
            className="bg-white"
          >
            <SelectTrigger className="w-full sm:w-1/2 mb-2  bg-white">
              <SelectValue placeholder="0-5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">0-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10-15">10-15 years</SelectItem>
              <SelectItem value="15+">15+ years</SelectItem>
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
                {["Yes", "No"].map((val) => (
                  <Button
                    key={val}
                    type="button"
                    variant="outline"
                    onClick={() => setValue("loan_facility", val)}
                    className={`px-6 sm:px-8 py-3 capitalize ${
                      loanFacility === val
                        ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                        : "bg-white text-black hover:bg-gray-100 border"
                    }`}
                  >
                    {val}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 sm:gap-6">
        <div className="space-y-2">
          <Label>Area units</Label>
          <Select
            value={areaUnit}
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
                {...register("length_area")}
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
              onValueChange={(value) =>
                setValue("total_project_area_unit", value)
              }
            >
              <SelectTrigger className="border-l px-3 h-full w-24">
                <SelectValue placeholder="Acres" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="acres">Acres</SelectItem>
                <SelectItem value="sq.yds">Sq.yds</SelectItem>
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
              onValueChange={(value) => setValue("unit_cost_type", value)}
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
            {["Yes", "No"].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                onClick={() => setValue("pent_house", val)}
                className={`px-6 sm:px-8 py-3 capitalize ${
                  pentHouse === val
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {val}
              </Button>
            ))}
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
                  onClick={() => setValue("securityDeposit", item)}
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
                  onClick={() => setValue("locak_in", item)}
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
                  onClick={() => setValue("brokerage", item)}
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
                  checked={facilities.includes(facility)}
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
            {["Yes", "No"].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                onClick={() => setValue("investor_property", val)}
                className={`px-6 sm:px-8 py-3 capitalize ${
                  investorProperty === val
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
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label>Loan Facility</Label>
          <span className="text-red-500">*</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {["Yes", "No"].map((val) => (
            <Button
              key={val}
              type="button"
              variant="outline"
              onClick={() => setValue("loanFacility", val)}
              className={`px-6 sm:px-8 py-3 capitalize ${
                loanFacility === val
                  ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                  : "bg-white text-black hover:bg-gray-100 border"
              }`}
            >
              {val}
            </Button>
          ))}
        </div>
      </div>
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
              {...register("plotNo", {
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
                    variant={carParking === option ? "default" : "outline"}
                    onClick={() => setValue("carParking", option)}
                    className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
                      carParking === option
                        ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                        : "bg-white text-black hover:bg-gray-100 border"
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {carParking === "4+" && (
                <Input
                  type="number"
                  placeholder="Custom Car Parking"
                  className="w-full sm:w-1/2"
                  onChange={(e) => setValue("customCarParking", e.target.value)}
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
                    variant={bikeParking === option ? "default" : "outline"}
                    onClick={() => setValue("bike_parking", option)}
                    className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
                      bikeParking === option
                        ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                        : "bg-white text-black hover:bg-gray-100 border"
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {bikeParking === "4+" && (
                <Input
                  type="number"
                  placeholder="Custom Bike Parking"
                  className="w-full sm:w-1/2"
                  onChange={(e) =>
                    setValue("customBikeParking", e.target.value)
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
                    variant={openParking === option ? "default" : "outline"}
                    onClick={() => setValue("openParking", option)}
                    className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
                      openParking === option
                        ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                        : "bg-white text-black hover:bg-gray-100 border"
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {openParking === "4+" && (
                <Input
                  type="number"
                  placeholder="Custom Open Parking"
                  className="w-full sm:w-1/2"
                  onChange={(e) =>
                    setValue("customOpenParking", e.target.value)
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
            {places.map(({ place, distance }, index) => (
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
                    onClick={() => handleDelete(index)}
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
              {["Yes", "No"].map((val) => (
                <Button
                  key={val}
                  type="button"
                  variant="outline"
                  onClick={() => setValue("servantRoom", val)}
                  className={`px-6 sm:px-8 py-3 capitalize ${
                    servantRoom === val
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
