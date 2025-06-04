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
import { setError, setLogin } from "@/store/slices/loginSlice";
import { useRouter } from "next/navigation";
const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});
export default function InputOTPForm({ onClose, formData }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });
  const { user, token } = useSelector((state) => state.login);
  async function onSubmit(data) {
    try {
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
      dispatch(
        setLogin({
          user: user,
          token: token,
        })
      );
      localStorage.setItem("userToken", token);
      localStorage.setItem("userDetails", JSON.stringify(user));
      router.push("/dashboard");
      onClose();
    } catch (error) {
      dispatch(setError(error.message || "OTP verification error"));
      alert("Invalid OTP. Please try again.");
    }
  }
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
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your phone.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-[#1D3A76]">
            Submit OTP
          </Button>
        </form>
      </Form>
    </div>
  );
}
