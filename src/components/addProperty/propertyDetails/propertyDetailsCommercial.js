import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
export default function PropertyDetails() {
  const { register, watch, setValue, getValues } = useFormContext();

  const formValues = watch();
  console.log("formValues: ", formValues);

  const propertySubtype = watch("propertySubtype");
  const landSubType = watch("landSubType");
  const constructionStatus = watch("constructionStatus");
  const pentHouse = watch("pentHouse");
  console.log("pentHouse: ", pentHouse);
  const loanFacility = watch("loanFacility");
  const investorProperty = watch("investorProperty");
  const servantRoom = watch("servantRoom");
  const facing = watch("facing");
  const carParking = watch("carParking");
  const bikeParking = watch("bikeParking");
  const openParking = watch("openParking");
  const bhk = watch("bhk");
  const bathroom = watch("bathroom");
  const balcony = watch("balcony");
  const furnishType = watch("furnishType");
  const possessionStatus = watch("possessionStatus");
  const facilities = watch("facilities") || [];
  const areaUnit = watch("areaUnit");
  const nearbyPlace = watch("nearbyPlace");
  const distanceFromProperty = watch("distanceFromProperty");
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
    { id: "apartment", label: "Apartment", icon: Building },
    { id: "independent-house", label: "Independent House", icon: Home },
    { id: "independent-villa", label: "Independent Villa", icon: Building2 },
    { id: "plot", label: "Plot", icon: MapPin },
    { id: "land", label: "Land", icon: Landmark },
  ];
  const landSubtypes = [
    { id: "villa_development", label: "Villa Development", icon: House },
    {
      id: "apartment_development",
      label: "Apartment development",
      icon: Hotel,
    },
    {
      id: "commercial_development",
      label: "Commercial Development",
      icon: Store,
    },
    { id: "out_rate_sale", label: "Out Rate Sale", icon: IndianRupee },
    { id: "farm_land", label: "Farm Land", icon: Trees },
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
  const isApartment = propertySubtype === "apartment";
  const isIndependentHouse = propertySubtype === "independent-house";
  const isIndependentVilla = propertySubtype === "independent-villa";
  const isPlot = propertySubtype === "plot";
  const isLand = propertySubtype === "land";
  const shouldShowConstruction =
    isApartment || isIndependentHouse || isIndependentVilla;
  const shouldShowLandSubtypes = isLand;
  const shouldShowBHK = isApartment || isIndependentHouse || isIndependentVilla;
  const shouldShowPlotArea = isIndependentHouse || isIndependentVilla || isPlot;
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
  const shouldShowServant =
    isApartment || isIndependentHouse || isIndependentVilla;
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
  useEffect(() => {
    let defaultUnit = "sq.ft";
    if (
      ["apartment", "independent-villa", "independent-house"].includes(
        propertySubtype
      )
    ) {
      defaultUnit = "sq.ft";
    } else if (propertySubtype === "plot") {
      defaultUnit = "sq.yd";
    } else if (propertySubtype === "land") {
      defaultUnit = "acres";
    }
    setValue("areaUnit", defaultUnit);
  }, [propertySubtype, setValue]);
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-base font-medium">Property Sub Type</Label>
          <span className="text-red-500">*</span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {propertySubtypes.map((type) => {
            const IconComponent = type.icon;
            const isSelected = propertySubtype === type.id;
            return (
              <Button
                key={type.id}
                type="button"
                onClick={() => setValue("propertySubtype", type.id)}
                className={`h-20 flex flex-col items-center justify-center space-y-2 text-xs ${
                  isSelected
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                <IconComponent className="w-6 h-6" />
                <span>{type.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
      {shouldShowLandSubtypes && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="text-base font-medium">Land Sub Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {landSubtypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = landSubType === type.id;
              return (
                <Button
                  key={type.id}
                  type="button"
                  onClick={() => setValue("landSubType", type.id)}
                  className={`h-20 p-1 w-auto flex flex-col items-center justify-center space-y-1 text-xs text-center break-words ${
                    isSelected
                      ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="w-full truncate text-center">
                    {type.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
      {shouldShowConstruction && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="text-base font-medium">Construction Status</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex gap-4">
            {["Ready-to-move", "Under-construction"].map((status) => (
              <Button
                key={status}
                type="button"
                onClick={() => setValue("constructionStatus", status)}
                className={`px-6 py-3 ${
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
            <Label className="text-base font-medium">BHK</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex gap-4 flex-wrap">
            {bhkOptions.map((option) => (
              <Button
                key={option}
                type="button"
                onClick={() => setValue("bhk", option)}
                className={`px-4 py-3 ${
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
            <input
              type="number"
              placeholder="Custom BHK"
              className="border p-2 rounded w-full"
              onChange={(e) => setValue("customBHK", e.target.value)}
            />
          )}
        </div>
      )}
      {shouldShowBathroom && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="text-base font-medium">Bathroom</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex gap-4 flex-wrap">
            {bathroomOptions.map((option) => (
              <Button
                key={option}
                type="button"
                onClick={() => setValue("bathroom", option)}
                className={`w-16 h-12 ${
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
            <input
              type="number"
              placeholder="Custom Bathrooms"
              className="border p-2 rounded w-full"
              onChange={(e) => setValue("customBathroom", e.target.value)}
            />
          )}
        </div>
      )}
      {shouldShowBalcony && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="text-base font-medium">Balcony</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex gap-4 flex-wrap">
            {balconyOptions.map((option) => (
              <Button
                key={option}
                type="button"
                onClick={() => setValue("balcony", option)}
                className={`w-16 h-12 ${
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
            <input
              type="number"
              placeholder="Custom Balcony"
              className="border p-2 rounded w-full"
              onChange={(e) => setValue("customBalcony", e.target.value)}
            />
          )}
        </div>
      )}
      {shouldShowFurnish && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="text-base font-medium">Furnish Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex gap-4">
            {furnishOptions.map((option) => (
              <Button
                key={option}
                type="button"
                onClick={() => setValue("furnishType", option)}
                className={`px-6 py-3 ${
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
            onValueChange={(value) => setValue("ageOfProperty", value)}
            className="bg-white"
          >
            <SelectTrigger>
              <SelectValue placeholder="0-5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-5">0-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10-15">10-15 years</SelectItem>
              <SelectItem value="15+">15+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Area units</Label>
          <Select
            value={areaUnit}
            onValueChange={(value) => setValue("areaUnit", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sq.ft">Sq.ft</SelectItem>
              <SelectItem value="sq.yd">Sq.yd</SelectItem>
              <SelectItem value="acres">Acres</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Built-up Area (Sq.ft)</Label>
            <span className="text-red-500">*</span>
          </div>
          <Input {...register("builtupArea")} placeholder="Built-up Area" />
        </div>
        {shouldShowCarpetArea && (
          <div className="space-y-2">
            <Label>Carpet Area (Sq.ft)</Label>
            <Input
              {...register("carpetArea")}
              placeholder="Carpet Area"
              className="bg-white placeholder-white"
            />
          </div>
        )}
        {shouldShowPlotArea && (
          <div className="space-y-2">
            <Label>Plot Area (Sq.yd)</Label>
            <Input {...register("plotArea")} placeholder="Plot Area" />
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Total Project Area</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex items-center border rounded-md overflow-hidden">
            <Input
              {...register("totalProjectArea")}
              placeholder="Enter Total Project Area"
              className="flex-1 border-none focus:ring-0 focus:outline-none px-3"
            />
            <Select
              onValueChange={(value) => setValue("totalProjectAreaUnit", value)}
            >
              <SelectTrigger className="border-l px-3 h-full">
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
                {...register("unitCost")}
                placeholder="Unit Cost"
                className="pl-8 border-none focus:ring-0 focus:outline-none w-full"
              />
            </div>
            <Select onValueChange={(value) => setValue("unitCostType", value)}>
              <SelectTrigger className="border-l px-3 h-full">
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
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Pent House</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex gap-4">
            {["yes", "no"].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                onClick={() => setValue("pentHouse", val)}
                className={`px-8 py-3 capitalize ${
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
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Property Cost</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex items-center border rounded-md overflow-hidden">
            <Input
              {...register("propertyCost")}
              placeholder="Property Cost"
              className="flex-1 border-none focus:ring-0 focus:outline-none px-3"
            />
            <Select
              onValueChange={(value) => setValue("propertyCostType", value)}
            >
              <SelectTrigger className="border-l px-3 h-full">
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
      </div>
      {!isPlot && !isLand && (
        <div className="space-y-4">
          <Label className="text-lg font-medium">Facilities</Label>
          <p className="text-sm text-gray-600">
            Available facilities in the property
          </p>
          <div className="grid grid-cols-3 gap-4">
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
                  className="text-sm  font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
            <Label className="text-base font-medium">Possession Status</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex gap-4">
            {["immediate", "future"].map((status) => (
              <Button
                key={status}
                type="button"
                variant="outline"
                onClick={() => setValue("possessionStatus", status)}
                className={`px-6 py-3 capitalize ${
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
            <Label className="text-base font-medium">Investor Property</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex gap-4">
            {["yes", "no"].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                onClick={() => setValue("investorProperty", val)}
                className={`px-8 py-3 capitalize ${
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
          <Label className="text-base font-medium">Loan Facility</Label>
          <span className="text-red-500">*</span>
        </div>
        <div className="flex gap-4">
          {["yes", "no"].map((val) => (
            <Button
              key={val}
              type="button"
              variant="outline"
              onClick={() => setValue("loanFacility", val)}
              className={`px-8 py-3 capitalize ${
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
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Add Additional Details</h3>
        <div className="space-y-4">
          <Label className="text-base font-medium">Facing</Label>
          <div className="grid grid-cols-4 gap-4">
            {facingOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={facing === option ? "default" : "outline"}
                onClick={() => setValue("facing", option)}
                className={`px-8 py-3 capitalize ${
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
        {!isPlot && !isLand && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Car Parking</Label>
            <div className="flex gap-4 flex-wrap">
              {parkingOptions.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={carParking === option ? "default" : "outline"}
                  onClick={() => setValue("carParking", option)}
                  className={`w-16 h-12 capitalize ${
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
              <input
                type="number"
                placeholder="Custom Car Parking"
                className="border p-2 rounded w-full"
                onChange={(e) => setValue("customCarParking", e.target.value)}
              />
            )}
          </div>
        )}
        {!isPlot && !isLand && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Bike Parking</Label>
            <div className="flex gap-4 flex-wrap">
              {parkingOptions.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={bikeParking === option ? "default" : "outline"}
                  onClick={() => setValue("bikeParking", option)}
                  className={`w-16 h-12 capitalize ${
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
              <input
                type="number"
                placeholder="Custom Bike Parking"
                className="border p-2 rounded w-full"
                onChange={(e) => setValue("customBikeParking", e.target.value)}
              />
            )}
          </div>
        )}
        {!isPlot && !isLand && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Open Parking</Label>
            <div className="flex gap-4 flex-wrap">
              {parkingOptions.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={openParking === option ? "default" : "outline"}
                  onClick={() => setValue("openParking", option)}
                  className={`w-16 h-12 capitalize ${
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
              <input
                type="number"
                placeholder="Custom Open Parking"
                className="border p-2 rounded w-full"
                onChange={(e) => setValue("customOpenParking", e.target.value)}
              />
            )}
          </div>
        )}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="text-base font-medium">
              Around This Property
            </Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register("nearbyPlace")}
              placeholder="Place around Property"
            />
            <div className="flex gap-2">
              <Input
                {...register("distanceFromProperty")}
                placeholder="Distance from property"
                type="number"
                min={0}
              />
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="w-[80px]">
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
                className="px-6 bg-[#1D3A76] hover:bg-blue-800"
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
                className="flex justify-between items-center border p-2 rounded"
              >
                <span className="font-semibold">{place}</span>
                <div className="flex items-center gap-5">
                  <span className="bg-blue-900 rounded-lg p-2 text-white">
                    {formatDistance(distance)}
                  </span>
                  <Trash
                    className="cursor-pointer text-red-500 hover:text-red-700"
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
              <Label className="text-base font-medium">Servant Room?</Label>
              <span className="text-red-500">*</span>
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={servantRoom === "yes" ? "default" : "outline"}
                onClick={() => setValue("servantRoom", "yes")}
                className="px-8 py-3"
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={servantRoom === "no" ? "default" : "outline"}
                onClick={() => setValue("servantRoom", "no")}
                className="px-8 py-3"
              >
                No
              </Button>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Property Description</Label>
            <span className="text-red-500">*</span>
          </div>
          <Textarea
            {...register("propertyDescription")}
            placeholder="Property Description"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
