"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InputOTPForm from "@/app/otpscreen/page";

export function LoginWithOtp({ className, ...props }) {
  const router = useRouter();
  const [isOtpModalOpen, setIsOtp] =useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <span className="sr-only">Acme Inc.</span>
              <h1 className="text-xl font-bold">Welcome to Meet Owner</h1>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="number">Phone Number</Label>
                <Input
                  id="number"
                  type="tel"
                  placeholder="+91"
                  pattern="[0-9+]*"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#1D3A76]">
                Login
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <a href="/" className="underline underline-offset-4 hover:text-primary">
                Sign up
              </a>{" "}
              /{" "}
              <a href="/login" className="underline underline-offset-4 hover:text-primary">
                Admin login
              </a>
            </div>
          </div>
        </form>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
      </div>

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOtpModalOpen(false)}
          />
          <div className="relative z-50 w-80 rounded-lg bg-background p-6 shadow-lg">
            <InputOTPForm
              onOtpSubmit={handleOtpSubmit}
              onClose={() => setIsOtpModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
}