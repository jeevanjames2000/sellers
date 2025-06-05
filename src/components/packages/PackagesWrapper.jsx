"use client";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, ChevronDown, ChevronsDown, ChevronsUpDown } from "lucide-react";
import PricingCards from "./PricingCards";
import CustomPricing from "./CustomPricing";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  setState,
  setCity,
} from "@/store/slices/addPropertySlice/addressSlice";
function PackagesWrapper() {
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState("");
  console.log("userInfo: ", userInfo);

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [customPackage, setCustomPackage] = useState(null);
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const cityName = useMemo(
    () => selectedCity || userInfo?.city,
    [selectedCity]
  );
  const fetchStates = async () => {
    try {
      const res = await fetch("https://api.meetowner.in/api/v1/getAllStates");
      const data = await res.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };
  const fetchCities = async (state) => {
    try {
      const res = await fetch(
        `https://api.meetowner.in/api/v1/getAllCities?state=${state}`
      );
      const data = await res.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  const fetchPlans = async () => {
    const packageForMap = {
      1: "admin",
      2: "user",
      3: "builder",
      4: "agent",
      5: "owner",
      6: "channel_partner",
    };
    const package_for = packageForMap[userInfo?.user_type];
    setIsLoadingEffect(true);
    try {
      const res = await fetch(
        `https://api.meetowner.in/packages/v1/getAllPackages?package_for=${package_for}&city=${cityName}`
      );
      const data = await res.json();

      setPlans(data || []);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setIsLoadingEffect(false);
    }
  };
  const fetchSubscription = async () => {
    try {
      const res = await fetch(
        `https://api.meetowner.in/packages/v1/getSubscriptionDetails?user_id=${userInfo.user_id}&city=${cityName}`
      );
      const data = await res.json();
      console.log("data: ", data);
      setSubscription(data?.data?.[0] || null);
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    }
  };
  const fetchCustomPackages = async () => {
    try {
      const res = await fetch(
        `https://api.meetowner.in/packages/v1/getCustomPackages?user_id=${userInfo.user_id}&city=${cityName}`
      );
      const data = await res.json();
      setCustomPackage(data?.customPackages?.[0] || null);
    } catch (error) {
      console.error("Failed to fetch custom packages:", error);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      const storedUser = localStorage.getItem("userDetails");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      setUserInfo(parsedUser);
    };
    loadData();
    fetchStates();
  }, []);
  useEffect(() => {
    if (selectedState) fetchCities(selectedState);
  }, [selectedState]);
  useEffect(() => {
    if (userInfo?.user_id && cityName) {
      fetchPlans();
      fetchSubscription();
      fetchCustomPackages();
    }
  }, [userInfo, cityName]);

  return (
    <div className="flex flex-col gap-2 p-2 bg-white rounded-bl-[10px] rounded-br-[10px]">
      <div className="flex flex-row justify-center gap-10">
        <div className="text-center mb-8 mt-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the plan that best fits your business needs.
          </p>
        </div>
        {/* <div className="space-y-2 flex items-center justify-end">
          <Popover open={openState} onOpenChange={setOpenState}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-70 h-15 justify-between"
              >
                {selectedState || "Select City"}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-70">
              <Command>
                <CommandInput placeholder="Search states…" />
                <CommandEmpty>No state found.</CommandEmpty>
                <CommandList>
                  {states.map((state) => (
                    <CommandItem
                      key={state.state}
                      value={state.state}
                      onSelect={() => {
                        setSelectedState(state.state);
                        dispatch(setState(state.state));
                        setOpenState(false);
                      }}
                    >
                      {state.state}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedState === state.state
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div> */}
      </div>

      {userInfo?.user_type === 3 || customPackage ? (
        <CustomPricing
          userInfo={userInfo}
          customPackage={customPackage}
          subscription={subscription}
          cityName={cityName}
        />
      ) : (
        <PricingCards
          isLoadingEffect={isLoadingEffect}
          plans={plans}
          userInfo={userInfo}
          cityName={cityName}
          subscription={subscription}
          fetchPlans={fetchPlans}
        />
      )}
    </div>
  );
}
export default PackagesWrapper;
