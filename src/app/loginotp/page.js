import Link from "next/link";
import AuthLayout from "../components/AuthLayout";
import { LoginWithOtp } from "@/components/ui/login-otp";

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="space-y-4 relative bottom-15 justify-center">
        <LoginWithOtp />
      </div>
    </AuthLayout>
  );
}
