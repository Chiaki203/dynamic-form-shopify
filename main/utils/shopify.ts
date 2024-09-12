import {
  ApiVersion,
  AuthScopes,
  LogSeverity,
  shopifyApi,
  // Shopify,
} from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import appUninstallHandler from "./webhooks/app_uninstalled";
import ordersCreateHandler from "./webhooks/orders_create";
import productsUpdateHandler from "./webhooks/products_update";

const isDev = process.env.NODE_ENV === "development";

console.log(
  "process.env.SHOPIFY_API_KEY",
  process.env.NEXT_PUBLIC_SHOPIFY_API_KEY
);

// Setup Shopify configuration
let shopify = shopifyApi({
  apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
  apiSecretKey: process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET || "",
  scopes: process.env.NEXT_PUBLIC_SHOPIFY_API_SCOPES as
    | string[]
    | AuthScopes
    | undefined,
  hostName: process.env.NEXT_PUBLIC_SHOPIFY_APP_URL!.replace(/https:\/\//, ""),
  hostScheme: "https",
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION as ApiVersion,
  isEmbeddedApp: true,
  logger: { level: isDev ? LogSeverity.Info : LogSeverity.Error },
});

/*
  Template for adding new topics:
  ```
    {
      topics: ["",""] //Get this from `https://shopify.dev/docs/api/webhooks?reference=toml`
      url: "/api/webhooks/topic_name" //this can be AWS, PubSub or HTTP routes.
      callback: () //This HAS to be in utils/webhooks/ and created with the `createwebhook` snippet.
      filter: "" //Optional - filter what webhooks you recieve
      include_fields: ["",""] //Optional - decide what fields you want to recieve
    }
  ```
 */

//Add custom user properties to base shopify obj
shopify = {
  ...shopify,
  user: {
    /**
     * @type {Array<{
     *   topics: string[],
     *   url: string,
     *   callback: Function,
     *   filter?: string,
     *   include_fields?: string[]
     * }>}
     */
    webhooks: [
      {
        topics: ["app/uninstalled"],
        url: "/api/webhooks/app_uninstalled",
        callback: appUninstallHandler,
      },
      {
        topics: ["products/update"],
        url: "/api/webhooks/products_update",
        callback: productsUpdateHandler,
      },
      {
        topics: ["orders/create"],
        url: "/api/webhooks/orders_create",
        callback: ordersCreateHandler,
      },
    ],
  },
};

export default shopify;
