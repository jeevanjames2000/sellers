"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../api/config";

export default function useFetchAndSetProperty(unique_property_id, resetForm) {
  const [property, setProperty] = useState(null);

  const getPropertyDetails = async () => {
    try {
      const res = await axios.get(
        `${config.api_url}/listings/v1/getSingleProperty?unique_property_id=${unique_property_id}`
      );
      const propertyData = res.data.property;
      if (propertyData) {
        setProperty(propertyData);
        const mappedPlaces =
          propertyData.around_places?.map((place) => ({
            place_id: place.id,
            place: place.title.trim(),
            distance: parseInt(place.distance),
          })) || [];
        resetForm({
          ...propertyData,
          total_places_around_property: mappedPlaces,
        });
      }
    } catch (err) {
      console.error("Failed to fetch property details:", err);
      setProperty(null);
    }
  };

  useEffect(() => {
    if (unique_property_id) {
      getPropertyDetails();
    } else {
      setProperty(null);
    }
  }, [unique_property_id, resetForm]);

  return { property, setProperty, getPropertyDetails };
}
