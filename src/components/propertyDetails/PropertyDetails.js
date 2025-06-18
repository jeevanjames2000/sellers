"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Building,
  ChevronUp,
  Droplet,
  Dumbbell,
  Landmark,
  Medal,
  MonitorCheck,
  PawPrint,
  Phone,
  ShieldCheck,
  Palmtree,
  Users,
  Waves,
  ArrowBigDown,
  Home,
  Pen,
  Shield,
  ShoppingBag,
  University,
  MapPinIcon,
  DollarSign,
  Bath,
  Table,
  Bed,
  PersonStanding,
  IndianRupee,
  DoorOpen,
  Ruler,
  Calendar,
  Car,
  Bike,
  ParkingCircle,
  Lock,
} from "lucide-react";
import {
  FaBorderAll,
  FaExpandArrowsAlt,
  FaDoorOpen,
  FaRupeeSign,
  FaRulerCombined,
  FaSchool,
  FaHospital,
  FaShoppingCart,
  FaPlane,
  FaTree,
  FaTrain,
  FaHotel,
  FaUniversity,
  FaBatteryFull,
  FaBicycle,
  FaChild,
  FaFilter,
  FaFireExtinguisher,
  FaLeaf,
  FaPlug,
  FaShuttleSpace,
  FaSolarPanel,
  FaToolbox,
  FaWater,
  FaWifi,
  FaBasketball,
} from "react-icons/fa6";
import { MdOutlineVerified, MdSportsFootball } from "react-icons/md";
import config from "../api/config";
import toast from "react-hot-toast";
const PropertyDetails = (initialPropertyId) => {
  const searchParams = useSearchParams();
  const modalRef = useRef(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [floorplan, setFloorPlan] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [aroundProperty, setAroundProperty] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const facilityIconMap = {
    Lift: <Building className="w-5 h-5" />,
    CCTV: <MonitorCheck className="w-5 h-5" />,
    Gym: <Dumbbell className="w-5 h-5" />,
    Garden: <Palmtree className="w-5 h-5" />,
    "Club House": <Users className="w-5 h-5" />,
    Sports: <Medal className="w-5 h-5" />,
    "Swimming Pool": <Waves className="w-5 h-5" />,
    Intercom: <Phone className="w-5 h-5" />,
    "Gated Community": <ShieldCheck className="w-5 h-5" />,
    "Regular Water": <Droplet className="w-5 h-5" />,
    "Community Hall": <Landmark className="w-5 h-5" />,
    "Pet Allowed": <PawPrint className="w-5 h-5" />,
    "Half Basket Ball Court": <FaBasketball className="w-5 h-5" />,
    "Power Backup": <FaBatteryFull className="w-5 h-5" />,
    "Entry / Exit": <FaDoorOpen className="w-5 h-5" />,
    "Badminton Court": <FaShuttleSpace className="w-5 h-5" />,
    "Children Play Area": <FaChild className="w-5 h-5" />,
    "Water Harvesting Pit": <FaWater className="w-5 h-5" />,
    "Water Softener": <FaFilter className="w-5 h-5" />,
    "Solar Fencing": <FaSolarPanel className="w-5 h-5" />,
    "Security Cabin": <Shield className="w-5 h-5" />,
    Lawn: <FaLeaf className="w-5 h-5" />,
    "Transformer Yard": <FaPlug className="w-5 h-5" />,
  };
  const fallbackIcons = [
    <FaWifi className="w-5 h-5" />,
    <FaBicycle className="w-5 h-5" />,
    <FaFireExtinguisher className="w-5 h-5" />,
    <FaToolbox className="w-5 h-5" />,
    <FaWater className="w-5 h-5" />,
    <FaSolarPanel className="w-5 h-5" />,
    <Shield className="w-5 h-5" />,
  ];
  const getFallbackIcon = (name) => {
    const hash = [...name].reduce(
      (acc, c, i) => acc + c.charCodeAt(0) * (i + 1),
      0
    );
    return fallbackIcons[hash % fallbackIcons.length];
  };
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyId = searchParams.get("Id");
        if (!propertyId) throw new Error("Property ID not found in URL");
        const response = await fetch(
          `https://api.meetowner.in/listings/getsingleproperty?unique_property_id=${propertyId}`
        );
        if (!response.ok) throw new Error("Failed to fetch property details");
        const data = await response.json();
        if (data?.property_details) {
          setProperty(data.property_details);
        } else {
          throw new Error("Invalid property data received");
        }
      } catch (err) {
        setError(err.message || "Failed to load property details");
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [searchParams]);
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (property?.unique_property_id) {
        try {
          const [floorPlansRes, imagesRes, aroundRes] = await Promise.all([
            fetch(
              `${config.api_url}/listings/v1/getAllFloorPlans/${property.unique_property_id}`
            ),
            fetch(
              `https://api.meetowner.in/property/getpropertyphotos?unique_property_id=${property.unique_property_id}`
            ),
            fetch(
              `${config.api_url}/listings/v1/getAroundThisProperty?id=${property.unique_property_id}`
            ),
          ]);
          const floorPlansData = await floorPlansRes.json();
          const imagesData = await imagesRes.json();
          const aroundData = await aroundRes.json();
          setFloorPlan(floorPlansData[0]);
          setImages(imagesData.images);
          setMainImage(imagesData.images[0]?.url);
          setAroundProperty(aroundData.results);
        } catch (error) {
          console.error("Error fetching property data:", error);
        }
      }
    };
    fetchPropertyData();
  }, [property?.unique_property_id]);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const formatToIndianCurrency = (value) => {
    if (!value || isNaN(value)) return "N/A";
    const numValue = parseFloat(value.toString());
    if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
    if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
    if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
    return numValue.toString();
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const getPlaceIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    const icons = {
      school: <FaSchool className="w-5 h-5" />,
      college: <FaSchool className="w-5 h-5" />,
      hospital: <FaHospital className="w-5 h-5" />,
      medical: <FaHospital className="w-5 h-5" />,
      market: <ShoppingBag className="w-5 h-5" />,
      mall: <ShoppingBag className="w-5 h-5" />,
      sports: <MdSportsFootball className="w-5 h-5" />,
      arena: <MdSportsFootball className="w-5 h-5" />,
      airport: <FaPlane className="w-5 h-5" />,
      travel: <FaPlane className="w-5 h-5" />,
      park: <FaTree className="w-5 h-5" />,
      zone: <FaTree className="w-5 h-5" />,
      railway: <FaTrain className="w-5 h-5" />,
      station: <FaTrain className="w-5 h-5" />,
      hotel: <FaHotel className="w-5 h-5" />,
      university: <University className="w-5 h-5" />,
    };
    return (
      Object.entries(icons).find(([key]) => lowerTitle.includes(key))?.[1] || (
        <MapPinIcon className="w-5 h-5" />
      )
    );
  };
  const formatDistance = (distance) => {
    const d = parseInt(distance.toString(), 10);
    if (isNaN(d)) return "";
    return d >= 1000 ? `${(d / 1000).toFixed(1)} km` : `${d} m`;
  };
  const formatValue = (value) => {
    if (!value) return "";
    return value % 1 === 0
      ? parseInt(value.toString())
      : parseFloat(value.toString()).toFixed(2).replace(/\.00$/, "");
  };
  const isResidential = property?.property_in === "Residential";
  const isCommercial = property?.property_in === "Commercial";
  const isRent = property?.property_for === "Rent";
  const isSell = property?.property_for === "Sell";
  const propertySubtype = property?.sub_type || "Apartment";

  const fieldVisibility = useMemo(
    () => ({
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
            length_area: true,
            builtup_unit: true,
            width_area: true,
            plot_area: true,
            total_project_area: true,
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
            length_area: true,
            builtup_unit: true,
            width_area: true,
            total_project_area: true,
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
            zone_types: true,
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
            zone_types: true,
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
            zone_types: true,
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
            zone_types: true,
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
    }),
    [isResidential, isCommercial, isRent, isSell]
  );
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleString("default", { month: "short", year: "numeric" });
  };
  const fieldConfigs = {
    monthly_rent: {
      label: "Expected Monthly Rent",
      value: (prop) => `₹ ${formatToIndianCurrency(prop.monthly_rent)}`,
      icon: <DollarSign className="w-5 h-5" />,
    },
    property_cost: {
      label: "Property Cost",
      value: (prop) => `₹ ${formatToIndianCurrency(prop.property_cost)}`,
      icon: <IndianRupee className="w-5 h-5" />,
    },
    bedrooms: {
      label: "Bedrooms",
      value: (prop) => prop.bedrooms,
      icon: <Bed className="w-5 h-5" />,
    },
    bathroom: {
      label: "Bathrooms",
      value: (prop) => prop.bathroom,
      icon: <Bath className="w-5 h-5" />,
    },
    balconies: {
      label: "Balconies",
      value: (prop) => prop.balconies,
      icon: <Home className="w-5 h-5" />,
    },
    types: {
      label: "Preferred Tenant",
      value: (prop) => prop.types,
      icon: <PersonStanding className="w-5 h-5" />,
    },
    furnished_status: {
      label: "Furnished Status",
      value: (prop) => prop.furnished_status,
      icon: <Table className="w-5 h-5" />,
    },
    total_project_area: {
      label: "Project Area",
      value: (prop) =>
        `${formatValue(prop.total_project_area)} ${
          prop.total_project_area_type || "Acres"
        }`,
      icon: <FaBorderAll className="w-5 h-5" />,
    },
    plot_area: {
      label: "Plot Area",
      value: (prop) =>
        `${formatValue(prop.plot_area)} ${prop.area_units || "Sq.yd"}`,
      icon: <ArrowBigDown className="w-5 h-5" />,
    },
    length_area: {
      label: "Dimensions",
      value: (prop) => (
        <span>
          <strong className="text-primary">L</strong>-
          {formatValue(prop.length_area)} x{" "}
          <strong className="text-primary">W</strong>-
          {formatValue(prop.width_area)}
        </span>
      ),
      icon: <FaRulerCombined className="w-5 h-5" />,
    },
    builtup_area: {
      label: "Built-up Area",
      value: (prop) =>
        `${formatValue(prop.builtup_area)} ${prop.area_units || "Sq.ft"}`,
      icon: <Home className="w-5 h-5" />,
    },
    carpet_area: {
      label: "Carpet Area",
      value: (prop) =>
        `${formatValue(prop.carpet_area)} ${prop.area_units || "Sq.ft"}`,
      icon: <Ruler className="w-5 h-5" />,
    },
    occupancy: {
      label: (prop) =>
        prop.occupancy === "Under Construction"
          ? "Possession Starts"
          : "Occupancy Status",
      value: (prop) =>
        ["Apartment", "Independent House", "Independent Villa"].includes(
          prop.sub_type
        )
          ? prop.occupancy === "Under Construction"
            ? `Under Construction${
                prop.under_construction
                  ? ` (${formatDate(prop.under_construction)})`
                  : ""
              }`
            : "Ready to Move"
          : "",
      icon: <DoorOpen className="w-5 h-5" />,
    },
    possession_status: {
      label: "Possession Status",
      value: (prop) =>
        prop.possession_status?.toLowerCase() === "immediate"
          ? "Immediate"
          : "Future",
      icon: <Calendar className="w-5 h-5" />,
    },
    available_from: {
      label: "Available From",
      value: (prop) => formatDate(prop.available_from),
      icon: <Calendar className="w-5 h-5" />,
    },
    maintenance: {
      label: "Maintenance (Monthly)",
      value: (prop) => `₹ ${formatToIndianCurrency(prop.maintenance)}`,
      icon: <IndianRupee className="w-5 h-5" />,
    },
    security_deposit: {
      label: "Security Deposit",
      value: (prop) => prop.security_deposit,
      icon: <Lock className="w-5 h-5" />,
    },
    lock_in: {
      label: "Lock-in Period",
      value: (prop) => prop.lock_in,
      icon: <Lock className="w-5 h-5" />,
    },
    brokerage_charge: {
      label: "Brokerage Charge",
      value: (prop) => prop.brokerage_charge,
      icon: <IndianRupee className="w-5 h-5" />,
    },
    facing: {
      label: "Facing",
      value: (prop) => prop.facing,
      icon: <Home className="w-5 h-5" />,
    },
    car_parking: {
      label: "Car Parking",
      value: (prop) => prop.car_parking,
      icon: <Car className="w-5 h-5" />,
    },
    bike_parking: {
      label: "Bike Parking",
      value: (prop) => prop.bike_parking,
      icon: <Bike className="w-5 h-5" />,
    },
    open_parking: {
      label: "Open Parking",
      value: (prop) => prop.open_parking,
      icon: <ParkingCircle className="w-5 h-5" />,
    },
    pent_house: {
      label: "Pent House",
      value: (prop) => prop.pent_house,
      icon: <Home className="w-5 h-5" />,
    },
    servant_room: {
      label: "Servant Room",
      value: (prop) => prop.servant_room,
      icon: <PersonStanding className="w-5 h-5" />,
    },
    pantry_room: {
      label: "Pantry Room",
      value: (prop) => prop.pantry_room,
      icon: <Home className="w-5 h-5" />,
    },
    passenger_lifts: {
      label: "Passenger Lifts",
      value: (prop) => prop.passenger_lifts,
      icon: <Building className="w-5 h-5" />,
    },
    service_lifts: {
      label: "Service Lifts",
      value: (prop) => prop.service_lifts,
      icon: <Building className="w-5 h-5" />,
    },
    stair_cases: {
      label: "Stair Cases",
      value: (prop) => prop.stair_cases,
      icon: <Home className="w-5 h-5" />,
    },
    private_parking: {
      label: "Private Parking",
      value: (prop) => prop.private_parking,
      icon: <Car className="w-5 h-5" />,
    },
    public_parking: {
      label: "Public Parking",
      value: (prop) => prop.public_parking,
      icon: <ParkingCircle className="w-5 h-5" />,
    },
    private_washrooms: {
      label: "Private Washrooms",
      value: (prop) => prop.private_washrooms,
      icon: <Bath className="w-5 h-5" />,
    },
    public_washrooms: {
      label: "Public Washrooms",
      value: (prop) => prop.public_washrooms,
      icon: <Bath className="w-5 h-5" />,
    },
    property_age: {
      label: "Property Age",
      value: (prop) => `${formatValue(prop.property_age)} Years`,
      icon: <Home className="w-5 h-5" />,
    },
    unit_flat_house_no: {
      label: "Unit/Flat/House No",
      value: (prop) => prop.unit_flat_house_no,
      icon: <Home className="w-5 h-5" />,
    },
    plot_number: {
      label: "Plot Number",
      value: (prop) => prop.plot_number,
      icon: <MapPinIcon className="w-5 h-5" />,
    },
    ownership_type: {
      label: "Ownership Type",
      value: (prop) => prop.ownership_type,
      icon: <Shield className="w-5 h-5" />,
    },
    zone_types: {
      label: "Zone Types",
      value: (prop) => prop.zone_types,
      icon: <MapPinIcon className="w-5 h-5" />,
    },
    suitable: {
      label: "Suitable For",
      value: (prop) => prop.business_types || prop.suitable,
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    land_sub_type: {
      label: "Land Sub Type",
      value: (prop) => prop.land_sub_type,
      icon: <MapPinIcon className="w-5 h-5" />,
    },
    investor_property: {
      label: "Investor Property",
      value: (prop) => prop.investor_property,
      icon: <DollarSign className="w-5 h-5" />,
    },
    loan_facility: {
      label: "Loan Facility",
      value: (prop) => prop.loan_facility,
      icon: <IndianRupee className="w-5 h-5" />,
    },
    builtup_unit: {
      label: "Unit Cost",
      value: (prop) =>
        `₹ ${formatToIndianCurrency(prop.builtup_unit)} ${
          prop.unit_cost_type || ""
        }`,
      icon: <IndianRupee className="w-5 h-5" />,
    },
  };
  const overviewItems = [];
  const visibleFields = fieldVisibility[propertySubtype] || {};
  Object.keys(visibleFields).forEach((field) => {
    if (
      visibleFields[field] &&
      fieldConfigs[field] &&
      property?.[field] &&
      field !== "facilities" &&
      field !== "around_places" &&
      field !== "description"
    ) {
      overviewItems.push({
        label:
          typeof fieldConfigs[field].label === "function"
            ? fieldConfigs[field].label(property)
            : fieldConfigs[field].label,
        value:
          typeof fieldConfigs[field].value === "function"
            ? fieldConfigs[field].value(property)
            : fieldConfigs[field].value,
        icon: fieldConfigs[field].icon,
      });
    }
  });
  if (
    visibleFields.length_area &&
    visibleFields.width_area &&
    property?.length_area &&
    property?.width_area
  ) {
    const dimIndex = overviewItems.findIndex(
      (item) => item.label === "Dimensions"
    );
    if (dimIndex === -1) {
      overviewItems.push(fieldConfigs.length_area);
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg font-medium text-primary">
          Loading property details...
        </p>
      </div>
    );
  }
  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <Card className="bg-destructive/10 border-destructive text-destructive p-4 mb-4">
          <CardContent>
            <p className="font-bold">Error loading property</p>
            <p>{error || "Property information not available"}</p>
          </CardContent>
        </Card>
        <Button onClick={() => window.history.back()} variant="default">
          Go Back
        </Button>
      </div>
    );
  }
  const facilitiesList = property?.facilities
    ?.split(",")
    .map((f) => f.trim())
    .filter(Boolean);
  const description = property?.description || "";
  const isLong = description.length > 580;
  const shortText = description.slice(0, 580);
  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 uppercase text-left lg:text-center">
        {property.property_name} Property Details
      </h1>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-2">
            Property Description
          </h2>
          <p className="text-muted-foreground text-md">
            {isExpanded || !isLong ? description : `${shortText}... `}
            {isLong && (
              <span
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-900 font-semibold cursor-pointer"
              >
                {isExpanded ? "Read Less" : "Read More..."}
              </span>
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 space-y-2">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <h3 className="text-2xl font-bold text-blue-900">
              {property.property_name}
            </h3>
            <div className="">
              <p className="text-xl text-end font-bold text-blue-900">
                ₹{" "}
                {formatToIndianCurrency(
                  property.property_for === "Rent"
                    ? property.monthly_rent
                    : property.property_cost
                )}
              </p>
              {property.property_for === "Rent" && (
                <p className="text-xs">Expected Monthly Rent</p>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <p className="text-md font-semibold text-muted-foreground uppercase">
                Construction Pvt Ltd...
              </p>
              <p className="text-md font-semibold text-muted-foreground">
                {property.google_address}
              </p>
            </div>
            <div className="text-right">
              {property.loan_facility === "Yes" && (
                <p className="text-sm font-bold text-blue-900">
                  EMI option available
                </p>
              )}
              <p className="text-sm font-semibold text-blue-900">
                All Inclusive Price
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex flex-wrap items-center gap-3 text-md text-blue-900 font-bold">
              <span>
                {property.sub_type === "Apartment"
                  ? `${property.bedrooms} BHK ${
                      property.property_type || property.sub_type
                    } for ${
                      property.property_for === "Sell"
                        ? "Sale"
                        : property.property_for
                    }`
                  : `${property.property_type || property.sub_type} for ${
                      property.property_for === "Sell"
                        ? "Sale"
                        : property.property_for
                    }`}
              </span>
              {property.builtup_area && (
                <>
                  <span className="border-l h-4 border-border mx-2"></span>
                  <span>
                    Built-up Area: {formatValue(property.builtup_area)}{" "}
                    {property.area_units}
                  </span>
                </>
              )}
              {property.sub_type === "Plot" && (
                <>
                  <span className="border-l h-4 border-border mx-2"></span>
                  <span>
                    Plot Area: {formatValue(property.plot_area)}{" "}
                    {property.area_units}
                  </span>
                </>
              )}
              {property.facing && (
                <>
                  <span className="border-l h-4 border-border mx-2"></span>
                  <span>{property.facing} Facing</span>
                </>
              )}
              <span className="border-l h-4 border-border mx-2"></span>
              {(property.sub_type === "Apartment" ||
                property.sub_type === "Independent Villa") && (
                <>
                  {property.occupancy === "Ready to move" ? (
                    <span>Ready to move</span>
                  ) : property.occupancy === "Under Construction" &&
                    property.under_construction ? (
                    <>
                      <span>Under Construction</span>
                      <span className="border-l h-4 border-border mx-2"></span>
                      <span>
                        Possession Starts -{" "}
                        {new Date(property.under_construction).toLocaleString(
                          "default",
                          { month: "short", year: "numeric" }
                        )}
                      </span>
                    </>
                  ) : null}
                </>
              )}
              {property.sub_type === "Plot" && (
                <span>
                  {property.possession_status?.toLowerCase() === "immediate"
                    ? "Immediate"
                    : "Future"}
                </span>
              )}
              <span className="border-l h-4 border-border mx-2"></span>
              <span className="flex items-center gap-1">
                <MdOutlineVerified className="text-xl text-green-500" />
                RERA
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Image
            src={mainImage}
            alt="Main Property"
            width={1200}
            height={500}
            className="w-full h-full md:h-[500px] object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/1200x500?text=${
                property.property_name || "No Image Found"
              }`;
            }}
          />
          {images.length > 1 && (
            <div className="mt-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((img, index) => (
                    <CarouselItem key={index} className="basis-1/4">
                      <Image
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        width={300}
                        height={150}
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/1200x500?text=${
                            property.property_name || "No Image Found"
                          }`;
                        }}
                        className="w-full h-20 md:h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setMainImage(img.url)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </CardContent>
      </Card>
      {floorplan?.image && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              Floor Plan
            </h2>
            <Image
              src={`https://api.meetowner.in/uploads/${floorplan.image}`}
              alt="Floor Plan"
              width={1200}
              height={400}
              className="w-full h-100 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/1200x400?text=No Floor Plan Found`;
              }}
            />
          </CardContent>
        </Card>
      )}
      {facilitiesList && facilitiesList.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {facilitiesList.map((facility, index) => (
                <div key={index} className="flex items-center gap-2 text-black">
                  {facilityIconMap[facility] || getFallbackIcon(facility)}
                  <span className="text-sm">{facility}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {aroundProperty && aroundProperty.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-primary">
                Property Location
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                {property.google_address}
              </p>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Around This Property
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aroundProperty.map((place, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-destructive">
                      {getPlaceIcon(place.title)}
                    </span>
                    <span className="text-sm font-medium">{place.title}</span>
                  </div>
                  <span className="bg-blue-900 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {formatDistance(place.distance)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Property Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {overviewItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="text-black pt-1">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-primary mb-2">
            Explore Map
          </h2>
          <div className="w-full h-96 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                property.google_address
              )}&output=embed`}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </CardContent>
      </Card>
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 w-10 h-10 rounded-full shadow-lg"
          variant="outline"
        >
          <ChevronUp className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};
export default PropertyDetails;
