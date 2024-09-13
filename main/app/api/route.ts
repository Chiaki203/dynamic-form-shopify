//TEMP
import clientProvider from "@/utils/clientProvider.mjs";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest, res: NextResponse) => {
  const headersData = headers();
  const host = headersData.get("host");
  const authorization = headersData.get("authorization");
  const protocol =
    (headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost"))
      ? "http"
      : "https";
  // const apiBase = `${protocol}://${host}`;
  const apiBase = process.env.NEXT_PUBLIC_SHOPIFY_APP_URL;
  const verifyRequestResponse = await fetch(
    `${apiBase}/api/verification/verifyRequest`,
    {
      headers: {
        authorization: authorization ?? "",
      },
    }
  );
  const resData = await verifyRequestResponse.json();
  try {
    const { client } = await clientProvider.online.graphqlClient({
      req,
      res,
      session: resData.onlineSession,
    });
    const activeWebhooks = await client.request(
      `{
    webhookSubscriptions(first: 25) {
      edges {
        node {
          topic
          endpoint {
            __typename
            ... on WebhookHttpEndpoint {
              callbackUrl
            }
          }
        }
      }
    }
  }`
    );
    return NextResponse.json(activeWebhooks, { status: 200 });
    // return res.status(200).send(activeWebhooks);
  } catch (e) {
    console.error(`---> An error occured`, e);
    return NextResponse.json({ text: "Bad request" }, { status: 400 });
    // return res.status(400).send({ text: "Bad request" });
  }
};

export { handler as GET, handler as POST };

// import withMiddleware from "@/utils/middleware/withMiddleware.js";

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextA
 * piResponse} res - The HTTP response object.
 */
// const handler = async (req, res) => {
//   if (req.method === "GET") {
//     try {
//       const { client } = await clientProvider.online.graphqlClient({
//         req,
//         res,
//       });
//       const activeWebhooks = await client.request(
//         `{
//       webhookSubscriptions(first: 25) {
//         edges {
//           node {
//             topic
//             endpoint {
//               __typename
//               ... on WebhookHttpEndpoint {
//                 callbackUrl
//               }
//             }
//           }
//         }
//       }
//     }`
//       );
//       return res.status(200).send(activeWebhooks);
//     } catch (e) {
//       console.error(`---> An error occured`, e);
//       return res.status(400).send({ text: "Bad request" });
//     }
//   } else {
//     res.status(400).send({ text: "Bad request" });
//   }
// };

// export default withMiddleware("verifyRequest")(handler);
