"use client";
import { useEffect, useState, useMemo, useId } from "react";
import { useDispatch } from "react-redux";
import { Check, ChevronDown } from "lucide-react";
import PricingCards from "./PricingCards";
import CustomPricing from "./CustomPricing";
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

  const [userInfo, setUserInfo] = useState(null);
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [cities, setCities] = useState([]);
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [customPackage, setCustomPackage] = useState(null);
  const [openState, setOpenState] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  const cityName = useMemo(
    () => selectedCity || userInfo?.city || "Hyderabad",
    [selectedCity, userInfo]
  );

  const fetchCities = async () => {
    try {
      const res = await fetch(`https://api.meetowner.in/api/v1/getAllCities`);
      const data = await res.json();
      setCities(data || []);
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
      await fetchCities();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (cities.length > 0 && userInfo) {
      const storedCity = localStorage.getItem("City");
      const userCity = userInfo.city;
      const isStoredCityValid = cities.some((city) => city.city === storedCity);
      const isUserCityValid = cities.some((city) => city.city === userCity);

      let defaultCity = "Hyderabad";
      if (isStoredCityValid) {
        defaultCity = storedCity;
      } else if (isUserCityValid) {
        defaultCity = userCity;
      }

      setSelectedCity(defaultCity);
      dispatch(setCity(defaultCity));

      const selectedCityObj = cities.find((city) => city.city === defaultCity);
      if (selectedCityObj) {
        dispatch(setState(selectedCityObj.state));
      } else if (userInfo.state && isUserCityValid) {
        dispatch(setState(userInfo.state));
      }
    }
  }, [userInfo, cities, dispatch]);

  useEffect(() => {
    if (userInfo?.user_id && cityName) {
      fetchPlans();
      fetchSubscription();
      fetchCustomPackages();
    }
  }, [userInfo, cityName]);
  const popoverId = useId();
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-8 bg-white rounded-bl-[10px] rounded-br-[10px] min-h-screen">
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-full md:max-w-2xl mx-auto md:mx-0">
            Select the plan that best fits your business needs.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <Popover open={openState} onOpenChange={setOpenState} id={popoverId}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full sm:w-[200px] md:w-[250px] h-10 sm:h-12 justify-between text-sm sm:text-base"
              >
                {selectedCity || "Select City"}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full sm:w-[200px] md:w-[250px] p-0">
              <Command>
                <CommandInput placeholder="Search Cities" className="h-10" />
                <CommandEmpty>No City found.</CommandEmpty>
                <CommandList>
                  {cities.map((state) => (
                    <CommandItem
                      key={state.city}
                      value={state.city}
                      onSelect={() => {
                        setSelectedCity(state.city);
                        localStorage.setItem("City", state.city);
                        dispatch(setCity(state.city));
                        dispatch(setState(state.state));
                        setOpenState(false);
                      }}
                    >
                      {state.city}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedCity === state.city
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
        </div>
      </div>
      {userInfo?.user_type === 3 || customPackage ? (
        <div className="flex justify-center">
          <CustomPricing
            userInfo={userInfo}
            customPackage={customPackage}
            subscription={subscription}
            cityName={cityName}
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <PricingCards
            isLoadingEffect={isLoadingEffect}
            plans={plans}
            userInfo={userInfo}
            cityName={cityName}
            subscription={subscription}
            fetchPlans={fetchPlans}
          />
        </div>
      )}
    </div>
  );
}

export default PackagesWrapper;
