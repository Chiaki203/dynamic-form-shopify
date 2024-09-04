import clientProvider from "@/utils/clientProvider.mjs";
// import verifyRequest from "@/app/api/verification/verifyRequest";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import path from "path";
// import withMiddleware from "@/utils/middleware/withMiddleware.js";

const handler = async (req: NextRequest, res: NextResponse) => {
  console.log("GET /api/apps/debug/activeWebhooks");
  const headersData = headers();
  const host = headersData.get("host");

  const authorization = headersData.get("authorization");
  // console.log("activeWebhooks authorization", authorization);
  console.log("activeWebhooks host", host);
  // console.log("activeWebhooks req.user_session", req.user_session);
  const protocol =
    (headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost"))
      ? "http"
      : "https";
  const apiBase = `${protocol}://${host}`;
  const verifyRequestResponse = await fetch(
    `${apiBase}/api/verification/verifyRequest`,
    {
      headers: {
        authorization: authorization ?? "",
      },
    }
  );

  const resData = await verifyRequestResponse.json();
  const resHeaders = verifyRequestResponse.headers;
  // console.log("activeWebhooks resHeaders", resHeaders);
  console.log("activeWebhooks resData", resData);
  const userShop = resHeaders.get("user_shop");
  console.log("activeWebhooks userShop", userShop);
  const userSession = JSON.parse(resHeaders.get("user_session") ?? "{}");
  console.log("activeWebhooks userSession", userSession);
  // const { auth } = await verifyRequest(req, res);
  // if (!auth) {
  //   return NextResponse.json({ error: "Unauthorized call" }, { status: 401 });
  // }
  try {
    const { client } = await clientProvider.online.graphqlClient({
      req,
      res,
      session: resData.onlineSession,
    });
    console.log("activeWebhooks client", client);
    // const activeWebhooks = await client.query({
    //   data: `query{
    //     webhookSubscriptions(first: 25) {
    //       edges {
    //         node {
    //           topic
    //           endpoint {
    //             __typename
    //             ... on WebhookHttpEndpoint {
    //               callbackUrl
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }`,
    // });
    const activeWebhooks = await client.request(
      `
        query WebhooksSubscriptions($first: Int!) {
      webhookSubscriptions(first: $first) {
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
    }`,
      {
        variables: {
          first: 25,
        },
      }
    );
    console.log("activeWebhooks activeWebhooks", activeWebhooks);
    return NextResponse.json(activeWebhooks, { status: 200 });
    // return res.status(200).send(activeWebhooks);
  } catch (e) {
    console.error(`---> An error occured`, e);
    return NextResponse.json({ text: "Bad request" }, { status: 400 });
    // return res.status(400).send({ text: "Bad request" });
  }
};

export { handler as GET, handler as POST };

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
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
