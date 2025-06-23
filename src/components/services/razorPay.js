export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
export const handlePayment = async (plan, userInfo, fetchPlans, cityName) => {
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
