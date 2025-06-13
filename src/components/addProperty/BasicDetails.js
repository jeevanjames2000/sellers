import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setBasicDetails } from "@/store/slices/addPropertySlice/basicDetailsSlice";
export default function BasicDetails({ property }) {
  const dispatch = useDispatch();
  const { watch, setValue } = useFormContext();
  const property_in = watch("property_in");
  const property_for = watch("property_for");
  const transaction_type = watch("transaction_type");
  const handleSetTransactionType = (value) => {
    setValue("transaction_type", value, { shouldValidate: true });
    dispatch(
      setBasicDetails({
        transaction_type: value,
      })
    );
  };
  const handleSetPropertyType = (key, value) => {
    setValue(key, value, { shouldValidate: true });
    dispatch(
      setBasicDetails({
        [key]: value,
      })
    );
  };
  useEffect(() => {
    if (property) {
      if (property.property_in) {
        setValue("property_in", property.property_in);
        dispatch(setBasicDetails({ property_in: property.property_in }));
      }
      if (property.property_for) {
        setValue("property_for", property.property_for);
        dispatch(setBasicDetails({ property_for: property.property_for }));
      }
      if (property.transaction_type) {
        setValue("transaction_type", property.transaction_type);
        dispatch(
          setBasicDetails({ transaction_type: property.transaction_type })
        );
      }
    }
  }, [property, setValue, dispatch]);
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
            onClick={() => handleSetPropertyType("property_in", "Residential")}
            className={`px-8 py-6 text-base ${
              property_in === "Residential"
                ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                : "bg-white text-black hover:bg-gray-100 border"
            }`}
          >
            Residential
          </Button>
          <Button
            type="button"
            onClick={() => handleSetPropertyType("property_in", "Commercial")}
            className={`px-8 py-6 text-base ${
              property_in === "Commercial"
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
          {["Sell", "Rent"].map((option) => (
            <Button
              key={option}
              type="button"
              onClick={() => handleSetPropertyType("property_for", option)}
              className={`px-8 py-6 text-base capitalize ${
                property_for === option
                  ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                  : "bg-white text-black hover:bg-gray-100 border"
              }`}
            >
              {option.replace("-", " ")}
            </Button>
          ))}
        </div>
      </div>
      {property_for === "Sell" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="text-lg font-medium">Transaction Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <Select
            value={transaction_type}
            onValueChange={(value) => handleSetTransactionType(value)}
          >
            <SelectTrigger className="py-6 text-xl">
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Resale">Resale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
