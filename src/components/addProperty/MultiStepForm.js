"use client";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import useFetchAndSetProperty from "../services/useFetchAndSetProperty";
import { submitBasicDetails } from "../services/submitBasicDetails";
import { submitPropertyDetails } from "../services/submitPropertyDetails";
import { submitAddress } from "../services/submitAddress";
import LimitReachedDialog from "../shared/LimitReachedDialog";
import dynamic from "next/dynamic";
const BasicDetails = dynamic(() => import("./BasicDetails"), { ssr: true });
const PropertyDetails = dynamic(
  () => import("./propertyDetails/PropertyDetails"),
  { ssr: true }
);
const Address = dynamic(() => import("./Address"), { ssr: true });
const Photos = dynamic(() => import("./Photos"), { ssr: false });
const Review = dynamic(() => import("./Review"), { ssr: true });
const steps = [
  { label: "Basic Details", component: BasicDetails, key: "basicdetails" },
  {
    label: "Property Details",
    component: PropertyDetails,
    key: "propertydetails",
  },
  { label: "Address", component: Address, key: "address" },
  { label: "Property Photos", component: Photos, key: "propertyphotos" },
  { label: "Review", component: Review, key: "review" },
];
const areObjectsEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
};
const getBasicDetailsPayload = (formData) => ({
  property_in: formData.property_in || "",
  property_for: formData.property_for || "",
  transaction_type: formData.transaction_type || "",
});
const compareBasicDetails = (formData, property) => {
  const formPayload = getBasicDetailsPayload(formData);
  const propertyPayload = {
    property_in: property?.property_in || "",
    property_for: property?.property_for || "",
    transaction_type: property?.transaction_type || "",
  };
  return areObjectsEqual(formPayload, propertyPayload);
};
const getAddressPayload = (formData) => {
  const payload = {
    city_id: formData.city_id || "",
    state_id: formData.state_id || "",
    locality: formData.locality || "",
    unit_flat_house_no: formData.unit_flat_house_no || "",
    floors: formData.floors || "",
    total_floors: formData.total_floors || "",
    property_name: formData.property_name || "",
    plot_number: formData.plot_number || "",
    builder_name: formData.builder_name || "",
  };
  if (formData.sub_type === "Independent Villa") {
    const villaNumber = parseInt(formData.villa_number);
    payload.villa_number = !isNaN(villaNumber) ? villaNumber : null;
  } else {
    payload.villa_number = null;
  }
  return payload;
};
const compareAddress = (formData, property) => {
  const formPayload = getAddressPayload(formData);
  const propertyPayload = {
    city_id: property?.city_id || "",
    state_id: property?.state_id || "",
    locality: property?.location_id || "",
    unit_flat_house_no: property?.unit_flat_house_no || "",
    floors: property?.floors || "",
    total_floors: property?.total_floors || "",
    property_name: property?.property_name || "",
    plot_number: property?.plot_number || "",
    builder_name: property?.builder_name || "",
    villa_number:
      property?.sub_type === "Independent Villa"
        ? parseInt(property.villa_number) || null
        : null,
  };
  return areObjectsEqual(formPayload, propertyPayload);
};
export default function MultiStepForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [propertyId, setPropertyId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaState, setMediaState] = useState({
    photoPreviews: [],
    photoFiles: [],
    videoPreviews: [],
    videoFiles: [],
    floorPlanPreviews: [],
    floorPlanFiles: [],
    featuredImageIndex: null,
    isPhotosSubmitSuccess: null,
  });
  const [places, setPlaces] = useState([]);
  const [fac, setFac] = useState([]);
  const params = useMemo(
    () => ({
      propertyId: searchParams.get("property_id"),
      activeStep: searchParams.get("active_step"),
    }),
    [searchParams]
  );
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      property_in: "",
      property_for: "",
      transaction_type: "",
    },
    shouldUnregister: true,
  });
  const { property, setProperty, getPropertyDetails } = useFetchAndSetProperty(
    propertyId,
    methods.reset
  );
  useEffect(() => {
    if (params.propertyId) {
      setPropertyId(params.propertyId);
    }
    if (params.activeStep) {
      const stepIndex = steps.findIndex(
        (step) => step.key === params.activeStep.toLowerCase()
      );
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
      }
    }
  }, [params]);
  const handlePhotosSubmit = useCallback((success) => {
    setMediaState((prev) => ({ ...prev, isPhotosSubmitSuccess: success }));
  }, []);
  const proceedToNextStep = useCallback(
    async (newPropertyId) => {
      setIsSubmitting(false);
      const nextStep = currentStep + 1;
      const stepKey = steps[nextStep]?.key || steps[currentStep].key;
      setCurrentStep(nextStep);
      router.push(
        `/addProperty?active_step=${stepKey}&status=inprogress&property_id=${
          newPropertyId || propertyId || methods.getValues().unique_property_id
        }`,
        { scroll: false }
      );
    },
    [currentStep, propertyId, router, methods]
  );
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [packageCity, setPackageCity] = useState("");
  const onNext = useCallback(async () => {
    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);
    const formData = methods.getValues();
    const userInfo = JSON.parse(localStorage.getItem("userDetails")) || {};
    const selectedCity =
      localStorage.getItem("City") || formData.city || "Hyderabad";
    setPackageCity(selectedCity);
    if (currentStep === 0) {
      if (compareBasicDetails(formData, property)) {
        await proceedToNextStep();
        setIsSubmitting(false);
        return;
      }
      const { success, data, message } = await submitBasicDetails(
        {
          propertyType: formData.property_in,
          lookingTo: formData.property_for,
          transactionType: formData.transaction_type,
          unique_property_id: propertyId,
          city: selectedCity,
        },
        dispatch,
        userInfo
      );
      setIsSubmitting(false);
      if (success) {
        localStorage.setItem("City", selectedCity);
        setPropertyId(data.unique_property_id);
        await getPropertyDetails();
        methods.reset(
          {
            ...formData,
            ...data,
            property_id: data.property_id,
            unique_property_id: data.unique_property_id,
            updated_date: data.updated_date,
            user_type: data.user_type,
          },
          { keepDirty: false }
        );
        await proceedToNextStep(data.unique_property_id);
      } else {
        setIsLimitDialogOpen(true);
        toast.error(message || "Failed to submit basic details");
      }
    } else if (currentStep === 1) {
      const { success, data, message } = await submitPropertyDetails(
        formData,
        dispatch,
        userInfo,
        places,
        fac
      );
      setIsSubmitting(false);
      if (success) {
        await getPropertyDetails();
        methods.reset(
          {
            ...formData,
            ...data,
            property_id: propertyId,
            unique_property_id: propertyId,
          },
          { keepDirty: false }
        );
        await proceedToNextStep();
      } else {
        toast.error("Failed to submit property details");
      }
    } else if (currentStep === 2) {
      if (compareAddress(formData, property)) {
        await proceedToNextStep();
        setIsSubmitting(false);
        return;
      }
      const { success, data, message } = await submitAddress(
        formData,
        dispatch,
        userInfo
      );
      setIsSubmitting(false);
      if (success) {
        await getPropertyDetails();
        methods.reset(
          {
            ...formData,
            ...data,
            property_id: propertyId,
            unique_property_id: propertyId,
            villa_number:
              formData.sub_type === "Independent Villa"
                ? formData.villa_number
                : null,
          },
          { keepDirty: false }
        );
        await proceedToNextStep();
      } else {
        toast.error("Failed to submit address");
      }
    } else if (currentStep === 3) {
      setIsSubmitting(false);
      const { photoFiles, videoFiles, floorPlanFiles, isPhotosSubmitSuccess } =
        mediaState;
      if (
        isPhotosSubmitSuccess === true ||
        (!photoFiles.length &&
          !videoFiles.length &&
          !floorPlanFiles.length &&
          isPhotosSubmitSuccess === null)
      ) {
        if (isPhotosSubmitSuccess === true) {
          await getPropertyDetails();
        }
        setMediaState({
          photoPreviews: [],
          photoFiles: [],
          videoPreviews: [],
          videoFiles: [],
          floorPlanPreviews: [],
          floorPlanFiles: [],
          featuredImageIndex: null,
          isPhotosSubmitSuccess: null,
        });
        methods.reset(
          {
            ...formData,
            property_id: propertyId,
            unique_property_id: propertyId,
          },
          { keepDirty: false }
        );
        await proceedToNextStep();
      } else if (isPhotosSubmitSuccess === false) {
        toast.error("Failed to submit photos/videos");
        setMediaState((prev) => ({ ...prev, isPhotosSubmitSuccess: null }));
      }
    } else {
      await proceedToNextStep();
    }
  }, [
    currentStep,
    property,
    propertyId,
    methods,
    dispatch,
    mediaState,
    places,
    fac,
    proceedToNextStep,
  ]);
  const onBack = useCallback(() => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    const stepKey = steps[prevStep].key;
    router.push(
      `/addProperty?active_step=${stepKey}&status=inprogress&property_id=${propertyId}`,
      { scroll: false }
    );
  }, [currentStep, propertyId, router]);
  const onSubmit = useCallback((data) => {}, []);
  const handleRoute = useCallback(() => {
    router.push("/dashboard", { scroll: false });
  }, [router]);
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const CurrentComponent = steps[currentStep].component;
  return (
    <div className="min-h-screen bg-gray-50 p-2 w-full">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b md:hidden">
            <Progress
              value={progressPercentage}
              className="h-2 bg-blue-100 [&>div]:bg-[#1D3A76]"
            />
            <p className="text-sm text-[#1D3A76] mt-2 text-right">
              {Math.round(progressPercentage)}%
            </p>
          </div>
          <div className="flex min-h-[600px] w-full">
            <div className="hidden md:flex flex-col w-[15%] min-w-[100px] max-w-[300px] bg-gray-50 p-6 border-r overflow-y-auto">
              <Button
                variant="ghost"
                className="mb-6 text-gray-600 hover:text-gray-800"
                onClick={handleRoute}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to dashboard
              </Button>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Post your Property
                </h3>
                <p className="text-sm text-gray-500">
                  Sell or rent your property
                </p>
              </div>
              <div className="mb-8">
                <Progress
                  value={progressPercentage}
                  className="h-2 bg-blue-100 [&>div]:bg-[#1D3A76]"
                />
                <p className="text-sm text-[#1D3A76] mt-2">
                  {Math.round(progressPercentage)}%
                </p>
              </div>
              <ul className="space-y-6">
                {steps.map((step, index) => (
                  <li key={step.key} className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                        index < currentStep
                          ? "bg-[#1D3A76] border-[#1D3A76] text-white"
                          : index === currentStep
                          ? "border-blue-600 text-blue-600 bg-white"
                          : "border-gray-300 text-gray-400 bg-white"
                      }`}
                    >
                      {index < currentStep ? "✓" : ""}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium ${
                          index === currentStep
                            ? "text-[#1D3A76]"
                            : index < currentStep
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {index < currentStep
                          ? "Completed"
                          : index === currentStep
                          ? "In Progress"
                          : "Pending"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-12 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Require Assistance?
                </p>
                <div className="flex items-center text-[#1D3A76] font-semibold">
                  <Phone className="w-4 h-4 mr-2" />
                  +91 9553919919
                </div>
              </div>
            </div>
            <div className="flex-1 w-full max-w-full p-4 overflow-y-auto">
              <div className="flex gap-3 items-center mb-8">
                {steps[currentStep].label !== "Basic Details" && (
                  <button type="button" onClick={onBack}>
                    <ArrowLeft className="text-[#1D3A76] w-6 h-6 cursor-pointer" />
                  </button>
                )}
                <h2 className="text-2xl font-bold text-[#1D3A76] uppercase tracking-wide">
                  {steps[currentStep].label}
                </h2>
              </div>
              <div className="mb-8">
                <CurrentComponent
                  property={property}
                  setProperty={setProperty}
                  unique_property_id={propertyId}
                  places={places}
                  setPlaces={setPlaces}
                  setFac={setFac}
                  fac={fac}
                  photoPreviews={mediaState.photoPreviews}
                  setPhotoPreviews={(previews) =>
                    setMediaState((prev) => ({
                      ...prev,
                      photoPreviews: previews,
                    }))
                  }
                  photoFiles={mediaState.photoFiles}
                  setPhotoFiles={(files) =>
                    setMediaState((prev) => ({ ...prev, photoFiles: files }))
                  }
                  videoPreviews={mediaState.videoPreviews}
                  setVideoPreviews={(previews) =>
                    setMediaState((prev) => ({
                      ...prev,
                      videoPreviews: previews,
                    }))
                  }
                  videoFiles={mediaState.videoFiles}
                  setVideoFiles={(files) =>
                    setMediaState((prev) => ({ ...prev, videoFiles: files }))
                  }
                  floorPlanPreviews={mediaState.floorPlanPreviews}
                  setFloorPlanPreviews={(previews) =>
                    setMediaState((prev) => ({
                      ...prev,
                      floorPlanPreviews: previews,
                    }))
                  }
                  floorPlanFiles={mediaState.floorPlanFiles}
                  setFloorPlanFiles={(files) =>
                    setMediaState((prev) => ({
                      ...prev,
                      floorPlanFiles: files,
                    }))
                  }
                  featuredImageIndex={mediaState.featuredImageIndex}
                  setFeaturedImageIndex={(index) =>
                    setMediaState((prev) => ({
                      ...prev,
                      featuredImageIndex: index,
                    }))
                  }
                  onSubmit={handlePhotosSubmit}
                  setCurrentStep={setCurrentStep}
                  steps={steps}
                  currentStep={currentStep}
                />
              </div>
              <div className="flex justify-between pt-6 border-t">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="px-6"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <div className="ml-auto">
                  {currentStep < steps.length - 1 && currentStep !== 3 ? (
                    <Button
                      type="button"
                      onClick={onNext}
                      disabled={isSubmitting}
                      className="px-8 bg-[#1D3A76] hover:bg-blue-800"
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : `Next: Add ${steps[currentStep + 1].label}`}
                    </Button>
                  ) : currentStep === steps.length - 1 ? (
                    <Button
                      onClick={handleRoute}
                      className="px-8 bg-green-600 hover:bg-green-700"
                    >
                      Go to dashboard
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
      <LimitReachedDialog
        open={isLimitDialogOpen}
        onOpenChange={setIsLimitDialogOpen}
        city={packageCity}
      />
    </div>
  );
}
