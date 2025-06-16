import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyCard from "../listings/PropertyCard";

const formatKey = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function Review({ property, setCurrentStep }) {
  console.log("property: ", property);
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

      <PropertyCard
        id={property.unique_property_id}
        title={property.property_name}
        price={property.property_cost || "N/A"}
        bhk={property.bedrooms || "N/A"}
        type={property.property_in}
        status={
          property.property_status === 1
            ? "Approved"
            : property.property_status === 0
            ? "Review"
            : "Rejected"
        }
        location={property.google_address || "N/A"}
        facing={property.facing || null}
        lastUpdated={property.updated_date || "N/A"}
        expiryDate={property.expiry_date || "N/A"}
        furnished_status={property.furnished_status || "N/A"}
        enquiries={property.enquiries || 0}
        favourites={property.favourites || 0}
        image={
          property.image
            ? `https://api.meetowner.in/uploads/${property.image}`
            : "https://placehold.co/400x300"
        }
        developer={property.user?.name || "N/A"}
        propertyFor={property.property_for || "N/A"}
        propertyType={property.property_in || "N/A"}
        propertySubType={property.sub_type || "N/A"}
        monthly_rent={property.monthly_rent || "N/A"}
        occupancy={property.occupancy || "N/A"}
        available_from={property.available_from || "N/A"}
        user_id={property.user_id}
        setCurrentStep={setCurrentStep}
      />
    </div>
  );
}
