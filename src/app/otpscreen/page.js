"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "@/store/slices/loginSlice";
import { useRouter } from "next/navigation";
import { Loading } from "@/lib/loader";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const FormSchema = (isWhatsApp) =>
  z.object({
    pin: z
      .string()
      .min(isWhatsApp ? 4 : 6, {
        message: `Your one-time password must be ${
          isWhatsApp ? 4 : 6
        } characters.`,
      })
      .max(isWhatsApp ? 4 : 6, {
        message: `Your one-time password must be ${
          isWhatsApp ? 4 : 6
        } characters.`,
      }),
  });
export default function InputOTPForm({
  onClose,
  formData,
  otp,
  message,
  countryCode,
  signup,
}) {
  const router = useRouter();
  const { user: loginUser, token: loginToken } = useSelector(
    (state) => state.login
  );

  const { user: signupUser, token: signupToken } = useSelector(
    (state) => state.signup
  );
  const [loading, setLoading] = useState(false);
  const [localMessage, setLocalMessage] = useState(message || "");
  const [localError, setLocalError] = useState("");
  const isWhatsApp = !!otp;
  const schema = FormSchema(isWhatsApp);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pin: "",
    },
  });
  useEffect(() => {
    setLocalMessage(
      message ||
        (isWhatsApp
          ? "Please enter the WhatsApp OTP sent to your phone."
          : "Please enter the OTP sent to your phone.")
    );
  }, [message, isWhatsApp]);
  const verifyOtp = async (data) => {
    try {
      setLoading(true);
      let isValid = false;
      if (isWhatsApp) {
        isValid = data.pin === otp;
        if (!isValid) {
          throw new Error("Incorrect OTP");
        }
      } else {
        const response = await fetch(
          "https://api.meetowner.in/auth/v1/verifyOtpSellers",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile: formData.mobile, otp: data.pin }),
          }
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "OTP verification failed");
        }
        isValid = true;
      }
      if (isValid) {
        const finalUser = signup ? signupUser : loginUser;
        const finalToken = signup ? signupToken : loginToken;
        if (finalUser && finalToken) {
          localStorage.setItem("userToken", finalToken);
          localStorage.setItem("userDetails", JSON.stringify(finalUser));
          router.push("/dashboard");
          toast.success(`Welcome, ${finalUser.name || "User"}!`);
        } else {
          throw new Error("User or token data is missing");
        }
        setLoading(false);
        onClose();
      }
    } catch (error) {
      setLocalError(
        error.message === "OTP has expired"
          ? "The OTP has expired. Please request a new one."
          : error.message === "Incorrect OTP"
          ? "The OTP is incorrect. Please try again."
          : "An error occurred. Please try again."
      );
      setLoading(false);
    }
  };
  const resendOtp = async () => {
    try {
      if (isWhatsApp) {
        const res = await axios.post(
          "https://api.meetowner.in/auth/v1/sendGallaboxOTP",
          {
            mobile: formData.mobile,
            countryCode: countryCode.replace("+", ""),
          }
        );
        setLocalMessage(
          `WhatsApp OTP sent successfully to ${countryCode} ${formData.mobile}`
        );
      } else {
        await fetch(
          `https://api.meetowner.in/auth/v1/sendOtpSellers?mobile=${formData.mobile}`
        );
        setLocalMessage("New OTP sent successfully!");
      }
      setLocalError("");
    } catch (error) {
      setLocalError("Failed to resend OTP. Please try again!");
    }
  };
  return (
    <div className="relative w-full">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        aria-label="Close OTP form"
      >
        <X className="w-5 h-5" />
      </button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(verifyOtp)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <div className="flex justify-center">
                    <InputOTP maxLength={isWhatsApp ? 4 : 6} {...field}>
                      <InputOTPGroup>
                        {[...Array(isWhatsApp ? 4 : 6)].map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormDescription className="text-center">
                  {localMessage}
                </FormDescription>
                {localError && (
                  <FormMessage className="text-center">
                    {localError}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-[#1D3A76] flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loading size={5} color="white" />
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit OTP"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={resendOtp}
              disabled={loading}
            >
              Resend OTP
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
