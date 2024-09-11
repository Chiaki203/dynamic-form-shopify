"use client";

import { Button, AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import Link from "next/link";
import AppBridgeProvider from "./AppBridgeProvider";
import { useState } from "react";

const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [polarisNew, setPolarisNew] = useState(true);
  return (
    <PolarisProvider
      i18n={translations}
      features={{
        newDesignLanguage: polarisNew,
      }}
    >
      <Button onClick={() => setPolarisNew(!polarisNew)}>Swap</Button>
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
