const AppBridgeProvider = ({ children }: { children: React.ReactNode }) => {
  if (typeof window !== "undefined") {
    const shop = window?.shopify?.config?.shop;
    console.log("shop", shop);
    if (!shop) {
      return <p>No Shop Provided</p>;
    }
  }

  return <>{children}</>;
};

export default AppBridgeProvider;
