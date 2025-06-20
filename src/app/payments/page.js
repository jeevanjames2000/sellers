import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import PaymentSuccessClient from "@/components/thankyou/PaymentSuccessClient";
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto shadow-lg border border-green-100">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Loading...
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
