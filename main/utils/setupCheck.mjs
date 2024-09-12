const setupCheck = () => {
  try {
    const {
      NEXT_PUBLIC_SHOPIFY_API_KEY: apiKey,
      NEXT_PUBLIC_SHOPIFY_API_SECRET: apiSecret,
      NEXT_PUBLIC_SHOPIFY_API_SCOPES: apiScopes,
      NEXT_PUBLIC_SHOPIFY_APP_URL: appUrl,
      NEXT_PUBLIC_SHOPIFY_API_VERSION: apiVersion,
      NEXT_PUBLIC_ENCRYPTION_STRING: encString,
      DATABASE_URL: databaseURL,
      NEXT_PUBLIC_APP_NAME: appName,
      NEXT_PUBLIC_APP_HANDLE: appHandle,
      NEXT_PUBLIC_APP_PROXY_PREFIX: proxyPrefix,
      NEXT_PUBLIC_APP_PROXY_SUBPATH: proxySubpath,
    } = process.env;

    if (typeof apiKey === "undefined") {
      throw Error("---> API Key is undefined.");
    }
    if (typeof apiSecret === "undefined") {
      throw Error("---> API Secret is undefined.");
    }
    if (typeof apiScopes === "undefined") {
      throw Error("---> API Scopes are undefined.");
    }
    if (typeof appUrl === "undefined") {
      throw Error("---> App URL is undefined.");
    } else if (!appUrl.includes("https://")) {
      console.error("---> Please use HTTPS for SHOPIFY_APP_URL.");
    }
    if (typeof apiVersion === "undefined") {
      throw Error("---> API Version is undefined.");
    }
    if (typeof encString === "undefined") {
      throw Error("---> Encryption String is undefined.");
    }

    if (typeof databaseURL === "undefined") {
      throw Error("---> Database string is undefined.");
    }

    if (typeof appName === "undefined" || appName.length < 1) {
      throw Error(
        `---> App Name is ${appName.length < 1 ? "not entered properly" : "undefined"}.`
      );
    }
    if (typeof appHandle === "undefined") {
      throw Error("---> App Handle is undefined.");
    }
    if (appHandle.includes(" ")) {
      throw Error("---> Handle must be URL encoded and cannot contain spaces.");
    }

    if (typeof proxySubpath === "undefined") {
      console.warn(
        "---> App Proxy subpath is undefined and will not be used. Make sure your app doesn't use App proxy"
      );
    } else {
      if (typeof proxyPrefix === "undefined") {
        throw Error("---> App proxy prefix is undefined");
      }
      switch (proxyPrefix) {
        case "apps":
        case "a":
        case "community":
        case "tools":
          break;
        default:
          throw Error(
            "Invalid App proxy prefix, please make sure the value is either of these:\napps\na\ncommunity\ntools"
          );
      }
    }

    console.log("--> Setup checks passed successfully.");
  } catch (e) {
    console.error(e.message);
  }
};

export default setupCheck;
