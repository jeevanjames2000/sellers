"use client";
import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone } from "lucide-react";
import BasicDetails from "./BasicDetails";
import PropertyDetails from "./PropertyDetails";
import Address from "./Address";
import Photos from "./Photos";
import Review from "./Review";
const steps = [
  { label: "Basic Details", component: BasicDetails },
  { label: "Property Details", component: PropertyDetails },
  { label: "Address", component: Address },
  { label: "Property Photos", component: Photos },
  { label: "Review", component: Review },
];
export default function MultiStepForm() {
  const methods = useForm({ mode: "onChange" });
  const [currentStep, setCurrentStep] = useState(0);
  const onNext = () => setCurrentStep((prev) => prev + 1);
  const onBack = () => setCurrentStep((prev) => prev - 1);
  const onSubmit = (data) => {
    console.log("Final Submit:", data);
  };
  const CurrentComponent = steps[currentStep].component;
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden "
        >
          <div className="flex min-h-[600px]">
            <div className="w-1/3 max-w-sm bg-gray-50 p-6 border-r h-screen sticky top-0 overflow-y-auto">
              <Button
                variant="ghost"
                className="mb-6 text-gray-600 hover:text-gray-800"
                onClick={() => console.log("Back to dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to dashboard
              </Button>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Post your Property
                </h3>
                <p className="text-sm text-gray-500">
                  sell or rent your property
                </p>
              </div>

              <div className="mb-8 ">
                <Progress
                  value={progressPercentage}
                  className="h-2 bg-blue-100 [&>div]:bg-blue-600"
                />

                <p className="text-sm text-[#1D3A76] mt-2">
                  {Math.round(progressPercentage)}%
                </p>
              </div>

              <ul className="space-y-6">
                {steps.map((step, index) => (
                  <li key={index} className="flex items-center space-x-3">
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

            <div className="w-2/3 max-h-screen overflow-y-auto p-8">
              <h2 className="text-2xl font-bold text-[#1D3A76] mb-8 uppercase tracking-wide">
                {steps[currentStep].label}
              </h2>
              <div className="mb-8">
                <CurrentComponent />
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
                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={onNext}
                      className="px-8 bg-[#1D3A76] hover:bg-blue-800"
                    >
                      Next: Add {steps[currentStep + 1].label}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="px-8 bg-green-600 hover:bg-green-700"
                    >
                      Submit Property
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
