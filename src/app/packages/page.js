import Authuserverify from "@/components/shared/AuthVerify";
import dynamic from "next/dynamic";
const PackagesWrapper = dynamic(() =>
  import("@/components/packages/PackagesWrapper")
);
import React from "react";

function page() {
  return (
    <Authuserverify>
      <PackagesWrapper />
    </Authuserverify>
  );
}

export default page;
