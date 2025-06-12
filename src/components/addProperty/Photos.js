// components/Photos.jsx
"use client";
import { useFormContext } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Image, Video, X, Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { submitPhotosVideos } from "../services/submitPhotosVideos";

const Propertyapi = axios.create({
  baseURL: "https://api.meetowner.in/",
  headers: {
    Authorization: `Bearer ${
      typeof window !== "undefined" ? localStorage.getItem("userToken") : ""
    }`,
  },
});

export default function Photos({ property, unique_property_id, onNext }) {
  const { register, setValue, watch, reset } = useFormContext();
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const floorPlanInputRef = useRef(null);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [floorPlanPreviews, setFloorPlanPreviews] = useState([]);
  const [floorPlanFiles, setFloorPlanFiles] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);

  const photo = watch("photo");
  const video = watch("video");
  const floorPlans = watch("floorPlans");
  const featuredImageIndex = watch("featuredImageIndex");

  useEffect(() => {
    const user = localStorage.getItem("userDetails");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserInfo(parsedUser);
      } catch (error) {
        console.error("Failed to parse userDetails:", error);
        toast.error("Failed to load user information");
      }
    } else {
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
    if (photo && photo.length > 0) {
      const newFiles = Array.from(photo).map((file) => ({
        file,
        id: null,
        url: URL.createObjectURL(file),
      }));
      setPhotoFiles((prev) => [...prev, ...newFiles]);
      setPhotoPreviews((prev) => [...prev, ...newFiles.map((f) => f.url)]);
      setValue("photo", null, { shouldValidate: true });
      if (featuredImageIndex === null) {
        setValue("featuredImageIndex", photoFiles.length, {
          shouldValidate: true,
        });
      }
    }
  }, [photo, setValue, photoFiles.length, featuredImageIndex]);

  useEffect(() => {
    if (video && video.length > 0) {
      const newFiles = Array.from(video).map((file) => ({
        file,
        id: null,
        url: URL.createObjectURL(file),
        type: "video",
      }));
      setVideoFiles((prev) => [...prev, ...newFiles]);
      setVideoPreviews((prev) => [...prev, ...newFiles.map((f) => f.url)]);
      setValue("video", null, { shouldValidate: true });
    }
  }, [video, setValue]);

  useEffect(() => {
    if (floorPlans && floorPlans.length > 0) {
      const newFiles = Array.from(floorPlans).map((file) => ({
        file,
        id: null,
        url: URL.createObjectURL(file),
      }));
      setFloorPlanFiles((prev) => [...prev, ...newFiles]);
      setFloorPlanPreviews((prev) => [...prev, ...newFiles.map((f) => f.url)]);
      setValue("floorPlans", null, { shouldValidate: true });
    }
  }, [floorPlans, setValue]);

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
      const response = await Propertyapi.get("property/getpropertyphotos", {
        params: { unique_property_id, user_id },
      });
      if (response.data.status === "error") {
        setErrorMessages({ message: response.data.message });
        setErrorModalOpen(true);
        return;
      }
      if (response.status === 200) {
        const images = response.data.images || [];
        const featuredImage = response.data.featuredImage;
        let photoData = images.map((image) => ({
          id: image.id,
          url: image.url,
          file: null,
        }));
        let previews = images.map((image) => image.url);
        let featuredIndex = parseInt(response.data.featuredImageIndex) || 0;

        // Deduplicate featuredImage
        const isFeaturedInImages = images.some(
          (img) => img.url === featuredImage
        );
        if (!isFeaturedInImages && featuredImage) {
          photoData = [
            { id: null, url: featuredImage, file: null },
            ...photoData,
          ];
          previews = [featuredImage, ...previews];
          featuredIndex = 0;
        } else if (isFeaturedInImages) {
          const foundIndex = images.findIndex(
            (img) => img.url === featuredImage
          );
          featuredIndex = foundIndex !== -1 ? foundIndex : featuredIndex;
        }

        if (featuredIndex >= photoData.length) {
          featuredIndex = photoData.length > 0 ? 0 : null;
        }

        setPhotoFiles(photoData);
        setPhotoPreviews(previews);
        setValue("featuredImageIndex", featuredIndex, { shouldValidate: true });
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
      const response = await Propertyapi.get("property/getpropertyvideos", {
        params: { unique_property_id, user_id },
      });
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
          file: null,
        }));
        setVideoFiles(videoFilesData);
        const videoBlobs = await Promise.all(
          videos.map(async (video) => {
            try {
              const res = await fetch(video.url);
              if (!res.ok?.blob)
                throw new Error(`HTTP error! Status: ${res.status}`);
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
      const response = await Propertyapi.get("property/getfloorplansphotos", {
        params: { unique_property_id, user_id },
      });
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

  const deletePropertyImage = async (photo_id) => {
    setIsLoading(true);
    try {
      const response = await Propertyapi.post("property/deletepropertyphoto", {
        photo_id,
        user_id,
        unique_property_id,
      });
      if (response.data.status === "error") {
        setErrorMessages({ message: response.data.message });
        setErrorModalOpen(true);
        return;
      }
      toast.success("Photo deleted successfully");
      getPropertyPhotos();
    } catch (error) {
      console.error("Delete property image error:", error);
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePropertyVideo = async (video_id) => {
    setIsLoading(true);
    try {
      const response = await Propertyapi.post("property/deletepropertyvideo", {
        video_id,
        user_id,
        unique_property_id,
      });
      if (response.data.status === "error") {
        setErrorMessages({ message: response.data.message });
        setErrorModalOpen(true);
        return;
      }
      toast.success("Video deleted successfully");
      getPropertyVideos();
    } catch (error) {
      console.error("Delete property video error:", error);
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePropertyFloorPlan = async (image_id) => {
    setIsLoading(true);
    try {
      const response = await Propertyapi.post("property/deletefloorplanphoto", {
        image_id,
        user_id,
        unique_property_id,
      });
      if (response.data.status === "error") {
        setErrorMessages({ message: response.data.message });
        setErrorModalOpen(true);
        return;
      }
      toast.success("Floor plan deleted successfully");
      getPropertyFloorPlans();
    } catch (error) {
      console.error("Delete floor plan error:", error);
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user_id && unique_property_id) {
      getPropertyPhotos();
      getPropertyVideos();
      getPropertyFloorPlans();
    }
  }, [user_id, unique_property_id]);

  const removeFile = (field, index) => () => {
    if (field === "photo") {
      const file = photoFiles[index];
      if (file?.id) {
        deletePropertyImage(file.id);
        return;
      }
      setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
      setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
      if (featuredImageIndex === index)
        setValue("featuredImageIndex", null, { shouldValidate: true });
      else if (featuredImageIndex > index)
        setValue("featuredImageIndex", featuredImageIndex - 1, {
          shouldValidate: true,
        });
    } else if (field === "video") {
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
    setValue("featuredImageIndex", index, { shouldValidate: true });
  };

  const handleFileChange = (field) => (e) => {
    const files = e.target.files;
    if (files) {
      const maxSize = field === "video" ? 30 * 1024 * 1024 : 10 * 1024 * 1024;
      const allowedExtensions =
        field === "video"
          ? [".mp4", ".avi", ".mov", ".flv", ".wmv"]
          : [".jpg", ".jpeg", ".png", ".gif"];
      for (const file of files) {
        const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
          toast.error(`${file.name} has an unsupported format`);
          return;
        }
        if (file.size > maxSize) {
          toast.error(
            `${file.name} exceeds ${
              field === "video" ? "30MB" : "10MB"
            } size limit`
          );
          return;
        }
      }
      setValue(field, files, { shouldValidate: true });
    }
  };

  const handleNextStep = async () => {
    if (!photoPreviews.length) {
      toast.error("Please upload at least one photo");
      return;
    }
    if (
      featuredImageIndex === null ||
      featuredImageIndex >= photoFiles.length
    ) {
      toast.error("Please select a valid featured image");
      return;
    }
    setIsLoading(true);
    try {
      console.log("Submitting photoFiles:", photoFiles);
      console.log("Submitting featuredImageIndex:", featuredImageIndex);
      const { success, data, message } = await submitPhotosVideos(
        user_id,
        unique_property_id,
        photoFiles,
        videoFiles,
        featuredImageIndex
      );
      if (success) {
        toast.success("Photos and videos uploaded successfully");
        reset({
          photo: null,
          video: null,
          floorPlans: null,
          featuredImageIndex: null,
        });
        setPhotoFiles([]);
        setPhotoPreviews([]);
        setVideoFiles([]);
        setVideoPreviews([]);
        setFloorPlanFiles([]);
        setFloorPlanPreviews([]);
        onNext();
      } else {
        setErrorMessages({ message });
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
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
              Upload high-quality photos of your property. Select one as the
              featured image.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => photoInputRef.current?.click()}
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
                  Supported formats: JPG, JPEG, PNG, GIF (Max 10MB each)
                </p>
              </div>
              <input
                {...register("photo")}
                type="file"
                ref={photoInputRef}
                accept="image/png,image/jpeg,image/jpg,image/gif"
                multiple
                className="hidden"
                onChange={handleFileChange("photo")}
              />
            </div>
            <div
              onClick={() => videoInputRef.current?.click()}
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
                  Supported formats: MP4, AVI, MOV, FLV, WMV (Max 30MB each)
                </p>
              </div>
              <input
                {...register("video")}
                type="file"
                ref={videoInputRef}
                accept="video/mp4,video/avi,video/mov,video/flv,video/wmv"
                multiple
                className="hidden"
                onChange={handleFileChange("video")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3">
            {photoPreviews.length > 0 ? (
              photoPreviews.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-md overflow-hidden"
                  style={{ zIndex: 1 }}
                >
                  <img
                    src={url}
                    alt={`Photo Preview ${idx}`}
                    className={`object-cover w-full h-40 rounded-md ${
                      featuredImageIndex === idx ? "ring-2 ring-green-500" : ""
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
                    onClick={removeFile("photo", idx)}
                  />
                  <div
                    className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full transition-opacity duration-200 cursor-pointer flex items-center gap-1 z-10 group-hover:opacity-100 ${
                      featuredImageIndex === idx
                        ? "bg-green-600 opacity-100"
                        : "bg-blue-600 opacity-0"
                    }`}
                    onClick={() => handleFeaturedImageChange(idx)}
                  >
                    {featuredImageIndex === idx
                      ? "Featured"
                      : "Set as Featured"}
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
                    onClick={removeFile("video", idx)}
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
            onClick={() => floorPlanInputRef.current?.click()}
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
                Supported formats: JPG, JPEG, PNG, GIF (Max 10MB each)
              </p>
            </div>
            <input
              {...register("floorPlans")}
              type="file"
              ref={floorPlanInputRef}
              accept="image/png,image/jpeg,image/jpg,image/gif"
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
        <Button onClick={handleNextStep} disabled={isLoading} className="mt-6">
          {isLoading ? "Uploading..." : "Next"}
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
