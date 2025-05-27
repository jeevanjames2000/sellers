import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Review() {
  const { watch } = useFormContext();
  const formData = watch();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">
          Review Your Property Details
        </h3>
        <p className="text-sm text-gray-600">
          Please review all the information before submitting your property
          listing.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Property Type:</span>
              <Badge variant="secondary">
                {formData.propertyType || "Not specified"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Looking to:</span>
              <Badge variant="secondary">
                {formData.lookingTo || "Not specified"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">
                {formData.location || "Not specified"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Bedrooms:</span>
              <span className="font-medium">
                {formData.bedrooms || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bathrooms:</span>
              <span className="font-medium">
                {formData.bathrooms || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Area:</span>
              <span className="font-medium">
                {formData.area ? `${formData.area} sq ft` : "Not specified"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium text-green-600">
                {formData.price
                  ? `₹${Number(formData.price).toLocaleString()}`
                  : "Not specified"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-700">
              {[
                formData.streetAddress,
                formData.city,
                formData.state,
                formData.pincode,
              ]
                .filter(Boolean)
                .join(", ") || "Address not provided"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
