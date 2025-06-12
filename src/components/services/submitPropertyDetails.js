import axios from "axios";
import config from "../api/config";
import { setPropertyDetails } from "@/store/slices/addPropertySlice/propertyDetailsSlice";

export const submitPropertyDetails = async (
  formData,
  dispatch,
  userInfo,
  places,
  fac // this is now the only source for facilities
) => {
  console.log(
    "formData in submitPropertyDetails:",
    JSON.stringify(formData, null, 2)
  );
  console.log("places in submitPropertyDetails:", places);
  console.log("fac (facilities):", fac);

  try {
    // Use fac directly, ensuring it's a clean, comma-separated string
    const formattedFacilities = Array.isArray(fac)
      ? fac
          .filter((item) => item && facilitiesOptions.includes(item))
          .join(", ")
      : "";

    const payload = {
      sub_type: formData.sub_type,
      land_sub_type: formData.land_sub_type,
      rera_approved: formData.rera_approved,
      occupancy: formData.occupancy,
      bedrooms: formData.bedrooms,
      bathroom: formData.bathroom,
      balconies: formData.balconies,
      furnished_status: formData.furnished_status,
      passenger_lifts: formData.passenger_lifts,
      service_lifts: formData.service_lifts,
      stair_cases: formData.stair_cases,
      private_parking: formData.private_parking,
      public_parking: formData.public_parking,
      private_washrooms: formData.private_washrooms,
      public_washrooms: formData.public_washrooms,
      available_from: formData.available_from
        ? new Date(formData.available_from).toISOString().split("T")[0]
        : null,
      property_age: formData.property_age,
      monthly_rent: formData.monthly_rent,
      maintenance: formData.maintenance,
      security_deposit: formData.security_deposit,
      lock_in: formData.lock_in,
      brokerageCharge: formData.brokerageCharge,
      types: formData.types,
      area_units: formData.area_units,
      builtup_area: formData.builtup_area,
      carpet_area: formData.carpet_area,
      length_area: formData.length_area,
      width_area: formData.width_area,
      plot_area: formData.plot_area,
      total_project_area: formData.total_project_area,
      total_project_area_type: formData.total_project_area_type,
      pent_house: formData.pent_house,
      builtup_unit: formData.builtup_unit,
      unit_cost_type: formData.unit_cost_type,
      property_cost: formData.property_cost,
      property_cost_type: formData.property_cost_type,
      possession_status: formData.possession_status,
      ownership_type: formData.ownership_type,
      facilities: formattedFacilities || null,
      unit_flat_house_no: formData.unit_flat_house_no,
      plot_number: formData.plot_number,
      business_types: formData.suitable,
      zone_types: formData.zone_types,
      investor_property: formData.investor_property,
      loan_facility: formData.loan_facility,
      facing: formData.facing,
      car_parking: formData.car_parking,
      bike_parking: formData.bike_parking,
      open_parking: formData.open_parking,
      servant_room: formData.servant_room,
      description: formData.description,
      google_address: formData.google_address,
      user_id: userInfo?.user_id,
      unique_property_id: formData?.unique_property_id,
      total_places_around_property: places.map((place) => ({
        place_id: place.place_id,
        place: place.place,
        distance: parseFloat(place.distance),
      })),
    };

    // Remove undefined or null keys
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });

    console.log("Final payload:", JSON.stringify(payload, null, 2));

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
      dispatch(setPropertyDetails(property));
      return { success: true, data: property };
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
