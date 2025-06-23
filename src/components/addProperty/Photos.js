"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import Propertyapi from "../api/Propertyapi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Video, X, Bookmark, Image as PhotoImage } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
function Photoswrapper({ setCurrentStep, getPropertyDetails }) {
  const { register, handleSubmit } = useForm();
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const floorPlanInputRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);
  const searchParams = useSearchParams();
  const unique_property_id = searchParams.get("property_id");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(null);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [floorPlanFiles, setFloorPlanFiles] = useState([]);
  const [floorPlanPreviews, setFloorPlanPreviews] = useState([]);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("userDetails");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserInfo(parsedUser);
      } catch (error) {
        toast.error("Failed to parse userDetails");
      }
    } else {
      toast.error("Please log in to continue");
    }
  }, []);
  const handleFileUpload = (event) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    const uploadedFiles = Array.from(event.target.files);
    const invalidFiles = uploadedFiles.filter(
      (file) => !allowedExtensions.test(file.name)
    );
    if (invalidFiles.length > 0) {
      toast.error("Please upload only jpg, jpeg, png, gif files");
      return;
    }
    const validFiles = uploadedFiles.filter(
      (file) => file.size <= 10 * 1024 * 1024
    );
    const oversizedFiles = uploadedFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.error("Some files were not uploaded because they exceed 10MB");
    }
    const filesWithImageId = validFiles.map((file) => ({
      file,
      image_id: null,
      url: null,
    }));
    setFiles((prevFiles) => [...prevFiles, ...filesWithImageId]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };
  const removePreview = (index, image_id) => {
    if (image_id) {
      deletePropertyImage(image_id);
    } else {
      const newPreviews = previews.filter((_, i) => i !== index);
      setPreviews(newPreviews);
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      if (featuredIndex === index) {
        setFeaturedIndex(null);
      } else if (featuredIndex > index) {
        setFeaturedIndex(featuredIndex - 1);
      }
    }
  };
  const handleSetFeatured = (index) => {
    setFeaturedIndex(index);
  };
  async function deletePropertyImage(image_id) {
    try {
      const response = await Propertyapi.post("deletePropertyPhoto", {
        photo_id: image_id,
        user_id: userInfo?.user_id,
        unique_property_id: unique_property_id,
      });
      const data = response.data;
      if (data.status === "error") {
        setErrorMessages({
          message: data.message,
          server_res: data.server_res,
        });
        setErrorModalOpen(true);
        setIsLoadingEffect(false);
        return;
      }
      getPropertyPhotos();
      toast.success("Image removed successfully");
    } catch (error) {
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
      setIsLoadingEffect(false);
    }
  }
  const handleVideoUpload = (event) => {
    const allowedExtensions = /(\.mp4)$/i;
    const uploadedFiles = Array.from(event.target.files);
    const invalidFiles = uploadedFiles.filter(
      (file) => !allowedExtensions.test(file.name)
    );
    if (invalidFiles.length > 0) {
      toast.error("Please upload only mp4 files");
      return;
    }
    const validFiles = uploadedFiles.filter(
      (file) => file.size <= 30 * 1024 * 1024
    );
    const oversizedFiles = uploadedFiles.filter(
      (file) => file.size > 30 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.error(
        "Some video files were not uploaded because they exceed 30MB"
      );
    }
    const filesWithVideoType = validFiles.map((file) => ({
      file,
      videotype: "video",
    }));
    setVideoFiles((prevFiles) => [...prevFiles, ...filesWithVideoType]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setVideoPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };
  const handleVideoTypeChange = (index, value) => {
    setVideoFiles((prev) => {
      const updated = [...prev];
      updated[index].videotype = value;
      return updated;
    });
  };
  const removeVideoPreview = (index, video_id) => {
    if (video_id) {
      deletePropertyVideo(video_id);
    } else {
      const newPreviews = videoPreviews.filter((_, i) => i !== index);
      setVideoPreviews(newPreviews);
      const newFiles = videoFiles.filter((_, i) => i !== index);
      setVideoFiles(newFiles);
    }
  };
  async function deletePropertyVideo(video_id) {
    try {
      const response = await Propertyapi.post("deletepropertyvideo", {
        video_id: video_id,
        user_id: userInfo?.user_id,
        unique_property_id: unique_property_id,
      });
      const data = response.data;
      if (data.status === "error") {
        setErrorMessages({
          message: data.message,
          server_res: data.server_res,
        });
        setErrorModalOpen(true);
        setIsLoadingEffect(false);
        return;
      }
      getPropertyVideos();
      toast.success("Video removed successfully");
    } catch (error) {
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
      setIsLoadingEffect(false);
    }
  }
  const handleFloorPlanUpload = (event) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    const uploadedFiles = Array.from(event.target.files);
    const invalidFiles = uploadedFiles.filter(
      (file) => !allowedExtensions.test(file.name)
    );
    if (invalidFiles.length > 0) {
      toast.error("Please upload only jpg, jpeg, png, gif files");
      return;
    }
    const validFiles = uploadedFiles.filter(
      (file) => file.size <= 10 * 1024 * 1024
    );
    const oversizedFiles = uploadedFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.error("Some files were not uploaded because they exceed 10MB");
    }
    const filesWithImageId = validFiles.map((file) => ({
      file,
      image_id: null,
      url: null,
    }));
    setFloorPlanFiles((prevFiles) => [...prevFiles, ...filesWithImageId]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setFloorPlanPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };
  const removeFloorPlanPreview = (index, image_id) => {
    if (image_id) {
      deletePropertyFloorPlan(image_id);
    } else {
      const newPreviews = floorPlanPreviews.filter((_, i) => i !== index);
      setFloorPlanPreviews(newPreviews);
      const newFiles = floorPlanFiles.filter((_, i) => i !== index);
      setFloorPlanFiles(newFiles);
    }
  };
  async function deletePropertyFloorPlan(image_id) {
    try {
      const response = await Propertyapi.post("deletepropertyfloorplan", {
        photo_id: image_id,
        user_id: userInfo?.user_id,
        unique_property_id: unique_property_id,
      });
      const data = response.data;
      if (data.status === "error") {
        setErrorMessages({
          message: data.message,
          server_res: data.server_res,
        });
        setErrorModalOpen(true);
        setIsLoadingEffect(false);
        return;
      }
      getPropertyFloorPlans();
      toast.success("Floorplan removed successfully");
    } catch (error) {
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
      setIsLoadingEffect(false);
    }
  }
  async function submitPhotosVideos(data) {
    const formData = new FormData();
    formData.append("user_id", userInfo?.user_id);
    formData.append("unique_property_id", unique_property_id);
    files.forEach((file) => {
      formData.append("photo", file.file);
      formData.append("image_id", file.image_id);
      if (file === files[featuredIndex]) {
        formData.append("featured_image", file.file);
      }
    });
    videoFiles.forEach((file) => {
      formData.append("video", file.file);
      formData.append("video_type", file.videotype);
      formData.append("video_id", file.video_id);
    });
    try {
      const response = await Propertyapi.post("addphotosvideos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = response.data;
      if (data.status === "error") {
        setErrorMessages({ message: data.message });
        setErrorModalOpen(true);
        setIsLoadingEffect(false);
        return;
      }
      toast.success("Photos uploaded successfully");
      setIsLoadingEffect(false);
    } catch (error) {
      setErrorMessages({
        message: error.message,
        server_res: error.response ? error.response.data : null,
      });
      setErrorModalOpen(true);
      setIsLoadingEffect(false);
    }
  }
  async function submitFloorPlans(data) {
    const formData = new FormData();
    formData.append("user_id", userInfo?.user_id);
    formData.append("unique_property_id", unique_property_id);
    floorPlanFiles.forEach((file) => {
      formData.append("photo", file.file);
      formData.append("image_id", file.image_id);
    });
    try {
      const response = await Propertyapi.post(
        "addpropertyfloorplans",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const data = response.data;
      if (data.status === "error") {
        setErrorMessages({ message: data.message });
        setErrorModalOpen(true);
        setIsLoadingEffect(false);
        return;
      }
      toast.success("Floorplans uploaded successfully");
      setIsLoadingEffect(false);
    } catch (error) {
      setErrorMessages({
        message: error.message,
        server_res: error.response ? error.response.data : null,
      });
      setErrorModalOpen(true);
      setIsLoadingEffect(false);
    }
  }
  const handlePhotosSubmit = async (data) => {
    setIsLoadingEffect(true);
    if (previews.length === 0) {
      setIsLoadingEffect(false);
      toast.error("Please upload at least one Property photo");
      return;
    }
    if (featuredIndex === null || featuredIndex === -1) {
      setIsLoadingEffect(false);
      toast.error("Please select a featured image");
      return;
    }
    await submitPhotosVideos(data);
    await submitFloorPlans(data);
    await getPropertyDetails();
    setCurrentStep((prev) => prev + 1);
    router.replace(
      `/addProperty?active_step=${"review"}&status=inprogress&property_id=${unique_property_id}`
    );
  };
  async function getPropertyPhotos() {
    try {
      const response = await Propertyapi.get("getpropertyphotos", {
        params: { unique_property_id, user_id: userInfo?.user_id },
      });
      const data = response.data;
      if (data.status === "error") {
        setErrorMessages({
          message: data.message,
          server_res: data.server_res,
        });
        setErrorModalOpen(true);
        setIsLoadingEffect(false);
        return;
      }
      const imageFilesData = data.images.map((image) => ({
        file: new File([], image.url.split("/").pop()),
        url: image.url,
        image_id: image.id,
      }));
      setFiles(imageFilesData);
      const imagePreviews = data.images.map((image) => ({
        url: image.url,
        image_id: image.id,
      }));
      setPreviews(imagePreviews);
      setFeaturedIndex(data.featuredImageIndex ?? null);
    } catch (error) {
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
      setIsLoadingEffect(false);
    }
  }
  async function getPropertyVideos() {
    setIsLoadingEffect(true);
    try {
      const response = await Propertyapi.get("getpropertyvideos", {
        params: { unique_property_id, user_id: userInfo?.user_id },
      });
      const data = response.data;
      if (data.status === "error") {
        setErrorMessages({
          message: data.message,
          server_res: data.server_res,
        });
        setErrorModalOpen(true);
        return;
      }
      const videoFilesData = data.videos.map((video) => ({
        file: new File([], video.url.split("/").pop()),
        videotype: video.type,
        video_id: video.id,
      }));
      setVideoFiles(videoFilesData);
      const videoBlobs = await Promise.all(
        data.videos.map(async (video) => {
          try {
            const res = await fetch(video.url);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const blob = await res.blob();
            return {
              url: URL.createObjectURL(blob),
              type: video.type,
              video_id: video.id,
            };
          } catch (error) {
            console.error("Error fetching video:", error);
            return null;
          }
        })
      );
      setVideoPreviews(videoBlobs.filter(Boolean));
    } catch (error) {
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
    } finally {
      setIsLoadingEffect(false);
    }
  }
  async function getPropertyFloorPlans() {
    try {
      const response = await Propertyapi.get("getfloorplansphotos", {
        params: { unique_property_id, user_id: userInfo?.user_id },
      });
      const data = response.data;
      if (data.status === "error") {
        setErrorMessages({
          message: data.message,
          server_res: data.server_res,
        });
        setErrorModalOpen(true);
        setIsLoadingEffect(false);
        return;
      }
      const floorPlanFilesData = data.images.map((image) => ({
        file: new File([], image.url.split("/").pop()),
        url: image.url,
        image_id: image.id,
      }));
      setFloorPlanFiles(floorPlanFilesData);
      const floorPlanPreviews = data.images.map((image) => ({
        url: image.url,
        image_id: image.id,
      }));
      setFloorPlanPreviews(floorPlanPreviews);
    } catch (error) {
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
      setIsLoadingEffect(false);
    }
  }
  const router = useRouter();
  const handlewithoutphotos = async () => {
    try {
      const response = await Propertyapi.post("propertywithoutphotos", {
        user_id: userInfo?.user_id,
        unique_property_id: unique_property_id,
      });
      const data = response.data;
      if (data.status === "error") {
        setErrorMessages({
          message: data.message,
          server_res: data.server_res,
        });
        setErrorModalOpen(true);
        setIsLoadingEffect(false);
        return;
      }
      setCurrentStep((prev) => prev + 1);
      router.replace(
        `/addProperty?active_step=${"review"}&status=inprogress&property_id=${unique_property_id}`
      );
    } catch (error) {
      setErrorMessages({ message: error.message });
      setErrorModalOpen(true);
      setIsLoadingEffect(false);
    }
  };
  useEffect(() => {
    if (userInfo?.user_id) {
      getPropertyPhotos();
      getPropertyVideos();
      getPropertyFloorPlans();
    }
  }, [userInfo]);
  return (
    <div className="relative mx-auto  px-4 sm:px-6 lg:px-8 py-6">
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
            onClick={() => {
              photoInputRef.current?.click();
            }}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition"
          >
            <CardContent className="space-y-4">
              <PhotoImage className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="mb-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    photoInputRef.current?.click();
                  }}
                >
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
            </CardContent>
            <Input
              {...register("photo")}
              type="file"
              ref={photoInputRef}
              accept="image/png,image/jpeg,image/jpg,image/gif"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
          <div
            onClick={() => videoInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition"
          >
            <CardContent className="space-y-4">
              <Video className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="mb-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    videoInputRef.current?.click();
                  }}
                >
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
            </CardContent>
            <Input
              {...register("video")}
              type="file"
              ref={videoInputRef}
              accept="video/mp4,video/avi,video/mov,video/flv,video/wmv"
              multiple
              className="hidden"
              onChange={handleVideoUpload}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3">
          {previews.length > 0 ? (
            previews.map((preview, idx) => (
              <div
                key={idx}
                className="relative group rounded-lg overflow-hidden shadow-md border-gray border-1"
                style={{ zIndex: 1 }}
              >
                <Image
                  src={preview?.url || preview}
                  alt={`Photo Preview ${idx}`}
                  className={`rounded-md w-full h-50 aspect-[4/3] object-contain ${
                    featuredIndex === idx ? "ring-2 ring-green-500" : ""
                  }`}
                  height={160}
                  width={160}
                  crossOrigin="anonymous"
                  onError={() =>
                    console.error(`Failed to load image: ${preview}`)
                  }
                />
                <X
                  size={20}
                  color="white"
                  onClick={() => removePreview(idx, preview?.image_id)}
                  className="absolute top-2 right-2 rounded-full bg-red-500 cursor-pointer z-10"
                />
                <div
                  className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full transition-opacity duration-200 cursor-pointer flex items-center gap-1 z-10 group-hover:opacity-100 ${
                    featuredIndex === idx
                      ? "bg-green-600 opacity-100"
                      : "bg-blue-600 opacity-0"
                  }`}
                  onClick={() => handleSetFeatured(idx)}
                >
                  {featuredIndex === idx ? "Featured" : "Set as Featured"}
                  {featuredIndex === idx && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
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
            videoPreviews.map((preview, idx) => (
              <div key={idx} className="relative">
                <video
                  src={preview.url || preview}
                  className="rounded-lg w-full h-30 aspect-video object-cover shadow-md border-gray border-1"
                  controls
                  crossOrigin="anonymous"
                />
                <X
                  size={20}
                  color="white"
                  className="absolute top-2 right-2 rounded-full bg-red-500 cursor-pointer z-10"
                  onClick={() => removeVideoPreview(idx, preview?.video_id)}
                />
                <Select
                  value={videoFiles[idx]?.videotype}
                  onValueChange={(value) => handleVideoTypeChange(idx, value)}
                  className="mt-2 w-full"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select video type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground col-span-full text-center">
              No videos selected
            </p>
          )}
        </div>
      </div>
      <div className="space-y-6 mt-10">
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
          <CardContent className="space-y-4">
            <PhotoImage className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <Button
                type="button"
                variant="outline"
                className="mb-2"
                onClick={(e) => {
                  e.stopPropagation();
                  floorPlanInputRef.current?.click();
                }}
              >
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
          </CardContent>
          <Input
            {...register("floorPlans")}
            type="file"
            ref={floorPlanInputRef}
            accept="image/png,image/jpeg,image/jpg,image/gif"
            multiple
            className="hidden"
            onChange={handleFloorPlanUpload}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {floorPlanPreviews.length > 0 ? (
            floorPlanPreviews.map((preview, idx) => (
              <div key={idx} className="relative ">
                <Image
                  src={preview?.url || preview}
                  alt={`Floor Plan Preview ${idx}`}
                  className="rounded-md w-full h-50 aspect-[4/3] object-contain shadow-md border-gray border-1"
                  height={160}
                  width={160}
                  crossOrigin="anonymous"
                />
                <X
                  size={20}
                  color="white"
                  onClick={() => removeFloorPlanPreview(idx, preview?.image_id)}
                  className="absolute top-2 right-2 rounded-full bg-red-500 cursor-pointer z-10"
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground col-span-full text-center">
              No floor plans selected
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end items-center mt-6">
        {previews.length > 0 ||
        videoPreviews.length > 0 ||
        floorPlanPreviews.length > 0 ? (
          <Button
            onClick={handleSubmit(handlePhotosSubmit)}
            disabled={isLoadingEffect}
            className="px-8 bg-[#1D3A76] hover:bg-blue-800 cursor-pointer"
          >
            {isLoadingEffect ? "Uploading..." : "Next: Add Review"}
          </Button>
        ) : (
          <Button
            variant="link"
            onClick={handlewithoutphotos}
            className="text-gray-600 underline cursor-pointer"
          >
            Continue without photos
          </Button>
        )}
      </div>
      {errorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-medium">Error</h2>
            <p className="mt-2">{errorMessages?.message}</p>
            <Button
              className="mt-4"
              onClick={() => setErrorModalOpen(false)}
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
export default Photoswrapper;
