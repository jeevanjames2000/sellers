import { useEffect, useState } from "react";
import axios from "axios";
import config from "../api/config";
import { useForm } from "react-hook-form";

export default function useFetchAndSetProperty(unique_property_id, resetForm) {
  const [property, setProperty] = useState(null);
  const { register, handleSubmit, setValue, reset } = useForm();

  useEffect(() => {
    const getPropertyDetails = async () => {
      try {
        const res = await axios.get(
          `${config.api_url}/listings/v1/getSinleProperty?unique_property_id=${unique_property_id}`
        );
        const propertyData = res.data.property;
        if (propertyData) {
          setProperty(propertyData);
          resetForm(propertyData);
        }
      } catch (err) {
        console.error("Failed to fetch property details:", err);
      }
    };
    if (unique_property_id) getPropertyDetails();
  }, [unique_property_id, resetForm]);

  useEffect(() => {
    if (property && property.id) {
      console.log("property: ", property);
      Object.entries(property).forEach(([key, value]) => {
        setValue(key, value ?? "");
      });
    }
  }, [property, setValue]);

  return { property, setProperty };
}
