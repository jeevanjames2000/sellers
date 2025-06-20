"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId") || "N/A";
  const amount = searchParams.get("amount") || "N/A";
  const currency = searchParams.get("currency") || "INR";
  const planName = decodeURIComponent(searchParams.get("planName") || "N/A");
  const date = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const handleNavigate = () => {
    router.push("/dashboard");
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg border border-green-100">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Payment Successful!
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Thank you for subscribing to the {planName} plan.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-gray-500">Transaction ID:</div>
            <div className="font-medium text-gray-800">{transactionId}</div>
            <div className="text-gray-500">Plan:</div>
            <div className="font-medium text-gray-800">{planName}</div>
            <div className="text-gray-500">Amount:</div>
            <div className="font-medium text-gray-800">
              {currency} {parseFloat(amount).toFixed(2)}
            </div>
            <div className="text-gray-500">Date & Time:</div>
            <div className="font-medium text-gray-800">{date}</div>
            <div className="text-gray-500">Status:</div>
            <div>
              <Badge variant="default" className="bg-green-500 text-white">
                Completed
              </Badge>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleNavigate}
              className="w-full max-w-xs bg-[#1D3A76] hover:bg-blue-800 text-white"
            >
              Back to Dashboard
            </Button>
          </div>

          <div className="text-center text-xs text-gray-400 mt-4">
            Need help? Contact us at{" "}
            <a
              href="tel:+919555119919"
              className="text-[#1D3A76] hover:underline"
            >
              +91 9555119919
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
