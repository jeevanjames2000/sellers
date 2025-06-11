"use client";
import { useFormContext } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Image, Video, X, Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
const Propertyapi = axios.create({
  baseURL: "https://api.meetowner.in/",
  headers: {
    Authorization: `Bearer ${
      typeof window !== "undefined" ? localStorage.getItem("userToken") : ""
    }`,
  },
});
export default function Photos({ property, unique_property_id }) {
  console.log("property.image:", property?.image);
  const { register, setValue, watch } = useFormContext();
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const floorPlanInputRef = useRef(null);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  console.log("photoPreviews: ", photoPreviews);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [floorPlanPreviews, setFloorPlanPreviews] = useState([]);
  const [floorPlanFiles, setFloorPlanFiles] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(null);
  const [featuredImage, setFeaturedImage] = useState("");
  console.log("featuredImageIndex: ", featuredImageIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);
  const photos = watch("photos");
  const videos = watch("videos");
  const floorPlans = watch("floorPlans");
  useEffect(() => {
    const user = localStorage.getItem("userDetails");
    console.log("Raw userDetails:", user);
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log("Parsed userInfo:", parsedUser);
        setUserInfo(parsedUser);
      } catch (error) {
        console.error("Failed to parse userDetails:", error);
        toast.error("Failed to load user information");
      }
    } else {
      console.warn("No userDetails found in localStorage");
      toast.error("Please log in to continue");
    }
  }, []);
  const user_id = userInfo?.user_id || null;
  useEffect(() => {
    return () => {
      photoPreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      videoPreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      floorPlanPreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [photoPreviews, videoPreviews, floorPlanPreviews]);
  useEffect(() => {
    if (photos && photos.length > 0) {
      const newFiles = Array.from(photos).map((file) => ({
        file,
        id: null,
        url: URL.createObjectURL(file),
      }));
      setPhotoFiles((prev) => [...prev, ...newFiles]);
      setPhotoPreviews((prev) => [...prev, ...newFiles.map((f) => f.url)]);
    }
  }, [photos]);
  useEffect(() => {
    if (videos && videos.length > 0) {
      const newFiles = Array.from(videos).map((file) => ({
        file,
        id: null,
        url: URL.createObjectURL(file),
        type: "video",
      }));
      setVideoFiles((prev) => [...prev, ...newFiles]);
      setVideoPreviews((prev) => [...prev, ...newFiles.map((f) => f.url)]);
    }
  }, [videos]);
  useEffect(() => {
    if (floorPlans && floorPlans.length > 0) {
      const newFiles = Array.from(floorPlans).map((file) => ({
        file,
        id: null,
        url: URL.createObjectURL(file),
      }));
      setFloorPlanFiles((prev) => [...prev, ...newFiles]);
      setFloorPlanPreviews((prev) => [...prev, ...newFiles.map((f) => f.url)]);
    }
  }, [floorPlans]);
  const getPropertyPhotos = async () => {
    if (!user_id || !unique_property_id) {
      console.log("Skipping getPropertyPhotos", {
        user_id,
        unique_property_id,
      });
      return;
    }
    setIsLoading(true);
    try {
      console.log("Calling getPropertyPhotos");
      const response = await Propertyapi.get("property/getpropertyphotos", {
        params: { unique_property_id, user_id },
      });
      console.log("getPropertyPhotos response:", response.data);
      if (response.data.status === "error") {
        setErrorMessages({ message: response.data.message });
        setErrorModalOpen(true);
        return;
      }
      if (response.status === 200) {
        const images = response.data.images || [];
        const photoData = images.map((image) => ({
          id: image.id,
          url: image.url,
          file: null,
        }));
        let previews = [];
        let files = [];
        let featuredIndex = null;
        if (property?.image) {
          // Prioritize property.image
          files = [{ id: null, url: property.image, file: null }, ...photoData];
          previews = [property.image, ...images.map((img) => img.url)];
          featuredIndex = 0;
        } else {
          // Use API's featuredImage
          files = photoData;
          previews = images.map((image) => image.url);
          const apiFeaturedIndex =
            parseInt(response.data.featuredImageIndex) || 0;
          if (
            apiFeaturedIndex >= 0 &&
            apiFeaturedIndex < images.length &&
            images[apiFeaturedIndex]?.url === response.data.featuredImage
          ) {
            featuredIndex = apiFeaturedIndex;
          } else {
            const foundIndex = images.findIndex(
              (img) => img.url === response.data.featuredImage
            );
            featuredIndex =
              foundIndex !== -1 ? foundIndex : images.length > 0 ? 0 : null;
          }
        }
        setPhotoFiles(files);
        setPhotoPreviews(previews);
        setFeaturedImageIndex(featuredIndex);
        console.log(
          "Set featuredImageIndex:",
          featuredIndex,
          "Previews:",
          previews
        );
      }
    } catch (error) {
      console.error("getPropertyPhotos error:", error);
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const getPropertyVideos = async () => {
    if (!user_id || !unique_property_id) {
      console.log("Skipping getPropertyVideos", {
        user_id,
        unique_property_id,
      });
      return;
    }
    setIsLoading(true);
    try {
      console.log("Calling getPropertyVideos");
      const response = await Propertyapi.get("property/getpropertyvideos", {
        params: { unique_property_id, user_id },
      });
      console.log("getPropertyVideos response:", response.data);
      if (response.data.status === "error") {
        setErrorMessages({ message: response.data.message });
        setErrorModalOpen(true);
        return;
      }
      if (response.status === 200) {
        const videos = response.data.videos || [];
        const videoFilesData = videos.map((video) => ({
          id: video.id,
          url: video.url,
          type: video.type,
          file: null,
        }));
        setVideoFiles(videoFilesData);
        const videoBlobs = await Promise.all(
          videos.map(async (video) => {
            try {
              const res = await fetch(video.url, { mode: "cors" });
              if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
              const blob = await res.blob();
              return URL.createObjectURL(blob);
            } catch (error) {
              console.error("Error fetching video:", error);
              return null;
            }
          })
        );
        setVideoPreviews(videoBlobs.filter(Boolean));
      }
    } catch (error) {
      console.error("getPropertyVideos error:", error);
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const getPropertyFloorPlans = async () => {
    if (!user_id || !unique_property_id) {
      console.log("Skipping getPropertyFloorPlans", {
        user_id,
        unique_property_id,
      });
      return;
    }
    setIsLoading(true);
    try {
      console.log("Calling getPropertyFloorPlans");
      const response = await Propertyapi.get("property/getfloorplansphotos", {
        params: { unique_property_id, user_id },
      });
      console.log("getPropertyFloorPlans response:", response.data);
      if (response.data.status === "error") {
        setErrorMessages({ message: response.data.message });
        setErrorModalOpen(true);
        return;
      }
      if (response.status === 200) {
        const floorPlans = response.data.images || [];
        setFloorPlanFiles(
          floorPlans.map((image) => ({
            id: image.id,
            url: image.url,
            file: null,
          }))
        );
        setFloorPlanPreviews(floorPlans.map((image) => image.url));
      }
    } catch (error) {
      console.error("getPropertyFloorPlans error:", error);
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    console.log("useEffect for APIs", { user_id, unique_property_id });
    if (user_id && unique_property_id) {
      getPropertyPhotos();
      getPropertyVideos();
      getPropertyFloorPlans();
    }
  }, [user_id, unique_property_id]);
  const deletePropertyImage = async (photo_id) => {
    setIsLoading(true);
    try {
      const response = await Propertyapi.post("property/photos/delete", {
        photo_id,
        user_id,
        unique_property_id,
      });
      if (response.data.status === "error") {
        setErrorMessages({ message: response.data.message });
        setErrorModalOpen(true);
        return;
      }
      toast.success("Photo removed successfully");
      getPropertyPhotos();
    } catch (error) {
      console.error("Delete photo error:", error);
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const deletePropertyVideo = async (video_id) => {
    setIsLoading(true);
    try {
      const response = await Propertyapi.post("property/videos/delete", {
        video_id,
        user_id,
        unique_property_id,
      });
      if (response.data.status === "error") {
        setErrorMessages({ message: response.data.message });
        setErrorModalOpen(true);
        return;
      }
      toast.success("Video removed successfully");
      getPropertyVideos();
    } catch (error) {
      console.error("Delete video error:", error);
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const deletePropertyFloorPlan = async (image_id) => {
    setIsLoading(true);
    try {
      const response = await Propertyapi.post("property/floorplans/delete", {
        photo_id: image_id,
        user_id,
        unique_property_id,
      });
      if (response.data.status === "error") {
        setErrorMessages({ message: response.data.message });
        setErrorModalOpen(true);
        return;
      }
      toast.success("Floor plan removed successfully");
      getPropertyFloorPlans();
    } catch (error) {
      console.error("Delete floor plan error:", error);
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const updateFeaturedImage = async (photo_id) => {
    setIsLoading(true);
    try {
      const response = await Propertyapi.post("property/photos/set-featured", {
        photo_id,
        user_id,
        unique_property_id,
      });
      if (response.data.status === "error") {
        setErrorMessages({ message: response.data.message });
        setErrorModalOpen(true);
        return;
      }
      toast.success("Featured image updated successfully");
      getPropertyPhotos();
    } catch (error) {
      console.error("Update featured image error:", error);
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const removeFile = (field, index) => () => {
    if (field === "photos") {
      const file = photoFiles[index];
      if (file?.id) {
        deletePropertyImage(file.id);
        return;
      }
      setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
      setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
      if (featuredImageIndex === index) setFeaturedImageIndex(null);
      else if (featuredImageIndex > index)
        setFeaturedImageIndex(featuredImageIndex - 1);
    } else if (field === "videos") {
      const file = videoFiles[index];
      if (file?.id) {
        deletePropertyVideo(file.id);
        return;
      }
      setVideoFiles((prev) => prev.filter((_, i) => i !== index));
      setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
    } else if (field === "floorPlans") {
      const file = floorPlanFiles[index];
      if (file?.id) {
        deletePropertyFloorPlan(file.id);
        return;
      }
      setFloorPlanFiles((prev) => prev.filter((_, i) => i !== index));
      setFloorPlanPreviews((prev) => prev.filter((_, i) => i !== index));
    }
    const currentFiles = watch(field);
    if (currentFiles) {
      const newFiles = Array.from(currentFiles).filter((_, i) => i !== index);
      const dataTransfer = new DataTransfer();
      newFiles.forEach((file) => dataTransfer.items.add(file));
      setValue(field, dataTransfer.files, { shouldValidate: true });
    }
  };
  const handleFeaturedImageChange = (index) => {
    setFeaturedImageIndex(index);
    const file = photoFiles[index];
    if (file?.id) {
      updateFeaturedImage(file.id);
    }
  };
  const handleSubmit = async () => {
    if (!photoPreviews.length) {
      toast.error("Please upload at least one photo");
      return;
    }
    if (featuredImageIndex === null) {
      toast.error("Please select a featured image");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("unique_property_id", unique_property_id);
      photoFiles.forEach((file) => {
        if (file.file) {
          formData.append("photos", file.file);
        }
      });
      videoFiles.forEach((file) => {
        if (file.file) {
          formData.append("videos", file.file);
          formData.append("video_type", file.type);
        }
      });
      floorPlanFiles.forEach((file) => {
        if (file.file) {
          formData.append("floor_plans", file.file);
        }
      });
      const response = await Propertyapi.post(
        "property/photos-videos/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.status === "error") {
        setErrorMessages({ message: response.data.message });
        setErrorModalOpen(true);
        return;
      }
      toast.success("Files uploaded successfully");
      getPropertyPhotos();
      getPropertyVideos();
      getPropertyFloorPlans();
    } catch (error) {
      console.error("Submit error:", error);
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleClickUpload = (ref) => () => ref.current?.click();
  const handleFileChange = (field) => (e) => {
    const files = e.target.files;
    if (files) {
      setValue(field, files, { shouldValidate: true });
    }
  };
  const closeErrorModal = () => setErrorModalOpen(false);
  return (
    <div>
      <div className="space-y-10 max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-lg font-medium">Property Photos</Label>
            <p className="text-sm text-muted-foreground">
              Upload high-quality photos of your property. The first photo will
              be used as the main image.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={handleClickUpload(photoInputRef)}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="space-y-4">
                <Image className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <Button type="button" variant="outline" className="mb-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    or drag and drop photos here
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Supported formats: JPG, JPEG, PNG (Max 10MB each)
                </p>
              </div>
              <input
                {...register("photos")}
                type="file"
                ref={photoInputRef}
                accept="image/png, image/jpeg, image/jpg"
                multiple
                className="hidden"
                onChange={handleFileChange("photos")}
              />
            </div>
            <div
              onClick={handleClickUpload(videoInputRef)}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="space-y-4">
                <Video className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <Button type="button" variant="outline" className="mb-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Videos
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    or drag and drop videos here
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Supported format: MP4 (Max 30MB each)
                </p>
              </div>
              <input
                {...register("videos")}
                type="file"
                ref={videoInputRef}
                accept="video/mp4"
                multiple
                className="hidden"
                onChange={handleFileChange("videos")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3">
            {photoPreviews.length > 0 ? (
              photoPreviews.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-md overflow-hidden"
                  style={{ zIndex: 1 }} // Ensure hover events are captured
                >
                  <img
                    src={url}
                    alt={`Photo Preview ${idx}`}
                    className={`object-cover w-full h-40 rounded-md ${
                      featuredImageIndex == idx ? "ring-2 ring-blue-500" : ""
                    }`}
                    crossOrigin="anonymous"
                    onError={() =>
                      console.error(`Failed to load image: ${url}`)
                    }
                  />
                  <X
                    size={20}
                    color="white"
                    className="absolute top-2 right-2 rounded-full bg-red-500 cursor-pointer z-10"
                    onClick={removeFile("photos", idx)}
                  />
                  <div
                    className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full transition-opacity duration-200 cursor-pointer flex items-center gap-1 z-10 group-hover:opacity-100 opacity-0"
                    onClick={() => handleFeaturedImageChange(idx)}
                  >
                    Set as Featured
                    {featuredImageIndex === idx && <Bookmark size={15} />}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground col-span-full text-center">
                No photos selected
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videoPreviews.length > 0 ? (
              videoPreviews.map((url, idx) => (
                <div key={idx} className="relative">
                  <video
                    src={url}
                    className="rounded-md object-cover w-full h-40"
                    controls
                    crossOrigin="anonymous"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full"
                    onClick={removeFile("videos", idx)}
                  >
                    <X className="w-2 h-2" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground col-span-full text-center">
                No videos selected
              </p>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-lg font-medium">Floor Plans</Label>
            <p className="text-sm text-muted-foreground">
              Upload floor plans of your property.
            </p>
          </div>
          <div
            onClick={handleClickUpload(floorPlanInputRef)}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="space-y-4">
              <Image className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <Button type="button" variant="outline" className="mb-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Floor Plans
                </Button>
                <p className="text-sm text-muted-foreground">
                  or drag and drop floor plans here
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Supported formats: JPG, JPEG, PNG (Max 10MB each)
              </p>
            </div>
            <input
              {...register("floorPlans")}
              type="file"
              ref={floorPlanInputRef}
              accept="image/png, image/jpeg, image/jpg"
              multiple
              className="hidden"
              onChange={handleFileChange("floorPlans")}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {floorPlanPreviews.length > 0 ? (
              floorPlanPreviews.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`Floor Plan Preview ${idx}`}
                    className="rounded-md object-cover w-full h-40"
                    crossOrigin="anonymous"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full"
                    onClick={removeFile("floorPlans", idx)}
                  >
                    <X className="w-2 h-2" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground col-span-full text-center">
                No floor plans selected
              </p>
            )}
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
      {errorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-medium">Error</h2>
            <p className="mt-2">{errorMessages?.message}</p>
            <Button
              className="mt-4"
              onClick={closeErrorModal}
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
