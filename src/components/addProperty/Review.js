import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const basicDetailsKeys = ["propertyType", "lookingTo", "transactionType"];
const propertyDetailsKeys = [
  "propertySubtype",
  "constructionStatus",
  "bhk",
  "bathroom",
  "balcony",
  "furnishType",
  "ageOfProperty",
  "areaUnit",
  "builtupArea",
  "carpetArea",
  "totalProjectArea",
  "unitCost",
  "pentHouse",
  "propertyCost",
  "facilities",
  "possessionStatus",
  "investorProperty",
  "loanFacility",
  "facing",
  "carParking",
  "bikeParking",
  "openParking",
  "nearbyPlace",
  "distanceFromProperty",
  "servantRoom",
  "propertyDescription",
];
const addressKeys = [
  "state",
  "city",
  "locality",
  "flatNumber",
  "floorNumber",
  "totalFloors",
];
const photoKeys = ["photos", "videos", "floorPlans"];

const formatKey = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const renderSection = (title, keys, formData) => {
  const entries = keys
    .map((key) => [key, formData[key]])
    .filter(([_, value]) => value !== undefined && value !== "");

  if (entries.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map(([key, value]) => {
          let displayValue;

          if (Array.isArray(value)) {
            displayValue = value.length ? value.join(", ") : "Not specified";
          } else if (typeof value === "boolean") {
            displayValue = value ? "Yes" : "No";
          } else {
            displayValue = value;
          }

          return (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600">{formatKey(key)}:</span>
              <span className="font-medium text-right max-w-xs truncate">
                {displayValue}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default function Review() {
  const { watch } = useFormContext();

  const formData = watch();
  console.log("formData: ", formData);

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

      {renderSection("Basic Details", basicDetailsKeys, formData)}
      {renderSection("Property Details", propertyDetailsKeys, formData)}
      {renderSection("Address", addressKeys, formData)}
      {renderSection("Photos & Media", photoKeys, formData)}
    </div>
  );
}
