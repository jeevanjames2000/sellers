import axios from "axios";
import config from "../api/config";
import { setAddress } from "@/store/slices/addPropertySlice/addressSlice";
export const submitAddress = async (formData, dispatch) => {
  const googleAddress = `${formData.location_id}, ${formData.city_id}, ${formData.state_id}`;
  try {
    const response = await axios.post(
      `${config.api_url}/property/v1/addAddressDetails`,
      {
        city_id: formData.city_id,
        state_id: formData.state_id,
        locality: formData.locality,
        unit_flat_house_no: formData.unit_flat_house_no,
        floors: formData.floors,
        total_floors: formData.total_floors,
        unique_property_id: formData.unique_property_id,
        property_name: formData.property_name,
        plot_number: formData.plot_number,
        google_address: googleAddress,
        builder_name: formData.builder_name,
        villa_number: formData.villa_number,
      }
    );
    const { status, address, message } = response.data;
    if (status === "success") {
      dispatch(setAddress(address));
      return { success: true, data: address };
    } else {
      return { success: false, message };
    }
  } catch (error) {
    console.error(
      "submitAddressDetails error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
