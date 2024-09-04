import shopify from "@/utils/shopify";
import appUninstallHandler from "@/utils/webhooks/app_uninstalled";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { buffer } from "@/utils/buffer";

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
  // const topic = reqHeaders.get("x-shopify-topic");
  // const shop = reqHeaders.get("x-shopify-shop-domain");
  // const apiVersion = reqHeaders.get("x-shopify-api-version");
  // const webhookId = reqHeaders.get("x-shopify-webhook-id");
  const topic = "APP_UNINSTALLED";
  const shop = reqHeaders.get("x-shopify-shop-domain");
  const apiVersion = "";
  const webhookId = "";
  console.log("webhook topic shop", shop);

  // const buff = await buffer(req.body);
  // const rawBody = buff.toString("utf8");
  try {
    // const validateWebhook = await shopify.webhooks.validate({
    //   rawBody: rawBody,
    //   rawRequest: req,
    //   rawResponse: res,
    // });

    const rawBody = "";

    //SWITCHCASE
    // switch (validateWebhook.topic) {
    switch (topic) {
      case "APP_UNINSTALLED":
        appUninstallHandler(
          topic,
          // validateWebhook.topic,
          shop as string,
          rawBody,
          webhookId as string,
          apiVersion as string
        );
        break;
      default:
        throw new Error(`Can't find a handler for ${topic}`);
    }
    //SWITCHCASE END

    console.log(`--> Processed ${topic} from ${shop}`);
    return NextResponse.json({ message: "ok" }, { status: 200 });
    // return res.status(200).send({ message: "ok" });
  } catch (e: any) {
    console.error(
      `---> Error while processing webhooks for ${shop} at ${topic} | ${e.message}`
    );

    if (!res.headers) {
      console.error("No headers sent");
    }
    return NextResponse.json({ message: "Error" }, { status: 500 });
    // return res.status(500).send({ message: "Error" });
  }
};

export { handler as GET, handler as POST };
