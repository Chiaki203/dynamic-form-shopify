import shopify from "@/utils/shopify";
import appUninstallHandler from "@/utils/webhooks/app_uninstalled";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { buffer } from "@/utils/buffer";
import productsUpdateHandler from "@/utils/webhooks/products_update";
import ordersCreateHandler from "@/utils/webhooks/orders_create";
import { addHandlers } from "@/utils/register-webhooks";

// async function buffer(readable: any) {
//   const chunks = [];
//   for await (const chunk of readable) {
//     chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
//   }
//   return Buffer.concat(chunks);
// }

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextRequest, res: NextResponse) => {
  const reqHeaders = headers();
  const webhookData = shopify.webhooks.getTopicsAdded();
  console.log("webhookData", webhookData);
  console.log("webhook reqHeaders", reqHeaders);
  console.log("webhook req", req);
  console.log("webhook req body", req.body);
  const topic = reqHeaders.get("x-shopify-topic") as string;
  const shop = reqHeaders.get("x-shopify-shop-domain");
  const apiVersion = reqHeaders.get("x-shopify-api-version");
  const webhookId = reqHeaders.get("x-shopify-webhook-id");
  const handlers = shopify.webhooks.getHandlers(topic);
  try {
    if (handlers.length === 0) {
      console.log("No handlers found for topic", topic);
      addHandlers();
    }
    console.log("webhook topic shop", shop);
    console.log("webhook topic topic", topic);

    const rawBodyText = await req.text();
    // console.log("webhook topic rawBodyText", rawBodyText);
    const validateWebhook = await shopify.webhooks.validate({
      rawBody: rawBodyText,
      rawRequest: req,
      rawResponse: res,
    });
    console.log("webhook topic validateWebhook", validateWebhook);
    console.log("webhook topic validateWebhook topic", validateWebhook.topic);
    // switch (validateWebhook.topic) {
    switch (topic) {
      // case "APP_UNINSTALLED":
      case "app/uninstalled":
        appUninstallHandler(
          // topic,
          validateWebhook.topic,
          shop as string,
          rawBodyText,
          webhookId as string,
          apiVersion as string
        );
        break;
      // case "PRODUCTS_UPDATE":
      case "products/update":
        productsUpdateHandler(
          // topic,
          validateWebhook.topic,
          shop as string,
          rawBodyText,
          webhookId as string,
          apiVersion as string
        );
        break;
      // case "ORDERS_CREATE":
      case "orders/create":
        ordersCreateHandler(
          // topic,
          validateWebhook.topic,
          shop as string,
          rawBodyText,
          webhookId as string,
          apiVersion as string
        );
      default:
        throw new Error(`Can't find a handler for ${validateWebhook.topic}`);
    }

    // await shopify.webhooks.process({
    //   rawBody: rawBodyText,
    //   rawRequest: req,
    // });
    // console.log("webhook handler processed ", topic);
    console.log(`--> Processed ${topic} from ${shop}`);
    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (e: any) {
    console.error(`Error while processing webhooks ${topic} | ${e.message}`);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }

  // const buff = await buffer(req.body);
  // const rawBody = buff.toString("utf8");
  // console.log("webhook topic rawBody", rawBody);
  // try {
  //   const validateWebhook = await shopify.webhooks.validate({
  //     rawBody: rawBody,
  //     rawRequest: req,
  //     rawResponse: res,
  //   });
  //   console.log("webhook topic validateWebhook", validateWebhook);
  //   // const rawBody = "";

  //   //SWITCHCASE
  //   switch (validateWebhook.topic) {
  //     // switch (topic) {
  //     case "APP_UNINSTALLED":
  //       appUninstallHandler(
  //         // topic,
  //         validateWebhook.topic,
  //         shop as string,
  //         rawBody,
  //         webhookId as string,
  //         apiVersion as string
  //       );
  //       break;
  //     case "PRODUCTS_UPDATE":
  //       productsUpdateHandler(
  //         // topic,
  //         validateWebhook.topic,
  //         shop as string,
  //         rawBody,
  //         webhookId as string,
  //         apiVersion as string
  //       );
  //       break;
  //     case "ORDERS_CREATE":
  //       ordersCreateHandler(
  //         // topic,
  //         validateWebhook.topic,
  //         shop as string,
  //         rawBody,
  //         webhookId as string,
  //         apiVersion as string
  //       );
  //     default:
  //       throw new Error(`Can't find a handler for ${validateWebhook.topic}`);
  //   }
  //   //SWITCHCASE END

  //   console.log(`--> Processed ${topic} from ${shop}`);
  //   return NextResponse.json({ message: "ok" }, { status: 200 });
  //   // return res.status(200).send({ message: "ok" });
  // } catch (e: any) {
  //   console.error(
  //     `---> Error while processing webhooks for ${shop} at ${topic} | ${e.message}`
  //   );

  //   if (!res.headers) {
  //     console.error("No headers sent");
  //   }
  //   return NextResponse.json({ message: "Error" }, { status: 500 });
  //   // return res.status(500).send({ message: "Error" });
  // }
};

export { handler as GET, handler as POST };
