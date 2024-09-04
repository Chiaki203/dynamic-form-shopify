import { setupGDPRWebHooks } from "@/helpers/gdpr";
import shopify from "./shopify";
import { DeliveryMethod, Session } from "@shopify/shopify-api";

let webhookInitialized = false;

export const addHandlers = () => {
  if (!webhookInitialized) {
    webhookInitialized = true;
    setupGDPRWebHooks();
    shopify.webhooks.addHandlers({
      ["APP_UNINSTALLED"]: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks/app_uninstalled",
      },
      ["PRODUCTS_UPDATE"]: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks/products_update",
      },
      ["ORDERS_CREATE"]: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks/orders_create",
      },
    });
    console.log("Added Handlers");
  } else {
    console.log("Handlers already added");
  }
};

export const registerWebhooks = async (session: Session) => {
  addHandlers();
  const response = await shopify.webhooks.register({ session });
  console.log("webhook registered", response);
};
