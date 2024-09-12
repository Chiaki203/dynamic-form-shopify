import fs from "fs";

/**
 * Replace TOPIC_NAME with a Webhook Topic to enable autocomplete
 * @typedef { import("@/_developer/types/2024-07/webhooks.js").ORDERS_CREATE } webhookTopic
 */

const ordersCreateHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: string
) => {
  try {
    /** @type {webhookTopic} */
    const webhookBody = JSON.parse(webhookRequestBody);
    console.log("webhookBody", webhookBody);
    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error(e);
  }
};

export default ordersCreateHandler;
