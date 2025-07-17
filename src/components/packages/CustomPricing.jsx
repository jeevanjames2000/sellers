import React, { memo } from "react";
import { Check, Phone, Mail, IndianRupee, Crown, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import config from "../api/config";
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
const handlePayment = async (
  userInfo,
  customPackage,
  subscription,
  cityName
) => {
  if (!userInfo?.user_id) {
    return;
  }
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    return;
  }
  const apiURL = config.api_url;
  try {
    const checkResponse = await fetch(`${apiURL}/payments/checkSubscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userInfo.user_id, city: cityName }),
    });
    const checkData = await checkResponse.json();
    if (!checkData.success) {
      return;
    }
    const { isSubscriptionActive, payment_status } = checkData;

    if (payment_status === "processing") {
      return;
    }
    if (isSubscriptionActive) {
      return;
    }
  } catch (error) {
    return;
  }
  const amount = Number(customPackage.price);
  try {
    const response = await fetch(`${apiURL}/payments/createOrder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency: "INR",
        user_id: userInfo.user_id,
        city: cityName,
      }),
    });
    const order = await response.json();
    if (!order.id) {
      toast.error(`Error creating order: ${order.message || "Unknown error"}`);
      return;
    }
    const razorKey = process.env.NEXT_PUBLIC_RAZOR_PAY_KEY;
    const options = {
      key: razorKey,
      amount: order.amount,
      currency: order.currency,
      name: "Meet Owner",
      description: `Payment for ${customPackage.name} Plan`,
      order_id: order.id,
      handler: async (response) => {
        const payload = {
          user_id: userInfo?.user_id,
          user_type: userInfo?.user_type,
          city: cityName || userInfo?.city,
          name: userInfo?.name,
          mobile: userInfo?.mobile || "N/A",
          email: userInfo?.email || "N/A",
          subscription_package: customPackage.name,
          listingsLimit: customPackage.duration_days,
          price: customPackage.price,
          payment_amount: customPackage.price,
          payment_reference: response.razorpay_payment_id,
          payment_mode: "online",
          payment_gateway: "Razorpay",
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          payment_status: "processing",
        };
        try {
          const verifyResponse = await fetch(
            `${apiURL}/payments/verifyPayment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            toast.success("Payment successful!");
            await fetchPlans();
          } else {
            toast.error(`Payment failed: ${verifyData.message}`);
          }
        } catch (error) {
          toast.error("Error verifying payment. Please try again.");
        }
      },
      prefill: {
        name: userInfo?.name || "Guest User",
        contact: userInfo?.mobile || "xxxxxxxxxx",
        email: userInfo?.email || "",
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: async () => {
          const payload = {
            user_id: userInfo?.user_id,
            user_type: userInfo?.user_type,
            name: userInfo?.name,
            city: cityName || userInfo?.city,
            mobile: userInfo?.mobile || "N/A",
            email: userInfo?.email || "N/A",
            subscription_package: customPackage.name,
            payment_amount: customPackage.price,
            payment_reference: null,
            payment_mode: "online",
            payment_gateway: "Razorpay",
            razorpay_order_id: order.id,
            razorpay_payment_id: null,
            razorpay_signature: null,
            payment_status: "cancelled",
          };
          try {
            await fetch(`${apiURL}/payments/verifyPayment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            await fetchPlans();
            toast.error(`Payment cancelled`);
          } catch (error) {
            toast.error(`Payment cancelled`);
          }
        },
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", async (response) => {
      const payload = {
        user_id: userInfo?.user_id,
        name: userInfo?.name,
        mobile: userInfo?.mobile || "N/A",
        email: userInfo?.email || "N/A",
        city: cityName || userInfo?.city,
        subscription_package: customPackage.name,
        payment_amount: customPackage.price,
        payment_reference: response.error.metadata.payment_id || null,
        payment_mode: "online",
        payment_gateway: "Razorpay",
        razorpay_order_id: response.error.metadata.order_id || null,
        razorpay_payment_id: response.error.metadata.payment_id || null,
        razorpay_signature: null,
        payment_status: "failed",
      };
      try {
        await fetch(`${apiURL}/payments/verifyPayment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.error("Payment failed. Please try again.");
      } catch (error) {
        toast.error("Something went wrong!. Please try again.");
      }
    });
    paymentObject.open();
  } catch (error) {
    toast.error("Something went wrong!. Please try again.");
  }
};
const CustomPricing = memo(
  ({ userInfo, customPackage, subscription, cityName }) => {
    const handleEmailClick = () => {
      const emailBody = `Dear Meetowner,%0A%0AI am ${encodeURIComponent(
        userInfo?.name
      )}, interested in custom quotation. My mobile number is ${encodeURIComponent(
        userInfo?.mobile
      )}. Please get in touch with me.%0A%0ARegards,`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=nagarajuk@meetowner.in&su=Interested%20in%20Custom%20Quotation&body=${emailBody}`;
      window.open(gmailUrl, "_blank");
    };
    if (!customPackage) {
      return (
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="mx-auto p-3 bg-white/20 rounded-full w-fit mb-4">
                <Crown className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">No Custom Plan Found</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center space-y-6">
              <p className="text-gray-600 text-lg">
                Contact our team to create a custom plan that fits your specific
                business needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <a
                    href="tel:+919703003098"
                    className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    +91 9703003098
                  </a>
                </div>
                <div
                  onClick={handleEmailClick}
                  className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-lg font-semibold text-gray-700 hover:text-purple-600 transition-colors">
                    nagarajuk@meetowner.in
                  </span>
                </div>
              </div>
              <Button
                onClick={handleEmailClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
              >
                Contact Our Team
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    const { name, duration_days, price, rules } = customPackage;
    const paymentStatus = subscription?.payment_status;
    const userSubscriptionStatus = subscription?.subscription_status;
    let subscriptionState = "Upgrade Now";
    let buttonVariant = "default";
    if (
      paymentStatus === "processing" ||
      userSubscriptionStatus === "processing"
    ) {
      subscriptionState = "Processing...";
      buttonVariant = "secondary";
    } else if (
      paymentStatus === "success" &&
      userSubscriptionStatus === "active"
    ) {
      subscriptionState = "Current Active Plan";
      buttonVariant = "secondary";
    }
    const isDisabled = subscriptionState !== "Upgrade Now";
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-xl">
          <CardHeader className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white pb-8">
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Custom Plan
              </Badge>
            </div>
            <div className="text-center pt-6">
              <div className="mx-auto p-4 bg-white/20 rounded-full w-fit mb-4">
                <Crown className="h-10 w-10" />
              </div>
              <CardTitle className="text-3xl mb-2">
                Custom Plan for {userInfo?.name}
              </CardTitle>
              <p className="text-purple-100 text-lg">
                Tailored specifically for your business needs
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
              <p className="text-gray-600 text-lg mb-4">{duration_days} days</p>
              <div className="flex items-center justify-center gap-2 text-4xl font-bold text-purple-700">
                <IndianRupee className="h-8 w-8" />
                <span>{price}</span>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Included Features
              </h4>
              <ul className="space-y-3">
                {rules?.map((rule) =>
                  rule.included ? (
                    <li
                      key={rule.id}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">
                        {rule.rule_name}
                      </span>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
            <Button
              disabled={isDisabled}
              className={`w-full py-4 text-lg font-semibold transition-all ${
                isDisabled
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
              }`}
              onClick={() =>
                handlePayment(userInfo, customPackage, subscription, cityName)
              }
            >
              {subscriptionState}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
);

export default CustomPricing;
