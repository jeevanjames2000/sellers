"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, setSignup } from "@/store/slices/signupSlice";
import {
  setLocations,
  setLoading as setLocationsLoading,
  setError as setLocationsError,
} from "@/store/slices/locationSlice";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronRightIcon, SearchIcon } from "lucide-react";
import { Loading } from "@/lib/loader";
import CountryCodeSelector from "../services/CountryCodeSelector";
const FormSchema = z.object({
  mobile: z.string().regex(/^\d{7,15}$/, {
    message: "Please enter a valid phone number (7-15 digits).",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters long.",
  }),
});
export function SignupForm({ className, ...props }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    loading: signupLoading,
    error: signupError,
    user: signupUser,
    token: signupToken,
  } = useSelector((state) => state.signup);
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state) => state.locations);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [country, setCountry] = useState("India");
  const [formData, setFormData] = useState({
    mobile: "",
    countryCode: "+91",
  });
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        dispatch(setLocationsLoading());
        const response = await fetch(
          "https://api.meetowner.in/api/v1/getAllCities"
        );
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch locations");
        dispatch(setLocations(data));
      } catch (err) {
        dispatch(setLocationsError(err.message || "Failed to load locations"));
      }
    };
    fetchLocations();
  }, [dispatch]);
  const filteredCities = useMemo(() => {
    if (!locations || locations.length === 0) return [];
    if (!searchQuery) return locations;
    return locations.filter((location) =>
      location.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mobile: "",
      name: "",
      email: "",
      city: "",
    },
  });
  const handleSubmit = async (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    const payload = {
      userType: selectedRole,
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      city: data.city,
      country: country,
      country_code: formData.countryCode,
    };
    try {
      dispatch(setLoading());
      const signupResponse = await fetch(
        "https://api.meetowner.in/auth/v1/registernew",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const signupData = await signupResponse.json();
      if (!signupResponse.ok) {
        throw new Error(signupData.message || "Signup failed");
      }
      dispatch(
        setSignup({
          user: signupData.user_details,
          token: signupData.accessToken,
        })
      );
      await fetch(
        `https://api.meetowner.in/auth/v1/sendOtpSellers?mobile=${payload.mobile}`
      );
      setIsOtpModalOpen(true);
    } catch (err) {
      dispatch(setError(err.message || "An error occurred during signup"));
    }
  };
  const handleDropdownOpenChange = (open) => {
    setIsDropdownOpen(open);
    if (!open) {
      setSearchQuery("");
    }
  };
  const handleTermsOfServiceClick = () => {
    router.push("/terms");
  };
  const handlePrivacyPolicyClick = () => {
    router.push("/privacy");
  };
  const handleCountryChange = (code) => {
    setFormData((prev) => ({ ...prev, countryCode: code }));
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Your property will sell or rent faster online in MeetOwner
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md mx-auto">
                {["Builder", "Agent", "Owner", "Channel partner"].map(
                  (role) => (
                    <Button
                      key={role}
                      type="button"
                      variant={selectedRole === role ? "default" : "outline"}
                      className={cn(
                        "w-full text-black",
                        selectedRole === role && "bg-[#1d37a6] text-white",
                        role === "Channel partner" &&
                          "text-sm whitespace-nowrap px-15"
                      )}
                      onClick={() => setSelectedRole(role)}
                    >
                      {role}
                    </Button>
                  )
                )}
              </div>
              <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            required
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(/\D/g, ""))
                            }
                            className="w-full pl-20 pr-4 py-2 rounded-md border border-input text-black placeholder-gray-400 focus:outline-none"
                          />
                          <div className="absolute left-1 top-1/2 transform -translate-y-1/2">
                            <CountryCodeSelector
                              selectedCode={formData.countryCode}
                              onSelect={handleCountryChange}
                              setCountry={setCountry}
                            />
                          </div>
                        </div>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
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
                        <DropdownMenu
                          open={isDropdownOpen}
                          onOpenChange={handleDropdownOpenChange}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between text-left font-normal"
                              disabled={locationsLoading}
                            >
                              {field.value || "Select city"}
                              <ChevronRightIcon className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-[300px] max-h-[250px] overflow-y-auto"
                            align="start"
                          >
                            <div className="p-2 border-b">
                              <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  type="text"
                                  placeholder="Search city..."
                                  value={searchQuery}
                                  onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                  }
                                  className="pl-10 pr-4 py-2 w-full"
                                  onClick={(e) => e.stopPropagation()}
                                  autoFocus
                                />
                              </div>
                            </div>
                            {locationsLoading ? (
                              <DropdownMenuItem disabled>
                                Loading cities...
                              </DropdownMenuItem>
                            ) : locationsError ? (
                              <DropdownMenuItem disabled>
                                Error: {locationsError}
                              </DropdownMenuItem>
                            ) : filteredCities.length === 0 ? (
                              <DropdownMenuItem disabled>
                                No cities found
                              </DropdownMenuItem>
                            ) : (
                              filteredCities.map((location) => (
                                <DropdownMenuItem
                                  key={location.city}
                                  onSelect={() => {
                                    field.onChange(location.city);
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  {location.city}
                                </DropdownMenuItem>
                              ))
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {signupError && (
                  <p className="text-red-500 text-sm text-center">
                    {signupError}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#1D3A76]"
                  disabled={
                    signupLoading || locationsLoading || !form.getValues("city")
                  }
                >
                  {signupLoading ? (
                    <>
                      <Loading size={5} color="white" />
                      <span>Signing up...</span>
                    </>
                  ) : (
                    "Start Now"
                  )}
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border w-full max-w-md mx-auto">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="text-center text-sm">
                Already existing user?{" "}
                <a
                  href="/loginotp"
                  className="text-blue-900 hover:text-blue-500 transition-colors duration-200 font-semibold hover:no-underline"
                >
                  Login
                </a>
              </div>
            </div>
          </form>
        </Form>
        <div className="text-center mt-3 text-xs text-gray-500 flex justify-center items-center gap-1">
          <span>By clicking continue, you agree to our</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleTermsOfServiceClick();
            }}
            className="text-blue-900 hover:text-blue-500 transition-colors duration-200 font-medium underline underline-offset-4 hover:no-underline"
          >
            Terms of Service
          </a>
          <span className="text-gray-400">and</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePrivacyPolicyClick();
            }}
            className="text-blue-900 hover:text-blue-500 transition-colors duration-200 font-medium underline underline-offset-4 hover:no-underline"
          >
            Privacy Policy
          </a>
          <span className="text-gray-500">.</span>
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
              formData={formData}
              onClose={() => setIsOtpModalOpen(false)}
              signup={true}
            />
          </div>
        </div>
      )}
    </>
  );
}
