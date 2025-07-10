import Link from "next/link";
import AuthLayout from "../components/AuthLayout";
import { SignupForm } from "@/components/ui/signup-form";

export default function SignupPage() {
  return (
    <AuthLayout>
      <div className="space-y-4">
        <SignupForm />
      </div>
    </AuthLayout>
  );
}
