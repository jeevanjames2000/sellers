import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  setLookingTo,
  setPropertyType,
  setTransactionType,
} from "@/store/slices/addPropertySlice/basicDetailsSlice";

export default function BasicDetails() {
  const { register, watch, setValue } = useFormContext();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.basicDetails);
  const formData = watch();
  console.log("formData: ", formData);

  const propertyType = watch("propertyType");
  const lookingTo = watch("lookingTo");
  const transactionType = watch("transactionType");

  useEffect(() => {
    register("propertyType");
    register("lookingTo");
    register("transactionType");
  }, []);

  const handleSetPropertyType = (value) => {
    setValue("propertyType", value, { shouldValidate: true });
    dispatch(setPropertyType(value));
  };

  const handleSetLookingTo = (value) => {
    setValue("lookingTo", value, { shouldValidate: true });
    dispatch(setLookingTo(value));
    if (value !== "sell") {
      setValue("transactionType", "", { shouldValidate: true });
      dispatch(setTransactionType(""));
    }
  };

  const handleSetTransactionType = (value) => {
    setValue("transactionType", value, { shouldValidate: true });
    dispatch(setTransactionType(value));
  };

  return (
    <div className="space-y-8">
      {/* Property Type */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-lg font-medium">Property Type</Label>
          <span className="text-red-500">*</span>
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={propertyType === "residential" ? "default" : "outline"}
            onClick={() => handleSetPropertyType("residential")}
            className={
              propertyType === "residential"
                ? "px-8 py-6 text-base bg-[#1D3A76]"
                : "px-8 py-6 text-base bg-white "
            }
          >
            Residential
          </Button>
          <Button
            type="button"
            variant={propertyType === "commercial" ? "default" : "outline"}
            onClick={() => handleSetPropertyType("commercial")}
            className={
              propertyType === "commercial"
                ? "px-8 py-6 text-base bg-[#1D3A76] "
                : "px-8 py-6 text-base bg-white "
            }
          >
            Commercial
          </Button>
        </div>
      </div>

      {/* Looking To */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-lg font-medium">Looking To</Label>
          <span className="text-red-500">*</span>
        </div>
        <div className="flex gap-4">
          {["sell", "rent", "pg-co-living"].map((option) => (
            <Button
              key={option}
              type="button"
              variant={lookingTo === option ? "default" : "outline"}
              onClick={() => handleSetLookingTo(option)}
              className="px-8 py-6 text-base capitalize"
            >
              {option.replace("-", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Transaction Type */}
      {lookingTo === "sell" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="text-lg font-medium">Transaction Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <Select
            value={transactionType}
            onValueChange={(value) => handleSetTransactionType(value)}
          >
            <SelectTrigger className="py-6 text-xl">
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="resale">Resale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
