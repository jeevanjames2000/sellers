import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm({ className, ...props }) {
  return (
    <div>
      <form className={cn("flex flex-col", className)} {...props}>
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Your property will sell or rent faster online in MeetOwner
            </p>
          </div>

          {/* Role Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md mx-auto">
            {["Builder", "Agent", "Owner", "Channel partner"].map((role) => (
              <Button key={role} variant="outline" className="w-full text-black ">
                {role}
              </Button>
            ))}
          </div>

          {/* Input Fields */}
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="Enter your phone number" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Enter your name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" type="text" placeholder="Select city" required />
            </div>
            <Button type="submit" className="w-full">
              Start Now
            </Button>
          </div>

          {/* Divider */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border w-full max-w-md mx-auto">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm">
            Already existing user?{" "}
            <a href="/" className="underline underline-offset-4">
              Login
            </a>
          </div>
        </div>
      </form>

      {/* Terms */}
      <div className="mt-4 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
