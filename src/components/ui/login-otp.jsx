"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import InputOTPForm from "@/app/otpscreen/page";
import { setError, setLoading, setLogin } from "@/store/slices/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "@/lib/loader";
import CountryCodeSelector from "../services/CountryCodeSelector";
import axios from "axios";
import toast from "react-hot-toast";
export function LoginWithOtp({ className, ...props }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token, loading, error } = useSelector((state) => state.login);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    mobile: "",
    countryCode: "+91",
  });
  const [country, setCountry] = useState("India");
  const [errors, setErrors] = useState({
    mobile: "",
  });
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const validateMobile = (mobile, countryCode) => {
    const mobileRegex = /^\d{7,15}$/;
    return mobileRegex.test(mobile)
      ? ""
      : `Please enter a valid ${
          countryCode === "+91"
            ? "Indian phone number (10 digits, starting with 6-9)"
            : "phone number"
        }`;
  };
  const fetchLoginData = async () => {
    try {
      dispatch(setLoading());
      const loginResponse = await fetch(
        "https://api.meetowner.in/auth/v1/loginnew",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: formData.mobile,
          }),
        }
      );
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
      return true;
    } catch (err) {
      dispatch(setError(err.message || "An error occurred during login"));
      return false;
    }
  };
  const sendWhatsAppOtp = useCallback(async () => {
    setEnteredOtp("");
    try {
      const res = await axios.post(
        `https://api.meetowner.in/auth/v1/sendGallaboxOTP`,
        {
          mobile: formData.mobile,
          countryCode: formData.countryCode.replace("+", ""),
        }
      );
      setOtp(res.data.otp.toString());
      setMessage(
        `WhatsApp OTP sent successfully to ${formData.countryCode} ${formData.mobile}`
      );
      toast.success(
        `WhatsApp OTP sent successfully to ${formData.countryCode} ${formData.mobile}`
      );
      setOtpSent(true);
      setIsOtpModalOpen(true);
    } catch (err) {
      dispatch(setError("Failed to send OTP via WhatsApp. Please try again!"));
      setMessage("");
    }
  }, [
    formData.mobile,
    formData.countryCode,
    dispatch,
    setEnteredOtp,
    setMessage,
    setOtpSent,
  ]);
  const sendSmsOtp = async () => {
    try {
      await fetch(
        `https://api.meetowner.in/auth/v1/sendOtpSellers?mobile=${formData.mobile}`
      );
      setMessage(
        `OTP sent successfully to ${formData.countryCode}${formData.mobile}`
      );
      toast.success(
        `OTP sent successfully to ${formData.countryCode}${formData.mobile}`
      );
      setOtpSent(true);
      setIsOtpModalOpen(true);
    } catch (err) {
      dispatch(setError("Failed to send OTP via SMS. Please try again!"));
      setMessage("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const mobileError = validateMobile(formData.mobile, formData.countryCode);
    setErrors({ mobile: mobileError });
    if (mobileError) return;
    const loginSuccess = await fetchLoginData();
    if (!loginSuccess) return;
    if (formData.countryCode === "+91") {
      await sendSmsOtp();
    }
  };
  const handleWhatsAppLogin = async (e) => {
    e.preventDefault();
    const mobileError = validateMobile(formData.mobile, formData.countryCode);
    setErrors({ mobile: mobileError });
    if (mobileError) return;
    await sendWhatsAppOtp();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let cleanedValue = value.replace(/\D/g, "");
    if (cleanedValue.startsWith(formData.countryCode.replace("+", ""))) {
      cleanedValue = cleanedValue.slice(formData.countryCode.length - 1);
    }
    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    if (name === "mobile") {
      setErrors((prev) => ({
        ...prev,
        mobile: validateMobile(cleanedValue, formData.countryCode),
      }));
    }
  };
  const handleTermsOfServiceClick = () => {
    router.push("/terms");
  };
  const handlePrivacyPolicyClick = () => {
    router.push("/privacy");
  };
  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-2 transition-all duration-300",
          className,
          {
            "blur-sm": isOtpModalOpen,
          }
        )}
        {...props}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-center mb-5">
              <span className="sr-only">Acme Inc.</span>
              <h1 className="text-xl font-bold">Welcome to Meet Owner</h1>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="mobile">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="Enter Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength={15}
                    required
                    className={cn(
                      "w-full px-4 py-2 rounded-md border border-input text-black placeholder-gray-400 focus:outline-none pl-20",
                      errors.mobile ? "border-red-500" : ""
                    )}
                    disabled={loading}
                  />
                  <div className="absolute left-1 top-1/2 transform -translate-y-1/2">
                    <CountryCodeSelector
                      selectedCode={formData.countryCode}
                      onSelect={(code) =>
                        setFormData((prev) => ({ ...prev, countryCode: code }))
                      }
                      setCountry={setCountry}
                    />
                  </div>
                </div>
                {errors.mobile && (
                  <p className="text-red-500 text-sm">{errors.mobile}</p>
                )}
              </div>
              {formData.countryCode === "+91" && (
                <Button
                  type="submit"
                  className="w-full bg-[#1D3A76] flex items-center justify-center"
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
              )}
            </div>
            {formData.countryCode === "+91" && (
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            )}
            <Button
              type="button"
              className={`w-full bg-green-500 text-white flex items-center justify-center ${
                formData.countryCode !== "+91" ? "mt-5" : ""
              }`}
              disabled={loading}
              onClick={handleWhatsAppLogin}
            >
              {loading ? (
                <>
                  <Loading size={5} color="white" />
                  <span>Logging in...</span>
                </>
              ) : (
                "Login with WhatsApp"
              )}
            </Button>
            <div className="text-center mt-1 flex justify-center items-center gap-1 text-sm font-medium text-gray-600">
              <span>Don't have an account?</span>
              <a
                href="/"
                className="text-blue-900 text-xs hover:text-blue-500 transition-colors duration-200 font-semibold hover:no-underline"
              >
                Create account
              </a>
              <span className="text-gray-400">/</span>
              <a
                href="/login"
                className="text-blue-900 text-xs hover:text-blue-500 transition-colors duration-200 font-semibold hover:no-underline"
              >
                Admin login
              </a>
            </div>
          </div>
        </form>
        <div className="text-center text-xs [&_a]:underline [&_a]:underline-offset-4">
          By clicking continue you agree to our{" "}
          <a
            href="#"
            className="text-blue-900 font-medium hover:text-blue-500"
            onClick={(e) => {
              e.preventDefault();
              handleTermsOfServiceClick();
            }}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-blue-900 font-medium hover:text-blue-500"
            onClick={(e) => {
              e.preventDefault();
              handlePrivacyPolicyClick();
            }}
          >
            Privacy Policy
          </a>
          .
        </div>
      </div>
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
              otp={otp}
              message={message}
              countryCode={formData.countryCode}
            />
          </div>
        </div>
      )}
    </>
  );
}
