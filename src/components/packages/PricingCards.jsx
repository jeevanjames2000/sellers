import React from "react";
import { Check, X, IndianRupee, Crown, Zap, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
const handlePayment = async (plan, userInfo, fetchPlans, cityName) => {
  if (!userInfo?.user_id) {
    toast.error("User ID is required. Please log in.");
    return;
  }
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    toast.error(
      "Failed to processing payments. Please check your internet connection."
    );
    return;
  }
  const apiURL = "https://api.meetowner.in";
  try {
    const checkResponse = await fetch(`${apiURL}/payments/checkSubscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userInfo.user_id, city: cityName }),
    });
    const checkData = await checkResponse.json();
    if (!checkData.success) {
      toast.error("Error checking subscription status. Please try again.");
      return;
    }
    const { isSubscriptionActive, payment_status } = checkData;
    if (payment_status === "processing") {
      toast.error("Your plan is in processing. Please wait.");
      return;
    }
    if (isSubscriptionActive) {
      toast.error("You already have an active subscription.");
      return;
    }
  } catch (error) {
    toast.error("Error checking subscription status. Please try again.");
    return;
  }
  const amount = Number(plan.price);
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
      description: `Payment for ${plan.name} Plan`,
      order_id: order.id,
      handler: async (response) => {
        const payload = {
          user_id: userInfo?.user_id,
          user_type: userInfo?.user_type,
          city: cityName || userInfo?.city,
          name: userInfo?.name,
          mobile: userInfo?.mobile || "N/A",
          email: userInfo?.email || "N/A",
          subscription_package: plan.name,
          payment_amount: plan.price,
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
            router.push(
              `/payments?transactionId=${response.razorpay_payment_id}&amount=${
                plan.price
              }&currency=INR&planName=${encodeURIComponent(plan.name)}`
            );
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
            subscription_package: plan.name,
            payment_amount: plan.price,
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
        subscription_package: plan.name,
        payment_amount: plan.price,
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
const PricingCard = ({
  title,
  duration,
  price,
  features,
  isPopular,
  isCurrentPlan,
  anyPlanActive,
  onSubscribe,
  paymentStatus,
}) => {
  const router = useRouter();
  const getCardIcon = () => {
    switch (title) {
      case "Free Listing":
        return <Zap className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />;
      case "Basic":
        return <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />;
      case "Prime":
        return <Crown className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />;
      case "Prime Plus":
        return <Crown className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />;
      default:
        return <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />;
    }
  };
  const getGradient = () => {
    if (isCurrentPlan) return "from-green-50 to-green-100 border-green-300";
    if (isPopular) return "from-blue-50 to-purple-100 border-purple-300";
    return "from-gray-50 to-white border-gray-200";
  };
  const route = () => {
    router.push(`/payments?transactionId=&amount=`);
  };
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br ${getGradient()} h-full flex flex-col mx-auto max-w-[300px]`}
    >
      {isPopular && !isCurrentPlan && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-1.5 sm:py-2 text-xs sm:text-sm font-semibold">
          🔥 Most Popular
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-1.5 sm:py-2 text-xs sm:text-sm font-semibold">
          ✓ Current Plan
        </div>
      )}
      <CardHeader
        className={`text-center px-2 sm:px-4 lg:px-6 pb-2 sm:pb-4 ${
          (isPopular && !isCurrentPlan) || isCurrentPlan
            ? "mt-6 sm:mt-8"
            : "mt-2 sm:mt-4"
        }`}
      >
        <div
          className={`mx-auto p-2 sm:p-2.5 lg:p-3 rounded-full w-fit mb-2 sm:mb-3 lg:mb-4 mt-2 ${
            isCurrentPlan
              ? "bg-green-600 text-white"
              : isPopular
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              : "bg-gray-600 text-white"
          }`}
        >
          {getCardIcon()}
        </div>
        <CardTitle
          className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 ${
            isCurrentPlan
              ? "text-green-700"
              : isPopular
              ? "text-purple-700"
              : "text-gray-700"
          }`}
        >
          {title}
        </CardTitle>
        <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3">
          {duration}
        </p>
        <div
          className={`text-xl sm:text-2xl lg:text-3xl font-bold flex items-center justify-center gap-1 ${
            isCurrentPlan
              ? "text-green-700"
              : isPopular
              ? "text-purple-700"
              : "text-gray-700"
          }`}
        >
          {price === "Free" ? (
            <span>Free</span>
          ) : (
            <>
              <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              <span>{price}</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 lg:space-y-4 px-2 sm:px-3 lg:px-6 flex-grow flex flex-col">
        <ul className="space-y-1.5 sm:space-y-2 lg:space-y-3 flex-grow">
          {Object.entries(features).map(([feature, value]) => (
            <li
              key={feature}
              className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm justify-start"
            >
              {value === "yes" ? (
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0 mt-0.5" />
              ) : value === "No" ? (
                <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0 mt-0.5" />
              ) : (
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0 mt-0.5" />
              )}
              <span className="text-gray-700 leading-tight text-center sm:text-left">
                {feature} {value !== "yes" && value !== "No" ? value : ""}
              </span>
            </li>
          ))}
        </ul>
        <div className="pt-2 pb-2 sm:pt-3 lg:pt-4 flex justify-center">
          <Button
            className={`w-full max-w-[200px] py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base font-semibold ${
              isCurrentPlan
                ? "bg-green-600 hover:bg-green-700 text-white"
                : price === "Free"
                ? "bg-gray-400 text-white cursor-not-allowed"
                : anyPlanActive
                ? "bg-gray-400 text-white cursor-not-allowed"
                : isPopular
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                : "bg-gray-700 hover:bg-gray-800 text-white"
            }`}
            onClick={route}
            disabled={isCurrentPlan || price === "Free" || anyPlanActive}
          >
            {isCurrentPlan
              ? paymentStatus === "processing"
                ? "Processing..."
                : "Current Active Plan"
              : price === "Free"
              ? "Get Started"
              : "Upgrade Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PricingCards = ({
  plans,
  isLoadingEffect,
  userInfo,
  subscription,
  fetchPlans,
  cityName,
}) => {
  if (isLoadingEffect) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse px-2 sm:px-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-80 bg-gray-200 rounded-lg mx-auto max-w-[300px]"
          ></div>
        ))}
      </div>
    );
  }

  const currentPlan = subscription?.subscription_package?.toLowerCase();
  const paymentStatus = subscription?.payment_status;
  const subscriptionStatus = subscription?.subscription_status;

  const transformRulesToFeatures = (rules) => {
    const features = {};
    rules.forEach((rule) => {
      features[rule.name] = rule.included ? "yes" : "No";
    });
    return features;
  };

  const renderPricingCard = (plan) => {
    const packageEnumMap = {
      "Free Listing": "free",
      Basic: "basic",
      Prime: "prime",
      "Prime Plus": "prime_plus",
    };
    const planKey = packageEnumMap[plan.name];
    const isCurrentPlan =
      currentPlan === planKey &&
      (paymentStatus === "processing" || paymentStatus === "success") &&
      (subscriptionStatus === "processing" ||
        subscriptionStatus === "active") &&
      subscription?.city === cityName;

    return (
      <PricingCard
        title={plan.name}
        duration={`${plan.duration_days} Days`}
        price={plan.price === "0.00" ? "Free" : plan.price}
        features={transformRulesToFeatures(plan.rules)}
        isPopular={plan.name === "Prime"}
        isCurrentPlan={isCurrentPlan}
        anyPlanActive={false}
        onSubscribe={() => handlePayment(plan, userInfo, fetchPlans, cityName)}
        paymentStatus={paymentStatus}
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      <Carousel className="w-full">
        <CarouselContent className="-ml-1 sm:-ml-2">
          {plans.map((plan) => (
            <CarouselItem
              key={plan.id}
              className="basis-[100%]  md:basis-1/3 lg:basis-1/4 pl-1 sm:pl-2 flex justify-center"
            >
              <div className="h-full px-4 py-6  w-full max-w-[300px]">
                {renderPricingCard(plan)}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
};

export default PricingCards;
