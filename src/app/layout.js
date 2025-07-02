import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import ReduxProvider from "../store/provider";
import { Toaster } from "react-hot-toast";
import ProfileCheckProvider from "@/components/services/ProfileCheckProvider";
import Script from "next/script";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Meet Owner Seller Panel",
  description:
    "Meet Owner Seller Panel is a platform for sellers to list their properties for rent or sale.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager Script */}
        <Script id="gtm-head" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P8HMN9BJ');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P8HMN9BJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <ProfileCheckProvider>
          <ReduxProvider>
            <Header />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 1000,
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
          </ReduxProvider>
        </ProfileCheckProvider>
        <Script id="zoho-init" strategy="afterInteractive">
          {`
      window.$zoho=window.$zoho || {};
      $zoho.salesiq = $zoho.salesiq || {
        ready: function() {}
      };
    `}
        </Script>
        <Script
          id="zoho-widget"
          src="https://salesiq.zohopublic.in/widget?wc=siqbdc3c6965f224357beb76e88daf7a326ebc82bba19dd5ed3c2d6ca40c5bcc10c"
          strategy="afterInteractive"
          defer
        />
      </body>
    </html>
  );
}
