import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

const LimitReachedDialog = ({ open, onOpenChange, city, message }) => {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/packages");
    onOpenChange(false);
  };

  const displayMessage =
    message ||
    `You’ve reached the maximum listing limit for ${
      city || "your city"
    }. To add more listings, please upgrade your package.`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {message ? "Contact Support" : "Listing Limit Reached"}
          </AlertDialogTitle>
          <AlertDialogDescription>{displayMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleUpgrade}
          >
            Upgrade Package
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LimitReachedDialog;
