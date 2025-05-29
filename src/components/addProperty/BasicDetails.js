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
  const formData = watch();
  console.log("formData: ", formData);
  const propertyType = watch("propertyType");
  const lookingTo = watch("lookingTo");
  const transactionType = watch("transactionType");
  console.log("propertyType: ", propertyType, lookingTo, transactionType);

  const handleSetTransactionType = (value) => {
    setValue("transactionType", value, { shouldValidate: true });
  };
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-lg font-medium">Property Type</Label>
          <span className="text-red-500">*</span>
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => setValue("propertyType", "residential")}
            className={`px-8 py-6 text-base ${
              propertyType === "residential"
                ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                : "bg-white text-black hover:bg-gray-100 border"
            }`}
          >
            Residential
          </Button>
          <Button
            type="button"
            onClick={() => setValue("propertyType", "commercial")}
            className={`px-8 py-6 text-base ${
              propertyType === "commercial"
                ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                : "bg-white text-black hover:bg-gray-100 border"
            }`}
          >
            Commercial
          </Button>
        </div>
      </div>

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
              onClick={() => setValue("lookingTo", option)}
              className={`px-8 py-6 text-base capitalize ${
                lookingTo === option
                  ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                  : "bg-white text-black hover:bg-gray-100 border"
              }`}
            >
              {option.replace("-", " ")}
            </Button>
          ))}
        </div>
      </div>

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
