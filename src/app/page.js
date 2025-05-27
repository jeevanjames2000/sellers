import DashboardWrapper from "@/components/dashboard/DashboardWrapper";
import Header from "@/components/header/Header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <DashboardWrapper/>
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
