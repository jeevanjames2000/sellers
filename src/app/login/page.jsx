
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="space-y-4">
        <LoginForm />
       
      </div>
    </AuthLayout>
  );
}