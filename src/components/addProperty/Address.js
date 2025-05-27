import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Address() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Street Address</Label>
        <Input
          {...register("streetAddress")}
          placeholder="Enter street address"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input {...register("city")} placeholder="City" />
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Input {...register("state")} placeholder="State" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>PIN Code</Label>
          <Input {...register("pincode")} placeholder="PIN Code" />
        </div>
        <div className="space-y-2">
          <Label>Landmark</Label>
          <Input {...register("landmark")} placeholder="Nearby landmark" />
        </div>
      </div>
    </div>
  );
}
