"use client";

import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import Link from "next/link";
import AppBridgeProvider from "./AppBridgeProvider";

const MainProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PolarisProvider
      i18n={translations}
      features={
        {
          // newDesignLanguage: true,
        }
      }
    >
      <AppBridgeProvider>
        <ui-nav-menu>
          <Link href="/debug">Debug Cards</Link>
        </ui-nav-menu>
        {children}
      </AppBridgeProvider>
    </PolarisProvider>
  );
};

export default MainProvider;
