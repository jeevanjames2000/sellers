"use client";

import dynamic from "next/dynamic";
import Authuserverify from "@/components/shared/AuthVerify";

const InvoiceScreen = dynamic(
  () => import("@/components/Invoices/InVoiceScreen"),
  {
    ssr: false,
  }
);

export default function InvoiceClientWrapper() {
  return (
    <Authuserverify>
      <InvoiceScreen />
    </Authuserverify>
  );
}
