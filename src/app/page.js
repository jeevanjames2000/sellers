import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import Header from "@/components/header/Header";
import Image from "next/image";
import Link from "next/link";
import LoginPage from "./login/page";
import SignupPage from "./signup/Page";

export default function Home() {
  return (
    <>
      <div>
        <div className="flex flex-col  justify-center min-h-screen">
          <SignupPage/>
         {/* <LoginPage/> */}
          {/* <Link href="/addProperty">
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Add Property
            </button>
          </Link> */}
        </div>
      </div>
    </>
  );
}
