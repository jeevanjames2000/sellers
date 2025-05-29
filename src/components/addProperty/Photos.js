"use client";
import { useFormContext } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Image, Video, X, Bookmark } from "lucide-react";

export default function Photos() {
  const { register, setValue, watch } = useFormContext();
  const photoInputRef = useRef(null);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const photos = watch("photos");
  const videoInputRef = useRef(null);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const videos = watch("videos");
  const floorPlanInputRef = useRef(null);
  const [floorPlanPreviews, setFloorPlanPreviews] = useState([]);
  const floorPlans = watch("floorPlans");
  const [featuredImageIndex, setFeaturedImageIndex] = useState(null);

  useEffect(() => {
    if (photos && photos.length > 0) {
      const urls = Array.from(photos).map((file) => URL.createObjectURL(file));
      setPhotoPreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }
    setPhotoPreviews([]);
  }, [photos]);

  useEffect(() => {
    if (videos && videos.length > 0) {
      const urls = Array.from(videos).map((file) => URL.createObjectURL(file));
      setVideoPreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }
    setVideoPreviews([]);
  }, [videos]);

  useEffect(() => {
    if (floorPlans && floorPlans.length > 0) {
      const urls = Array.from(floorPlans).map((file) =>
        URL.createObjectURL(file)
      );
      setFloorPlanPreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }
    setFloorPlanPreviews([]);
  }, [floorPlans]);

  const handleClickUpload = (ref) => () => ref.current?.click();

  const handleFileChange = (field) => (e) => {
    const files = e.target.files;
    if (files) {
      setValue(field, files, { shouldValidate: true });
    }
  };

  const removeFile = (field, index) => () => {
    const currentFiles = watch(field);
    if (currentFiles) {
      const newFiles = Array.from(currentFiles).filter((_, i) => i !== index);
      const dataTransfer = new DataTransfer();
      newFiles.forEach((file) => dataTransfer.items.add(file));
      setValue(field, dataTransfer.files, { shouldValidate: true });
    }
  };

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
                  <p className="text-sm text-gray-500">
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
                  <p className="text-sm text-gray-500">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {photoPreviews.length > 0
              ? photoPreviews.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-md overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Photo Preview ${idx}`}
                      className={`object-cover w-full h-40 rounded-md ${
                        featuredImageIndex === idx ? "ring-2 ring-blue-500" : ""
                      }`}
                    />

                    {/* Remove icon */}
                    <X
                      size={20}
                      color="white"
                      className="absolute top-2 right-2 rounded-full bg-red-500 cursor-pointer"
                      onClick={removeFile("photos", idx)}
                    />

                    {/* Set as featured button */}
                    <div
                      className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex items-center gap-1"
                      onClick={() => setFeaturedImageIndex(idx)}
                    >
                      Set as Featured Image
                      {featuredImageIndex === idx && <Bookmark size={15} />}
                    </div>
                  </div>
                ))
              : null}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videoPreviews.length > 0
              ? videoPreviews.map((url, idx) => (
                  <div key={idx} className="relative">
                    <video
                      src={url}
                      className="rounded-md object-cover w-full h-40"
                      controls
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
              : null}
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
                <p className="text-sm text-gray-500">
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
      </div>
    </div>
  );
}
