import axios from "axios";
import config from "../api/config";

export const submitPhotosVideos = async (
  user_id,
  unique_property_id,
  photos,
  videoFiles,
  featuredImageIndex,
  floorPlanFiles = []
) => {
  try {
    if (!photos || photos.length === 0) {
      throw new Error("No photos available");
    }
    if (
      featuredImageIndex === null ||
      featuredImageIndex < 0 ||
      featuredImageIndex >= photos.length
    ) {
      throw new Error("Invalid featured image index");
    }

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("unique_property_id", unique_property_id);
    const hasNewPhotos = photos.some((file) => file.file);
    const hasNewVideos = videoFiles.some((video) => video.file);
    const hasNewFloorPlans = floorPlanFiles.some((floorPlan) => floorPlan.file);

    if (hasNewPhotos || hasNewVideos || hasNewFloorPlans) {
      photos.forEach((file, index) => {
        if (file.file) {
          formData.append("photo", file.file);
          formData.append(`image_id[${index}]`, file.id || "");
        }
      });
      videoFiles.forEach((video, index) => {
        if (video.file) {
          formData.append("video", video.file);
          formData.append(`video_type[${index}]`, video.type || "video");
          formData.append(`video_id[${index}]`, video.id || "");
        }
      });
      floorPlanFiles.forEach((floorPlan, index) => {
        if (floorPlan.file) {
          formData.append("floor_plan", floorPlan.file);
          formData.append(`floor_plan_id[${index}]`, floorPlan.id || "");
        }
      });
      const featuredImage = photos[featuredImageIndex];
      if (!featuredImage) {
        throw new Error("Featured image not found");
      }
      if (featuredImage.file) {
        formData.append("featured_image", featuredImage.file);
      } else if (featuredImage.url && featuredImage.id) {
        formData.append("featured_image_id", featuredImage.id);
      } else {
        try {
          const response = await fetch(featuredImage.url);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch featured image: ${response.status}`
            );
          }
          const blob = await response.blob();
          const fileName = featuredImage.url.split("/").pop();
          const file = new File([blob], fileName, { type: blob.type });
          formData.append("featured_image", file);
        } catch (error) {
          console.error("Error fetching featured image:", error);
          throw new Error("Failed to fetch featured image file");
        }
      }
    } else {
      const featuredImage = photos[featuredImageIndex];
      if (!featuredImage) {
        throw new Error("Featured image not found");
      }
      if (featuredImage.id) {
        formData.append("featured_image_id", featuredImage.id);
        photos.forEach((file, index) => {
          if (file.id) {
            formData.append(`image_id[${index}]`, file.id);
          }
        });
      } else {
        throw new Error("Featured image ID not found for existing image");
      }
    }
    for (let [key, value] of formData.entries()) {
      console.log(
        `FormData: ${key}: ${value instanceof File ? value.name : value}`
      );
    }

    const response = await axios.post(
      `${config.api_url}/property/addphotosvideos`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
        },
      }
    );

    const { status, message, data } = response.data;
    if (status === "success") {
      return { success: true, data };
    } else {
      return { success: false, message: message || "Upload failed" };
    }
  } catch (error) {
    console.error(
      "submitPhotosVideos error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
