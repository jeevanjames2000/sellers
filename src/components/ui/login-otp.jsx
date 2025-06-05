"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InputOTPForm from "@/app/otpscreen/page";
import { setError, setLoading, setLogin } from "@/store/slices/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "@/lib/loader";
export function LoginWithOtp({ className, ...props }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token,loading, error } = useSelector((state) => state.login);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    mobile: "",
  });
  const [errors, setErrors] = useState({
    mobile: "",
  });
  const validateMobile = (mobile) => {
    const mobileRegex = /^(?:\+91)?[6-9]\d{9}$/;
    return mobileRegex.test(mobile)
      ? ""
      : "Please enter a valid Indian phone number (10 digits, starting with 6-9)";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const mobileError = validateMobile(formData.mobile);
    setErrors({ mobile: mobileError });
    if (mobileError) return;
    try {
      dispatch(setLoading());
      const loginResponse = await fetch("https://api.meetowner.in/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: formData.mobile }),
      });
      const loginData = await loginResponse.json();
      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Login failed");
      }
      dispatch(
        setLogin({
          user: loginData.user_details,
          token: loginData.accessToken,
        })
      );
      localStorage.setItem("userToken", loginData.accessToken);
      localStorage.setItem(
        "userDetails",
        JSON.stringify(loginData.user_details)
      );
      await fetch(
        `https://api.meetowner.in/auth/v1/sendOtpSellers?mobile=${formData.mobile}`
      );
      setIsOtpModalOpen(true);
    } catch (err) {
      dispatch(setError(err.message || "An error occurred during login"));
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "mobile") {
      setErrors((prev) => ({ ...prev, mobile: validateMobile(value) }));
    }
  };
  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-6 transition-all duration-300",
          className,
          {
            "blur-sm": isOtpModalOpen,
          }
        )}
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
                <Label htmlFor="mobile">Phone Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="+91"
                  value={formData.mobile}
                  onChange={handleChange}
                  pattern="[0-9+]*"
                  required
                  className={errors.mobile ? "border-red-500" : ""}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm">{errors.mobile}</p>
                )}
              </div>
               <Button
                type="submit"
                className="w-full bg-[#1D3A76] flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loading size={5} color="white" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <a
                href="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </a>{" "}
              /{" "}
              <a
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                Admin login
              </a>
            </div>
          </div>
        </form>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
      {}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOtpModalOpen(false)}
          />
          <div className="relative z-50 w-80 rounded-lg bg-background p-6 shadow-lg">
            <InputOTPForm
              onClose={() => setIsOtpModalOpen(false)}
              formData={formData}
            />
          </div>
        </div>
      )}
    </>
  );
}
