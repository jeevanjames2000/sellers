import { setBasicDetails } from "@/store/slices/addPropertySlice/basicDetailsSlice";
import axios from "axios";
import config from "../api/config";

export const submitBasicDetails = async (formData, dispatch, userInfo) => {
  try {
    const response = await axios.post(
      `${config.api_url}/property/v1/addBasicDetails`,
      {
        property_in: formData.propertyType,
        property_for: formData.lookingTo,
        transaction_type: formData.transactionType || "",
        user_id: userInfo.user_id,
        unique_property_id: formData?.unique_property_id || "",
        user_type: userInfo.user_type || 2,
        city: formData.city,
      }
    );
    const { status, message, data } = response.data;

    if (status === "success" && data?.property) {
      dispatch(setBasicDetails(data.property));
      return { success: true, data: data.property };
    } else {
      return {
        success: false,
        message: message || "Failed to submit basic details",
      };
    }
  } catch (error) {
    console.error(
      "submitBasicDetails error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
