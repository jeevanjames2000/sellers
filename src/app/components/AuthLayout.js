import { GalleryVerticalEnd } from "lucide-react";
import loginimage from "../../../public/assets/Free Listings for Builders and Partners A Strategic Initiative for Growth and Collaboration.png";

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/assets/login2 800X800.png"
          alt="Background"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
