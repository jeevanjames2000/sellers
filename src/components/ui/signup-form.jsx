'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputOTPForm from '@/app/otpscreen/page';
import { useDispatch, useSelector } from 'react-redux';
import { setSignup, setOtpSent, setLoading, setError } from '@/store/slices/signupSlice';
import { setLocations, setLoading as setLocationsLoading, setError as setLocationsError } from '@/store/slices/locationSlice';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronRightIcon, SearchIcon } from 'lucide-react';

const FormSchema = z.object({
  phone: z.string().regex(/^(?:\+91)?[6-9]\d{9}$/, {
    message: 'Please enter a valid Indian phone number (10 digits, starting with 6-9).',
  }),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters long.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  city: z.string().min(2, {
    message: 'City must be at least 2 characters long.',
  }),
});

export function SignupForm({ className, ...props }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading: signupLoading, error: signupError } = useSelector((state) => state.signup);
  const { locations, loading: locationsLoading, error: locationsError } = useSelector(
    (state) => state.locations
  );
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Builder');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        dispatch(setLocationsLoading());
        const response = await fetch('https://api.meetowner.in/api/v1/getAllCities');
        const data = await response.json();
        if (!response.ok) throw new Error('Failed to fetch locations');
        dispatch(setLocations(data));
      } catch (err) {
        dispatch(setLocationsError(err.message || 'Failed to load locations'));
      }
    };

    fetchLocations();
  }, [dispatch]);

  // Filter cities based on search query
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
      phone: '',
      name: '',
      email: '',
      city: '',
    },
  });

  const handleSubmit = async (data) => {
    const payload = {
      userType: selectedRole,
      name: data.name,
      mobile: data.phone,
      email: data.email,
      city: data.city,
    };

    try {
      dispatch(setLoading());

      // Call Signup API
      const signupResponse = await fetch('https://api.meetowner.in/auth/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(signupData.message || 'Signup failed');
      }

      // Dispatch signup data
      dispatch(setSignup({
        user_details: signupData.user_details,
        accessToken: signupData.accessToken,
      }));

      // Store token in localStorage
      localStorage.setItem('userToken', signupData.accessToken);
      localStorage.setItem('userDetails', JSON.stringify(signupData.user_details));

      // Call Send OTP API
      const otpResponse = await fetch(
        `https://api.meetowner.in/auth/v1/sendOtp?mobile=${"6305625580"}`,
        {
          method: 'GET',
        }
      );

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {
        throw new Error(otpData.message || 'Failed to send OTP');
      }

      // Dispatch OTP data
      dispatch(setOtpSent({
        otp: otpData.otp,
        apiResponse: otpData.apiResponse,
      }));

      // Open OTP modal
      setIsOtpModalOpen(true);
    } catch (err) {
      dispatch(setError(err.message || 'An error occurred during signup'));
    }
  };

  const handleOtpSubmit = () => {
    setIsOtpModalOpen(false);
    router.push('/dashboard');
  };

  // Reset search query when dropdown closes
  const handleDropdownOpenChange = (open) => {
    setIsDropdownOpen(open);
    if (!open) {
      setSearchQuery('');
    }
  };

  return (
    <>
      <div
        className={cn('flex flex-col gap-6 transition-all duration-300', className, {
          'blur-sm': isOtpModalOpen,
        })}
        {...props}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col'>
            <div className='flex flex-col gap-6'>
              {/* Header */}
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Welcome back</h1>
                <p className='text-muted-foreground text-sm md:text-base'>
                  Your property will sell or rent faster online in MeetOwner
                </p>
              </div>

              {/* Role Selection */}
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md mx-auto'>
                {['Builder', 'Agent', 'Owner', 'Channel partner'].map((role) => (
                  <Button
                    key={role}
                    type='button'
                    variant={selectedRole === role ? 'default' : 'outline'}
                    className={cn(
                      'w-full text-black',
                      selectedRole === role && 'bg-[#1d37a6] text-white',
                      role === 'Channel partner' && 'text-sm whitespace-nowrap px-15'
                    )}
                    onClick={() => setSelectedRole(role)}
                  >
                    {role}
                  </Button>
                ))}
              </div>

              {/* Form Fields */}
              <div className='flex flex-col gap-4 w-full max-w-md mx-auto'>
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type='tel'
                          placeholder='Enter your phone number'
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
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Enter your name'
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
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Enter your email'
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
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='outline'
                              className='w-full justify-between text-left font-normal'
                              disabled={locationsLoading}
                            >
                              {field.value || 'Select city'}
                              <ChevronRightIcon className='ml-2 h-4 w-4 opacity-50' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className='w-[300px] max-h-[300px] overflow-y-auto'>
                            {/* Search Input */}
                            <div className='p-2 border-b'>
                              <div className='relative'>
                                <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                                <Input
                                  type='text'
                                  placeholder='Search city...'
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className='pl-10 pr-4 py-2 w-full'
                                  onClick={(e) => e.stopPropagation()}
                                  autoFocus
                                />
                              </div>
                            </div>
                            {/* City List */}
                            {locationsLoading ? (
                              <DropdownMenuItem disabled>Loading cities...</DropdownMenuItem>
                            ) : locationsError ? (
                              <DropdownMenuItem disabled>Error: {locationsError}</DropdownMenuItem>
                            ) : filteredCities.length === 0 ? (
                              <DropdownMenuItem disabled>No cities found</DropdownMenuItem>
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
                {signupError && <p className='text-red-500 text-sm text-center'>{signupError}</p>}
                <Button type='submit' className='w-full bg-[#1D3A76]' disabled={signupLoading || locationsLoading || !form.getValues('city')}>
                  {signupLoading ? 'Signing up...' : 'Start Now'}
                </Button>
              </div>

              {/* Divider */}
              <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border w-full max-w-md mx-auto'>
                <span className='relative z-10 bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>

              {/* Login Link */}
              <div className='text-center text-sm'>
                Already existing user?{' '}
                <a href='/loginotp' className='underline underline-offset-4'>
                  Login
                </a>
              </div>
            </div>
          </form>
        </Form>

        {/* Terms */}
        <div className='mt-4 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
          By clicking continue, you agree to our{' '}
          <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a>.
        </div>
      </div>

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setIsOtpModalOpen(false)}
          />
          <div className='relative z-50 w-80 rounded-lg bg-background p-6 shadow-lg'>
            <InputOTPForm onOtpSubmit={handleOtpSubmit} />
          </div>
        </div>
      )}
    </>
  );
}