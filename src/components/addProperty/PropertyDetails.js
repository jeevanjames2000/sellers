import { useFormContext } from "react-hook-form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
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
  HomeIcon,
  ShoppingCart,
  Tractor,
  IndianRupee,
  Hotel,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useRef } from "react";
import { updatePropertyDetails } from "@/store/slices/addPropertySlice/propertyDetailsSlice";
import _ from "lodash";
export default function PropertyDetails() {
  const { register, watch, setValue, getValues, reset } = useFormContext();
  const data = useSelector((state) => state.propertyDetails);
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.propertyDetails, shallowEqual);
  const formValues = watch();
  useEffect(() => {
    reset(reduxData);
  }, [reset, reduxData]);
  const debouncedDispatch = useRef(
    _.debounce((values) => {
      dispatch(updatePropertyDetails(values));
    }, 300)
  ).current;
  useEffect(() => {
    debouncedDispatch(formValues);
    return () => debouncedDispatch.cancel();
  }, [formValues, debouncedDispatch]);
  const propertySubtype = watch("propertySubtype");
  const constructionStatus = watch("constructionStatus");
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
      icon: ShoppingCart,
    },
    { id: "out_rate_sale", label: "Out Rate Sale", icon: IndianRupee },
    { id: "farm_land", label: "Farm Land", icon: Tractor },
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
            return (
              <Button
                key={type.id}
                type="button"
                variant={propertySubtype === type.id ? "default" : "outline"}
                onClick={() => setValue("propertySubtype", type.id)}
                className="h-20 flex flex-col items-center justify-center space-y-2 text-xs"
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
              return (
                <Button
                  key={type.id}
                  type="button"
                  variant={propertySubtype === type.id ? "default" : "outline"}
                  onClick={() => setValue("propertySubtype", type.id)}
                  className="h-20 flex flex-col items-center justify-center space-y-2 text-xs"
                >
                  <IconComponent className="w-6 h-6" />
                  <span>{type.label}</span>
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
            <Button
              type="button"
              variant={
                constructionStatus === "ready-to-move" ? "default" : "outline"
              }
              onClick={() => setValue("constructionStatus", "ready-to-move")}
              className="px-6 py-3"
            >
              Ready to move
            </Button>
            <Button
              type="button"
              variant={
                constructionStatus === "under-construction"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setValue("constructionStatus", "under-construction")
              }
              className="px-6 py-3"
            >
              Under Construction
            </Button>
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
                variant={bhk === option ? "default" : "outline"}
                onClick={() => setValue("bhk", option)}
                className="px-4 py-3"
              >
                {option}
              </Button>
            ))}
          </div>
          {bhk === "4+ BHK" && (
            <input
              type="number"
              placeholder="Enter BHK"
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
                variant={bathroom === option ? "default" : "outline"}
                onClick={() => setValue("bathroom", option)}
                className="w-16 h-12"
              >
                {option}
              </Button>
            ))}
          </div>
          {bathroom === "4+" && (
            <input
              type="number"
              placeholder="Enter Bathrooms"
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
                variant={balcony === option ? "default" : "outline"}
                onClick={() => setValue("balcony", option)}
                className="w-16 h-12"
              >
                {option}
              </Button>
            ))}
          </div>
          {balcony === "4+" && (
            <input
              type="number"
              placeholder="Enter Balconies"
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
                variant={furnishType === option ? "default" : "outline"}
                onClick={() => setValue("furnishType", option)}
                className="px-6 py-3"
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
          <Select onValueChange={(value) => setValue("areaUnit", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sq.ft" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sqft">Sq.ft</SelectItem>
              <SelectItem value="sqm">Sq.m</SelectItem>
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
        <div className="space-y-2">
          <Label>Carpet Area (Sq.ft)</Label>
          <Input {...register("carpetArea")} placeholder="Carpet Area" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Total Project Area (Acres)</Label>
            <span className="text-red-500">*</span>
          </div>
          <Input
            {...register("totalProjectArea")}
            placeholder="Enter Total Project Area"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Unit Cost (₹)</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ₹
            </span>
            <Input
              {...register("unitCost")}
              placeholder="Unit Cost"
              className="pl-8"
            />
          </div>
        </div>
        {(isIndependentHouse || isIndependentVilla) && (
          <div className="space-y-2">
            <Label>Pent House</Label>
            <Input {...register("pentHouse")} placeholder="Pent House" />
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Property Cost</Label>
            <span className="text-red-500">*</span>
          </div>
          <Input {...register("propertyCost")} placeholder="Property Cost" />
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
                  className="border-gray-500"
                />
                <label
                  htmlFor={facility}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
            <Button
              type="button"
              variant={possessionStatus === "immediate" ? "default" : "outline"}
              onClick={() => setValue("possessionStatus", "immediate")}
              className="px-6 py-3"
            >
              Immediate
            </Button>
            <Button
              type="button"
              variant={possessionStatus === "future" ? "default" : "outline"}
              onClick={() => setValue("possessionStatus", "future")}
              className="px-6 py-3"
            >
              Future
            </Button>
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
            <Button
              type="button"
              variant={investorProperty === "yes" ? "default" : "outline"}
              onClick={() => setValue("investorProperty", "yes")}
              className="px-8 py-3"
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={investorProperty === "no" ? "default" : "outline"}
              onClick={() => setValue("investorProperty", "no")}
              className="px-8 py-3"
            >
              No
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-base font-medium">Loan Facility</Label>
          <span className="text-red-500">*</span>
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={loanFacility === "yes" ? "default" : "outline"}
            onClick={() => setValue("loanFacility", "yes")}
            className="px-8 py-3"
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={loanFacility === "no" ? "default" : "outline"}
            onClick={() => setValue("loanFacility", "no")}
            className="px-8 py-3"
          >
            No
          </Button>
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
                className="py-3"
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
                  className="w-16 h-12"
                >
                  {option}
                </Button>
              ))}
            </div>
            {carParking === "4+" && (
              <input
                type="number"
                placeholder="Enter Car Parking"
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
                  className="w-16 h-12"
                >
                  {option}
                </Button>
              ))}
            </div>
            {bikeParking === "4+" && (
              <input
                type="number"
                placeholder="Enter Bike Parking"
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
                  className="w-16 h-12"
                >
                  {option}
                </Button>
              ))}
            </div>
            {openParking === "4+" && (
              <input
                type="number"
                placeholder="Enter Open Parking"
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
              />
              <Button
                type="button"
                className="px-6 bg-blue-700 hover:bg-blue-800"
              >
                + Add
              </Button>
            </div>
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
