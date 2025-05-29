import dynamic from "next/dynamic";
const PackagesWrapper = dynamic(() =>
  import("@/components/packages/PackagesWrapper")
);
import React from "react";

function page() {
  return <PackagesWrapper />;
}

export default page;
