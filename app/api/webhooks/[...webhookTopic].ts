/**
 * DO NOT EDIT THIS FILE DIRECTLY
 * Head over to utils/shopify.mjs to create your webhooks
 *  and write your webhook functions in utils/webhooks.
 * If you don't know the format, use the `createwebhook` snippet when using VSCode
 *  to get a boilerplate function for webhooks.
 * To update this file, run `npm run update:config` or `bun run update:config`
 */

import ordersCreateHandler from "@/utils/webhooks/orders_create";
import productsUpdateHandler from "@/utils/webhooks/products_update";
import shopify from "@/utils/shopify";
import appUninstallHandler from "@/utils/webhooks/app_uninstalled";

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(400).send("It ain't POST mate.");
  }

  const topic = req.headers["x-shopify-topic"] || "";
  const shop = req.headers["x-shopify-shop-domain"] || "";
  const apiVersion = req.headers["x-shopify-api-version"] || "";
  const webhookId = req.headers["x-shopify-webhook-id"] || "";

  const buff = await buffer(req);
  const rawBody = buff.toString("utf8");

  try {
    const validateWebhook = await shopify.webhooks.validate({
      rawBody: rawBody,
      rawRequest: req,
      rawResponse: res,
    });

    //SWITCHCASE
    switch (validateWebhook.topic) {
      case "APP_UNINSTALLED":
        appUninstallHandler(
          validateWebhook.topic,
          shop,
          rawBody,
          webhookId,
          apiVersion
        );
        break;
      default:
        throw new Error(`Can't find a handler for ${topic}`);
    }
    //SWITCHCASE !!! END

    console.log(`--> Processed ${topic} from ${shop}`);
    return res.status(200).send({ message: "ok" });
  } catch (e: any) {
    console.error(
      `---> Error while processing webhooks for ${shop} at ${topic} | ${e.message}`
    );

    if (!res.headersSent) {
      console.error("No headers sent");
    }
    return res.status(500).send({ message: "Error" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
