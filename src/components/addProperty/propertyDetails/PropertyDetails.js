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
import { formatCurrencyInWords } from "@/components/shared/formatCurrencyInWords";
import DatePicker from "@/components/ui/date-picker";
export default function PropertyDetails({
  property,
  setProperty,
  unique_property_id,
  places,
  setPlaces,
  fac,
  setFac,
}) {
  const { register, watch, setValue, getValues } = useFormContext();
  const formValues = watch();
  const propertySubtype = watch("sub_type");
  const isRent = formValues?.property_for === "Rent";
  const isSell = formValues?.property_for === "Sell";
  const isResidential = formValues?.property_in === "Residential";
  const isCommercial = formValues?.property_in === "Commercial";
  const [unit, setUnit] = useState("M");
  const [carCustomMode, setCarCustomMode] = useState(false);
  const [bikeCustomMode, setBikeCustomMode] = useState(false);
  const [openCustomMode, setOpenCustomMode] = useState(false);
  const [bathroomCustom, setBathroomCustom] = useState(false);
  const [balconyCustom, setBalconyCustom] = useState(false);
  const [bhkCustom, setBhkCustom] = useState(false);
  const [constructionEndDate, setConstructionEndDate] = useState(
    watch("under_construction") ? new Date(watch("under_construction")) : null
  );
  const handleConstructionEndDateChange = (selectedDates) => {
    const dateObj = selectedDates[0];
    let formatted = null;
    if (dateObj instanceof Date && !isNaN(dateObj)) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      formatted = `${year}-${month}-${day}`;
    }
    setConstructionEndDate(dateObj || null);
    setValue("under_construction", formatted, { shouldDirty: true });
  };
  const watchedFields = {
    security_deposit: watch("security_deposit"),
    under_construction: watch("under_construction"),
    lock_in: watch("lock_in"),
    land_sub_type: watch("land_sub_type"),
    brokerage_charge: watch("brokerage_charge"),
    property_cost: watch("property_cost"),
    types: watch("types"),
    occupancy: watch("occupancy"),
    pent_house: watch("pent_house"),
    loan_facility: watch("loan_facility"),
    investor_property: watch("investor_property"),
    servant_room: watch("servant_room"),
    facing: watch("facing"),
    car_parking: watch("car_parking"),
    bike_parking: watch("bike_parking"),
    open_parking: watch("open_parking"),
    bedrooms: watch("bedrooms"),
    bathroom: watch("bathroom"),
    balconies: watch("balconies"),
    furnished_status: watch("furnished_status"),
    possession_status: watch("possession_status"),
    facilities: watch("facilities") || [],
    area_units: watch("area_units"),
    nearbyPlace: watch("nearbyPlace"),
    distanceFromProperty: watch("distanceFromProperty"),
    rera_approved: watch("rera_approved"),
    ownership_type: watch("ownership_type"),
    property_age: watch("property_age"),
    passenger_lifts: watch("passenger_lifts"),
    service_lifts: watch("service_lifts"),
    stair_cases: watch("stair_cases"),
    private_parking: watch("private_parking"),
    public_parking: watch("public_parking"),
    private_washrooms: watch("private_washrooms"),
    public_washrooms: watch("public_washrooms"),
    unit_flat_house_no: watch("unit_flat_house_no"),
    plot_number: watch("plot_number"),
    zoneType: watch("zoneType"),
    suitable: watch("suitable"),
    pantry_room: watch("pantry_room"),
  };
  const fieldVisibility = {
    ...(isResidential &&
      isSell && {
        Apartment: {
          rera_approved: true,
          occupancy: true,
          bedrooms: true,
          bathroom: true,
          balconies: true,
          furnished_status: true,
          property_age: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          total_project_area: true,
          builtup_unit: true,
          property_cost: true,
          facilities: true,
          investor_property: true,
          loan_facility: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          servant_room: true,
          description: true,
          unit_flat_house_no: true,
        },
        "Independent House": {
          rera_approved: true,
          occupancy: true,
          bedrooms: true,
          bathroom: true,
          balconies: true,
          furnished_status: true,
          property_age: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          total_project_area: true,
          builtup_unit: true,
          pent_house: true,
          property_cost: true,
          facilities: true,
          loan_facility: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          servant_room: true,
          description: true,
          unit_flat_house_no: true,
        },
        "Independent Villa": {
          rera_approved: true,
          occupancy: true,
          bathroom: true,
          balconies: true,
          furnished_status: true,
          property_age: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          total_project_area: true,
          builtup_unit: true,
          pent_house: true,
          property_cost: true,
          facilities: true,
          investor_property: true,
          loan_facility: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          servant_room: true,
          description: true,
          unit_flat_house_no: true,
        },
        Plot: {
          rera_approved: true,
          property_age: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          total_project_area: true,
          builtup_unit: true,
          property_cost: true,
          possession_status: true,
          investor_property: true,
          loan_facility: true,
          facing: true,
          around_places: true,
          description: true,
          plot_number: true,
        },
        Land: {
          rera_approved: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          total_project_area: true,
          builtup_unit: true,
          property_cost: true,
          possession_status: true,
          loan_facility: true,
          facing: true,
          around_places: true,
          description: true,
          plot_number: true,
          land_sub_type: true,
        },
      }),
    ...(isCommercial &&
      isSell && {
        Office: {
          rera_approved: true,
          occupancy: true,
          passenger_lifts: true,
          service_lifts: true,
          stair_cases: true,
          private_parking: true,
          public_parking: true,
          private_washrooms: true,
          public_washrooms: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          total_project_area: true,
          builtup_unit: true,
          property_cost: true,
          ownership_type: true,
          facilities: true,
          unit_flat_house_no: true,
          zoneType: true,
          loan_facility: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          pantry_room: true,
          description: true,
        },
        "Retail Shop": {
          rera_approved: true,
          occupancy: true,
          passenger_lifts: true,
          service_lifts: true,
          stair_cases: true,
          private_parking: true,
          public_parking: true,
          private_washrooms: true,
          public_washrooms: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          total_project_area: true,
          builtup_unit: true,
          property_cost: true,
          ownership_type: true,
          facilities: true,
          unit_flat_house_no: true,
          suitable: true,
          loan_facility: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          description: true,
        },
        "Show Room": {
          rera_approved: true,
          occupancy: true,
          passenger_lifts: true,
          service_lifts: true,
          stair_cases: true,
          private_parking: true,
          public_parking: true,
          private_washrooms: true,
          public_washrooms: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          total_project_area: true,
          builtup_unit: true,
          property_cost: true,
          ownership_type: true,
          facilities: true,
          unit_flat_house_no: true,
          suitable: true,
          loan_facility: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          pantry_room: true,
          description: true,
        },
        Warehouse: {
          rera_approved: true,
          occupancy: true,
          area_units: true,
          plot_area: true,
          total_project_area: true,
          builtup_unit: true,
          property_cost: true,
          ownership_type: true,
          unit_flat_house_no: true,
          zoneType: true,
          loan_facility: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          description: true,
        },
        Plot: {
          rera_approved: true,
          area_units: true,
          length_area: true,
          width_area: true,
          plot_area: true,
          total_project_area: true,
          builtup_unit: true,
          property_cost: true,
          possession_status: true,
          ownership_type: true,
          unit_flat_house_no: true,
          suitable: true,
          investor_property: true,
          loan_facility: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          description: true,
        },
        Others: {
          rera_approved: true,
          occupancy: true,
          area_units: true,
          plot_area: true,
          total_project_area: true,
          builtup_unit: true,
          property_cost: true,
          ownership_type: true,
          unit_flat_house_no: true,
          suitable: true,
          loan_facility: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          pantry_room: true,
          description: true,
        },
      }),
    ...(isResidential &&
      isRent && {
        Apartment: {
          bedrooms: true,
          bathroom: true,
          balconies: true,
          furnished_status: true,
          available_from: true,
          monthly_rent: true,
          maintenance: true,
          security_deposit: true,
          lock_in: true,
          brokerage_charge: true,
          types: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          total_project_area: true,
          facilities: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          servant_room: true,
          description: true,
          unit_flat_house_no: true,
        },
        "Independent House": {
          bedrooms: true,
          furnished_status: true,
          available_from: true,
          bathroom: true,
          balconies: true,
          monthly_rent: true,
          maintenance: true,
          security_deposit: true,
          lock_in: true,
          brokerage_charge: true,
          types: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          plot_area: true,
          total_project_area: true,
          pent_house: true,
          facilities: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          servant_room: true,
          description: true,
          unit_flat_house_no: true,
        },
        "Independent Villa": {
          bedrooms: true,
          furnished_status: true,
          bathroom: true,
          balconies: true,
          available_from: true,
          monthly_rent: true,
          maintenance: true,
          security_deposit: true,
          lock_in: true,
          brokerage_charge: true,
          types: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          plot_area: true,
          total_project_area: true,
          pent_house: true,
          facilities: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          servant_room: true,
          description: true,
          unit_flat_house_no: true,
        },
        Plot: {
          available_from: true,
          monthly_rent: true,
          maintenance: true,
          security_deposit: true,
          lock_in: true,
          brokerage_charge: true,
          types: true,
          area_units: true,
          length_area: true,
          width_area: true,
          plot_area: true,
          total_project_area: true,
          facing: true,
          around_places: true,
          description: true,
          plot_number: true,
        },
        Land: {
          available_from: true,
          monthly_rent: true,
          maintenance: true,
          security_deposit: true,
          lock_in: true,
          brokerage_charge: true,
          types: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          length_area: true,
          width_area: true,
          total_project_area: true,
          facing: true,
          around_places: true,
          description: true,
          plot_number: true,
          land_sub_type: true,
        },
      }),
    ...(isCommercial &&
      isRent && {
        Office: {
          passenger_lifts: true,
          service_lifts: true,
          stair_cases: true,
          private_parking: true,
          public_parking: true,
          private_washrooms: true,
          public_washrooms: true,
          available_from: true,
          monthly_rent: true,
          maintenance: true,
          security_deposit: true,
          lock_in: true,
          brokerage_charge: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          total_project_area: true,
          facilities: true,
          unit_flat_house_no: true,
          zoneType: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          pantry_room: true,
          description: true,
        },
        "Retail Shop": {
          passenger_lifts: true,
          service_lifts: true,
          stair_cases: true,
          private_parking: true,
          public_parking: true,
          private_washrooms: true,
          public_washrooms: true,
          available_from: true,
          monthly_rent: true,
          maintenance: true,
          security_deposit: true,
          lock_in: true,
          brokerage_charge: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          total_project_area: true,
          facilities: true,
          unit_flat_house_no: true,
          suitable: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          description: true,
        },
        "Show Room": {
          passenger_lifts: true,
          service_lifts: true,
          stair_cases: true,
          private_parking: true,
          public_parking: true,
          private_washrooms: true,
          public_washrooms: true,
          available_from: true,
          monthly_rent: true,
          maintenance: true,
          security_deposit: true,
          lock_in: true,
          brokerage_charge: true,
          area_units: true,
          builtup_area: true,
          carpet_area: true,
          total_project_area: true,
          facilities: true,
          unit_flat_house_no: true,
          suitable: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          pantry_room: true,
          description: true,
        },
        Warehouse: {
          available_from: true,
          monthly_rent: true,
          maintenance: true,
          security_deposit: true,
          lock_in: true,
          brokerage_charge: true,
          area_units: true,
          plot_area: true,
          total_project_area: true,
          unit_flat_house_no: true,
          zoneType: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          description: true,
        },
        Plot: {
          available_from: true,
          monthly_rent: true,
          maintenance: true,
          security_deposit: true,
          lock_in: true,
          brokerage_charge: true,
          area_units: true,
          length_area: true,
          width_area: true,
          plot_area: true,
          total_project_area: true,
          unit_flat_house_no: true,
          suitable: true,
          facing: true,
          around_places: true,
          description: true,
        },
        Others: {
          available_from: true,
          monthly_rent: true,
          maintenance: true,
          security_deposit: true,
          lock_in: true,
          brokerage_charge: true,
          area_units: true,
          plot_area: true,
          total_project_area: true,
          unit_flat_house_no: true,
          suitable: true,
          facing: true,
          car_parking: true,
          bike_parking: true,
          open_parking: true,
          around_places: true,
          pantry_room: true,
          description: true,
        },
      }),
  };
  const isFieldVisible = (field) => {
    return fieldVisibility[propertySubtype]?.[field] || false;
  };
  function formatDistance(meters) {
    if (meters < 1000) return `${meters}m`;
    const km = meters / 1000;
    return km % 1 === 0 ? `${km}km` : `${km.toFixed(1)}km`;
  }
  const handleAdd = () => {
    const distNum = Number(watchedFields.distanceFromProperty);
    if (!watchedFields.nearbyPlace?.trim() || !distNum || isNaN(distNum))
      return;
    const distInMeters = unit === "KM" ? distNum * 1000 : distNum;
    setPlaces((prev) => [
      ...prev,
      { place: watchedFields.nearbyPlace.trim(), distance: distInMeters },
    ]);
    setValue("nearbyPlace", "");
    setValue("distanceFromProperty", "");
  };
  const handleDelete = async (placeid) => {
    if (placeid) {
      await deleteAroundProperty(placeid, unique_property_id);
    }
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
    { id: "Warehouse", label: "Warehouse", icon: Landmark },
    { id: "Plot", label: "Plot", icon: MapPin },
    { id: "Others", label: "Others", icon: MapPin },
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
  const ownershipOptions = [
    "Freehold",
    "Leasehold",
    "Cooperative society",
    "Power of attorney",
  ];
  const tenantTypeOptions = [
    "Anyone",
    "Family",
    "Bachelors",
    "Single Men",
    "Single Women",
  ];
  const zoneTypeOptions = [
    "Industrial",
    "Commercial",
    "Special Economic Zone",
    "Open Spaces",
    "Agriculture Zone",
    "Others",
  ];
  const suitableOptions = [
    "Jewellery",
    "Gym",
    "Grocery",
    "Clinic",
    "Footwear",
    "Electronics",
    "Clothing",
    "Others",
  ];
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
  }, [getValues, setFac]);
  useEffect(() => {
    const cleanedString = fac.join(", ");
    setValue("facilities", cleanedString, { shouldDirty: true });
  }, [fac, setValue]);
  const handleFacilityChange = (facility, checked) => {
    setFac((prev) => {
      let updated = [...prev];
      if (facility === "None" && checked) return ["None"];
      updated = updated.filter((f) => f !== "None");
      if (checked && !updated.includes(facility)) updated.push(facility);
      else if (!checked) updated = updated.filter((f) => f !== facility);
      return updated;
    });
  };
  useEffect(() => {
    const config = [
      {
        value: watchedFields.car_parking,
        key: "car_parking",
        setCustom: setCarCustomMode,
        rawValue: property?.car_parking,
      },
      {
        value: watchedFields.bike_parking,
        key: "bike_parking",
        setCustom: setBikeCustomMode,
        rawValue: property?.bike_parking,
      },
      {
        value: watchedFields.open_parking,
        key: "open_parking",
        setCustom: setOpenCustomMode,
        rawValue: property?.open_parking,
      },
      {
        value: watchedFields.bedrooms,
        key: "bedrooms",
        setCustom: setBhkCustom,
        rawValue: property?.bedrooms,
      },
      {
        value: watchedFields.bathroom,
        key: "bathroom",
        setCustom: setBathroomCustom,
        rawValue: property?.bathroom,
      },
      {
        value: watchedFields.balconies,
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
    watchedFields.car_parking,
    watchedFields.bike_parking,
    watchedFields.open_parking,
    watchedFields.bedrooms,
    watchedFields.bathroom,
    watchedFields.balconies,
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
      case "under_construction":
        return value ? value : null;
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
  }, [propertySubtype, setValue]);
  useEffect(() => {
    if (property && property.id) {
      Object.entries(property).forEach(([key, value]) => {
        const formattedVal = formatFieldValue(key, value);
        setValue(key, formattedVal ?? "");
      });
      if (property.under_construction) {
        setConstructionEndDate(new Date(property.under_construction));
      }
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ placeid, unique_property_id }),
        }
      );
      const data = await res.json();
      if (!res.ok) console.error("Failed to delete place:", data);
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };
  const [startDate, setStartDate] = useState(
    watch("available_from") ? new Date(watch("available_from")) : null
  );
  const handleStartDateChange = (selectedDates) => {
    const dateObj = selectedDates[0];
    let formatted = null;
    if (dateObj instanceof Date && !isNaN(dateObj)) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      formatted = `${year}-${month}-${day}`;
    }
    setStartDate(dateObj || null);
    setValue("available_from", formatted || null);
  };
  return (
    <div className="space-y-8 sm:space-y-2 gap-4">
      {!isCommercial && (
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
      {isCommercial && (
        <div className="space-y-4 mb-4">
          <div className="flex items-center gap-2">
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
      {isFieldVisible("land_sub_type") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Land Sub Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {landSubtypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = watchedFields.land_sub_type === type.id;
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
      {isFieldVisible("rera_approved") && (
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
                  watchedFields.rera_approved === val
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
      {isFieldVisible("occupancy") && (
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
                onClick={() => {
                  setValue("occupancy", status);
                  if (status !== "Under Construction") {
                    setValue("under_construction", null);
                    setConstructionEndDate(null);
                  }
                }}
                className={`px-4 sm:px-6 py-3 ${
                  watchedFields.occupancy === status
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {status}
              </Button>
            ))}
          </div>
          {watchedFields.occupancy === "Under Construction" && (
            <div className="space-y-2 mt-4">
              <Label>
                Possession End Date <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                id="constructionEndDate"
                onChange={handleConstructionEndDateChange}
                defaultDate={constructionEndDate}
                placeholder="Select possession end date"
              />
            </div>
          )}
        </div>
      )}
      {(isFieldVisible("passenger_lifts") ||
        isFieldVisible("service_lifts") ||
        isFieldVisible("stair_cases")) && (
        <>
          <Label className="text-base sm:text-lg font-medium mt-10">
            Lifts & Stair Cases
          </Label>
          <div className="grid grid-cols-1 lg:grid-cols-3 mb-4 gap-4 sm:gap-6">
            {isFieldVisible("passenger_lifts") && (
              <div className="space-y-2">
                <Label>
                  Passenger Lifts <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("passenger_lifts", {
                    required: "Passenger lifts is required",
                  })}
                  placeholder="Enter Passenger lifts"
                  className="w-full"
                />
              </div>
            )}
            {isFieldVisible("service_lifts") && (
              <div className="space-y-2">
                <Label>
                  Service Lifts <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("service_lifts", {
                    required: "Service lifts is required",
                  })}
                  placeholder="Enter Service lifts"
                  className="w-full"
                />
              </div>
            )}
            {isFieldVisible("stair_cases") && (
              <div className="space-y-2">
                <Label>
                  Stair Cases <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("stair_cases", {
                    required: "Stair Cases is required",
                  })}
                  placeholder="Enter Stair cases"
                  className="w-full"
                />
              </div>
            )}
          </div>
        </>
      )}
      {(isFieldVisible("private_parking") ||
        isFieldVisible("public_parking")) && (
        <>
          <Label className="text-base sm:text-lg font-medium mt-10">
            Parking
          </Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 mb-4 gap-4 sm:gap-6">
            {isFieldVisible("private_parking") && (
              <div className="space-y-2">
                <Label>
                  Private Parking <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("private_parking", {
                    required: "Private parking is required",
                  })}
                  placeholder="Enter Private parking"
                  className="w-full"
                />
              </div>
            )}
            {isFieldVisible("public_parking") && (
              <div className="space-y-2">
                <Label>
                  Public Parking <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("public_parking", {
                    required: "Public parking is required",
                  })}
                  placeholder="Enter Public parking"
                  className="w-full"
                />
              </div>
            )}
          </div>
        </>
      )}
      {(isFieldVisible("private_washrooms") ||
        isFieldVisible("public_washrooms")) && (
        <>
          <Label className="text-base sm:text-lg font-medium mt-10">
            Washrooms
          </Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 mb-4 gap-4 sm:gap-6">
            {isFieldVisible("private_washrooms") && (
              <div className="space-y-2">
                <Label>
                  Private Washrooms <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("private_washrooms", {
                    required: "Private washrooms is required",
                  })}
                  placeholder="Enter Private washrooms"
                  className="w-full"
                />
              </div>
            )}
            {isFieldVisible("public_washrooms") && (
              <div className="space-y-2">
                <Label>
                  Public Washrooms <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("public_washrooms", {
                    required: "Public washrooms is required",
                  })}
                  placeholder="Enter Public washrooms"
                  className="w-full"
                />
              </div>
            )}
          </div>
        </>
      )}
      {isFieldVisible("bedrooms") && (
        <div className="space-y-4">
          <Label>BHK</Label>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
            {bhkOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={
                  watchedFields.bedrooms === option ||
                  (bhkCustom && option === "4+ BHK")
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
                  watchedFields.bedrooms === option ||
                  (bhkCustom && option === "4+ BHK")
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
      {isFieldVisible("bathroom") && (
        <div className="space-y-4">
          <Label>Bathroom</Label>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
            {bathroomOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={
                  watchedFields.bathroom === option ||
                  (bathroomCustom && option === "4+")
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
                  watchedFields.bathroom === option ||
                  (bathroomCustom && option === "4+")
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
      {isFieldVisible("balconies") && (
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
                  watchedFields.balconies === option ||
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
                  watchedFields.balconies === option ||
                  (balconyCustom && option === "4+")
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
      {isFieldVisible("furnished_status") && (
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
                  watchedFields.furnished_status === option
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
      {isFieldVisible("property_age") && (
        <div className="space-y-2">
          <Label>Age of Property</Label>
          <Select
            value={watchedFields.property_age}
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
      {isFieldVisible("available_from") && (
        <div className="space-y-2">
          <Label>
            Available from <span className="text-red-500">*</span>
          </Label>
          <DatePicker
            id="startDate"
            onChange={handleStartDateChange}
            defaultDate={startDate}
            placeholder="Select start date"
          />
        </div>
      )}
      {(isFieldVisible("monthly_rent") || isFieldVisible("maintenance")) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 sm:gap-6">
          {isFieldVisible("monthly_rent") && (
            <div className="space-y-2">
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
          )}
          {isFieldVisible("maintenance") && (
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
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 sm:gap-6">
        {isFieldVisible("area_units") && (
          <div className="space-y-2">
            <Label>Area units</Label>
            <Select
              value={normalizeAreaUnit(watchedFields.area_units)}
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
        )}
        {isFieldVisible("builtup_area") && (
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
        )}
        {isFieldVisible("carpet_area") && (
          <div className="space-y-2">
            <Label>Carpet Area (Sq.ft)</Label>
            <Input
              {...register("carpet_area")}
              placeholder="Carpet Area"
              className="bg-white w-full"
            />
          </div>
        )}
        {isFieldVisible("plot_area") && (
          <div className="space-y-2">
            <Label>Plot Area (Sq.yd)</Label>
            <Input
              {...register("plot_area")}
              placeholder="Plot Area"
              className="w-full"
            />
          </div>
        )}
        {isFieldVisible("length_area") && (
          <div className="space-y-2">
            <Label>Length Area (Sq.ft)</Label>
            <Input
              {...register("length_area")}
              placeholder="Length Area"
              className="w-full"
            />
          </div>
        )}
        {isFieldVisible("width_area") && (
          <div className="space-y-2">
            <Label>Width Area (Sq.ft)</Label>
            <Input
              {...register("width_area")}
              placeholder="Width Area"
              className="w-full"
            />
          </div>
        )}
        {isFieldVisible("total_project_area") && (
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
        )}
        {isFieldVisible("builtup_unit") && (
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
        )}
        {isFieldVisible("property_cost") && (
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
            {watchedFields.property_cost &&
              !isNaN(watchedFields.property_cost) && (
                <p className="text-sm text-gray-500 italic mt-1">
                  {formatCurrencyInWords(watchedFields.property_cost)}
                </p>
              )}
          </div>
        )}
        {isFieldVisible("pent_house") && (
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
                      watchedFields.pent_house === mappedValue
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
      </div>
      {isFieldVisible("security_deposit") && (
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
                  watchedFields.security_deposit === item
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
      {isFieldVisible("lock_in") && (
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
                  watchedFields.lock_in === item
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
      {isFieldVisible("brokerage_charge") && (
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
                  watchedFields.brokerage_charge === item
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
      {isFieldVisible("types") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Preferred Tenant Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
            {tenantTypeOptions.map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                onClick={() => setValue("types", item)}
                className={`px-3 sm:px-6 py-3 text-xs sm:text-sm capitalize ${
                  watchedFields.types === item
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
      {isFieldVisible("ownership_type") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Ownership</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {ownershipOptions.map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                onClick={() => setValue("ownership_type", item)}
                className={`px-3 sm:px-6 py-3 text-xs sm:text-sm capitalize ${
                  watchedFields.ownership_type === item
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
      {isFieldVisible("facilities") && (
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
      {isFieldVisible("possession_status") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Possession Status</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {isRent
              ? ["Ready To Move In", "Available From"]
              : ["Immediate", "Future"].map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant="outline"
                    onClick={() => setValue("possession_status", status)}
                    className={`px-4 sm:px-6 py-3 capitalize ${
                      watchedFields.possession_status === status
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
      {isFieldVisible("investor_property") && (
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
                    watchedFields.investor_property === mappedValue
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
      {isFieldVisible("loan_facility") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Loan Facility</Label>
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
                  onClick={() => setValue("loan_facility", mappedValue)}
                  className={`px-6 sm:px-8 py-3 capitalize ${
                    watchedFields.loan_facility === mappedValue
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
        {isFieldVisible("facing") && (
          <div className="space-y-4">
            <Label>Facing</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-4">
              {facingOptions.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={
                    watchedFields.facing === option ? "default" : "outline"
                  }
                  onClick={() => setValue("facing", option)}
                  className={`px-3 sm:px-8 py-3 text-xs sm:text-sm capitalize ${
                    watchedFields.facing === option
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
        {isFieldVisible("unit_flat_house_no") && (
          <div className="space-y-2">
            <Label>
              Flat No <span className="text-red-500">*</span>
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
        {isFieldVisible("plot_number") && (
          <div className="space-y-2">
            <Label>
              Plot No <span className="text-red-500">*</span>
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
        )}
        {(isFieldVisible("zoneType") || isFieldVisible("suitable")) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {isFieldVisible("zoneType") && (
              <div className="space-y-2">
                <Label>Zone Type</Label>
                <Select onValueChange={(value) => setValue("zoneType", value)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zoneTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {isFieldVisible("suitable") && (
              <div className="space-y-2">
                <Label>Suitable</Label>
                <Select onValueChange={(value) => setValue("suitable", value)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Suitable" />
                  </SelectTrigger>
                  <SelectContent>
                    {suitableOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
        {(isFieldVisible("car_parking") ||
          isFieldVisible("bike_parking") ||
          isFieldVisible("open_parking")) && (
          <>
            {isFieldVisible("car_parking") && (
              <div className="space-y-4">
                <Label>Car Parking</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
                  {parkingOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={
                        watchedFields.car_parking === option ||
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
                        watchedFields.car_parking === option ||
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
            )}
            {isFieldVisible("bike_parking") && (
              <div className="space-y-4">
                <Label>Bike Parking</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
                  {parkingOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={
                        watchedFields.bike_parking === option ||
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
                        watchedFields.bike_parking === option ||
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
            )}
            {isFieldVisible("open_parking") && (
              <div className="space-y-4">
                <Label>Open Parking</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
                  {parkingOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={
                        watchedFields.open_parking === option ||
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
                        watchedFields.open_parking === option ||
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
                    placeholder="Enter custom open parking"
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
            )}
          </>
        )}
        {isFieldVisible("around_places") && (
          <div className="space-y-4">
            <Label className="text-base sm:text-lg font-medium">
              Around This Property
            </Label>
            <p className="text-xs sm:text-sm text-gray-600">
              Add details about places near this property
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label>Place</Label>
                <Input
                  {...register("nearbyPlace")}
                  placeholder="Eg: School, Hospital"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Distance from Property</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    {...register("distanceFromProperty")}
                    placeholder="Enter distance"
                    className="w-full"
                  />
                  <Select
                    value={unit}
                    onValueChange={(value) => setUnit(value)}
                    className="w-24"
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="M" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Meters</SelectItem>
                      <SelectItem value="KM">Kilometers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleAdd}
                  className="w-full sm:w-auto bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                >
                  Add Place
                </Button>
              </div>
            </div>
            {places.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium">Added Places</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {places.map((place, index) => (
                    <div
                      key={place.place_id || index}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium">{place.place}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistance(place.distance)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleDelete(place.place_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {(isFieldVisible("servant_room") || isFieldVisible("pantry_room")) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {isFieldVisible("servant_room") && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label>Servant Room</Label>
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
                        onClick={() => setValue("servant_room", mappedValue)}
                        className={`px-6 sm:px-8 py-3 capitalize ${
                          watchedFields.servant_room === mappedValue
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
            {isFieldVisible("pantry_room") && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label>Pantry Room</Label>
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
                        onClick={() => setValue("pantry_room", mappedValue)}
                        className={`px-6 sm:px-8 py-3 capitalize ${
                          watchedFields.pantry_room === mappedValue
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
          </div>
        )}
        {isFieldVisible("description") && (
          <div className="space-y-2">
            <Label>
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Enter property description"
              className="w-full h-32"
            />
          </div>
        )}
      </div>
    </div>
  );
}
