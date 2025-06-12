import axios from "axios";
import config from "../api/config";
export const submitPhotosVideos = async (
  user_id,
  unique_property_id,
  photos,
  videoFiles,
  featuredImageIndex
) => {
  try {
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("unique_property_id", unique_property_id);
    photos.forEach((file, index) => {
      if (file.file) {
        formData.append("photo", file.file);
        formData.append("image_id", file.id || "");
      }
    });
    videoFiles.forEach((video) => {
      if (video.file) {
        formData.append("video", video.file);
        formData.append("video_type", video.type || "video");
        formData.append("video_id", video.id || "");
      }
    });
    const featuredImage = photos[featuredImageIndex];
    if (!featuredImage) {
      throw new Error("Featured image not found");
    }
    if (featuredImage.file) {
      formData.append("featured_image", featuredImage.file);
    } else if (featuredImage.id) {
      formData.append("featured_image_id", featuredImage.id);
    } else {
      throw new Error("Featured image file or ID not found");
    }
    const response = await axios.post(
      `https://api.meetowner.in/property/addphotosvideos`,
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
