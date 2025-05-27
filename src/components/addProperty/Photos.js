import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Image } from "lucide-react";

export default function Photos() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-lg font-medium">Property Photos</Label>
        <p className="text-sm text-gray-600">
          Upload high-quality photos of your property. The first photo will be
          used as the main image.
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="space-y-4">
          <Image className="w-12 h-12 text-gray-400 mx-auto" />
          <div>
            <Button type="button" variant="outline" className="mb-2">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photos
            </Button>
            <p className="text-sm text-gray-500">
              or drag and drop photos here
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Supported formats: JPG, PNG, WebP (Max 5MB each)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Placeholder for uploaded photos */}
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <Image className="w-8 h-8 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
