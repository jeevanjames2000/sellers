import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function BasicDetails() {
  const { register, watch, setValue } = useFormContext();
  const propertyType = watch("propertyType");
  const lookingTo = watch("lookingTo");
  const transactionType = watch("transactionType");
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
            variant={propertyType === "residential" ? "default" : "outline"}
            onClick={() => setValue("propertyType", "residential")}
            className="px-8 py-6 text-base"
          >
            Residential
          </Button>
          <Button
            type="button"
            variant={propertyType === "commercial" ? "default" : "outline"}
            onClick={() => setValue("propertyType", "commercial")}
            className="px-8 py-6 text-base"
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
              variant={lookingTo === option ? "default" : "outline"}
              onClick={() => {
                setValue("lookingTo", option);
                if (option !== "sell") setValue("transactionType", "");
              }}
              className="px-8 py-6 text-base capitalize"
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
            onValueChange={(value) => setValue("transactionType", value)}
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
