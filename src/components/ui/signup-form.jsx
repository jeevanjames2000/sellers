"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputOTPForm from "@/app/otpscreen/page";



const FormSchema = z.object({
  phone: z.string().regex(/^\+?[0-9]{10,}$/, {
    message: "Please enter a valid phone number (at least 10 digits).",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters long.",
  }),
});

export function SignupForm({ className, ...props }) {
  const router = useRouter();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Builder"); 


  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: "",
      name: "",
      city: "",
    },
  });

  const handleSubmit = (data) => {
  
    console.log("Form Submission Details:", {
      ...data,
      role: selectedRole,
    });
    setIsOtpModalOpen(true); 
  };

  const handleOtpSubmit = () => {
    setIsOtpModalOpen(false);
     localStorage.setItem("userToken", "some-token"); 
    router.push("/dashboard"); 
  };

  return (
    <>
    
      <div
        className={cn("flex flex-col gap-6 transition-all duration-300", className, {
          "blur-sm": isOtpModalOpen,
        })}
        {...props}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-6">
             
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Your property will sell or rent faster online in MeetOwner
                </p>
              </div>

             
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md mx-auto">
                {["Builder", "Agent", "Owner", "Channel partner"].map((role) => (
                  <Button
                    key={role}
                    type="button" 
                    variant={selectedRole === role ? "default" : "outline"}
                    className={cn(
                      "w-full text-black",
                      selectedRole === role && "bg-[#1d37a6] text-white",
                      role === "Channel partner" && "text-sm  whitespace-nowrap px-15"
                    )}
                    onClick={() => setSelectedRole(role)}
                  >
                    {role}
                  </Button>
                ))}
              </div>

             
              <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your name"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Select city"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-[#1D3A76]">
                  Start Now
                </Button>
              </div>

            
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border w-full max-w-md mx-auto">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

             
              <div className="text-center text-sm">
                Already existing user?{" "}
                <a href="/loginotp" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
        </Form>

        {/* Terms */}
        <div className="mt-4 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with semi-transparent overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOtpModalOpen(false)} // Close modal on backdrop click
          />
          {/* OTP Form Modal */}
          <div className="relative z-50 w-80 rounded-lg bg-background p-6 shadow-lg">
            <InputOTPForm onOtpSubmit={handleOtpSubmit} />
          </div>
        </div>
      )}
    </>
  );
}