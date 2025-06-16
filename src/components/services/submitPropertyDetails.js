import axios from "axios";
import config from "../api/config";
import { setPropertyDetails } from "@/store/slices/addPropertySlice/propertyDetailsSlice";

const transformValuesForDb = (data) => {
  const transformField = (key, value) => {
    switch (key) {
      case "security_deposit":
      case "lock_in":
        if (!value || value === "None") return "0.00";
        const match = value.match(/(\d+)/);
        return match ? `${parseInt(match[1])}.00` : "0.00";
      case "brokerage_charge":
        if (!value || value === "None") return "0.00";
        return value === "15 Days"
          ? "15.00"
          : value === "30 Days"
          ? "30.00"
          : "0.00";
      default:
        return value;
    }
  };

  return Object.keys(data).reduce((acc, key) => {
    const backendKey =
      key === "security_deposit"
        ? "securityDeposit"
        : key === "brokerage_charge"
        ? "brokerageCharge"
        : key;
    return {
      ...acc,
      [backendKey]: transformField(key, data[key]),
    };
  }, {});
};

export const submitPropertyDetails = async (
  formData,
  dispatch,
  userInfo,
  places,
  fac
) => {
  console.log("Form data before transformation:", formData);
  try {
    const formattedFacilities = Array.isArray(fac)
      ? fac
          .filter((item) => item && facilitiesOptions.includes(item))
          .join(", ")
      : "";
    const newPlaces = places
      .filter((place) => !place.place_id)
      .map((place) => ({
        place: place.place,
        distance: parseFloat(place.distance),
      }));
    const transformedData = transformValuesForDb(formData);
    const payload = {
      sub_type: transformedData.sub_type,
      land_sub_type: transformedData.land_sub_type,
      rera_approved: transformedData.rera_approved,
      occupancy: transformedData.occupancy,
      bedrooms: transformedData.bedrooms,
      bathroom: transformedData.bathroom,
      pantry_room: transformedData.pantry_room,
      balconies: transformedData.balconies,
      furnished_status: transformedData.furnished_status,
      passenger_lifts: transformedData.passenger_lifts,
      service_lifts: transformedData.service_lifts,
      stair_cases: transformedData.stair_cases,
      private_parking: transformedData.private_parking,
      public_parking: transformedData.public_parking,
      private_washrooms: transformedData.private_washrooms,
      public_washrooms: transformedData.public_washrooms,
      available_from: transformedData.available_from
        ? new Date(transformedData.available_from).toISOString().split("T")[0]
        : null,
      property_age: transformedData.property_age,
      monthly_rent: transformedData.monthly_rent,
      maintenance: transformedData.maintenance,
      securityDeposit: transformedData.securityDeposit,
      lock_in: transformedData.lock_in,
      brokerageCharge: transformedData.brokerageCharge,
      types: transformedData.types,
      area_units: transformedData.area_units,
      builtup_area: transformedData.builtup_area,
      carpet_area: transformedData.carpet_area,
      length_area: transformedData.length_area,
      width_area: transformedData.width_area,
      plot_area: transformedData.plot_area,
      total_project_area: transformedData.total_project_area,
      total_project_area_type: transformedData.total_project_area_type,
      pent_house: transformedData.pent_house,
      builtup_unit: transformedData.builtup_unit,
      unit_cost_type: transformedData.unit_cost_type,
      property_cost: transformedData.property_cost,
      property_cost_type: transformedData.property_cost_type,
      possession_status: transformedData.possession_status,
      ownership_type: transformedData.ownership_type,
      facilities: formattedFacilities || null,
      unit_flat_house_no: transformedData.unit_flat_house_no,
      plot_number: transformedData.plot_number,
      business_types: transformedData.suitable,
      zone_types: transformedData.zone_types,
      investor_property: transformedData.investor_property,
      loan_facility: transformedData.loan_facility,
      facing: transformedData.facing,
      car_parking: transformedData.car_parking,
      bike_parking: transformedData.bike_parking,
      open_parking: transformedData.open_parking,
      servant_room: transformedData.servant_room,
      description: transformedData.description,
      google_address: transformedData.google_address,
      user_id: userInfo?.user_id,
      unique_property_id: transformedData?.unique_property_id,
      total_places_around_property: newPlaces,
      under_construction: transformedData?.under_construction,
    };
    console.log("Payload sent to backend:", payload);
    const response = await axios.post(
      `${config.api_url}/property/v1/addPropertyDetails`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { status, property, message } = response.data;
    if (status === "success") {
      let updatedPlaces = [...places];
      if (property && Array.isArray(property.around_places)) {
        updatedPlaces = places.map((place) => {
          if (!place.place_id) {
            const serverPlace = property.around_places.find(
              (sp) => sp.title === place.place && sp.distance === place.distance
            );
            return serverPlace ? { ...place, place_id: serverPlace.id } : place;
          }
          return place;
        });
      } else {
        console.warn(
          "No around_places found in response, keeping existing places."
        );
      }
      const updatedProperty = {
        ...property,
        around_places: updatedPlaces,
      };
      dispatch(setPropertyDetails(updatedProperty));
      return {
        success: true,
        data: updatedProperty,
      };
    } else {
      return { success: false, message };
    }
  } catch (error) {
    console.error(
      "submitPropertyDetails error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
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
