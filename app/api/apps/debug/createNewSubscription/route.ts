import clientProvider from "@/utils/clientProvider.mjs";
import { headers } from "next/headers";
// import verifyRequest from "@/app/api/verification/verifyRequest";
import { NextRequest, NextResponse } from "next/server";
// import withMiddleware from "@/utils/middleware/withMiddleware";

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("POST /api/apps/debug/createNewSubscription");
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
  const userShop = resHeaders.get("user_shop");

  const { client } = await clientProvider.online.graphqlClient({
    req,
    res,
    session: resData.onlineSession,
  });
  // const returnUrl = `${process.env.NEXT_PUBLIC_SHOPIFY_APP_URL}/?shop=${req.user_shop}`;
  const returnUrl = `${process.env.NEXT_PUBLIC_SHOPIFY_APP_URL}/?shop=${userShop}`;

  const planName = "$10.25 plan";
  const planPrice = 10.25; //Always a decimal

  const response = await client.request(
    `mutation CreateSubscription{
    appSubscriptionCreate(
      name: "${planName}"
      returnUrl: "${returnUrl}"
      test: true
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails: {
              price: { amount: ${planPrice}, currencyCode: USD }
            }
          }
        }
      ]
    ) {
      userErrors {
        field
        message
      }
      confirmationUrl
      appSubscription {
        id
        status
      }
    }
  }
`
  );

  if (response.data.appSubscriptionCreate.userErrors.length > 0) {
    console.log(
      `--> Error subscribing ${req.user_shop} to plan:`,
      response.data.appSubscriptionCreate.userErrors
    );
    // res.status(400).send({ error: "An error occured." });
    return NextResponse.json({ error: "An error occured." }, { status: 400 });
  }

  // res.status(200).send({
  //   confirmationUrl: `${response.data.appSubscriptionCreate.confirmationUrl}`,
  // });
  return NextResponse.json(
    {
      confirmationUrl: `${response.data.appSubscriptionCreate.confirmationUrl}`,
    },
    { status: 200 }
  );
}

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
// const handler = async (req, res) => {
//   //false for offline session, true for online session
//   const { client } = await clientProvider.online.graphqlClient({
//     req,
//     res,
//   });
//   const returnUrl = `${process.env.NEXT_PUBLIC_SHOPIFY_APP_URL}/?shop=${req.user_shop}`;

//   const planName = "$10.25 plan";
//   const planPrice = 10.25; //Always a decimal

//   const response = await client.request(
//     `mutation CreateSubscription{
//     appSubscriptionCreate(
//       name: "${planName}"
//       returnUrl: "${returnUrl}"
//       test: true
//       lineItems: [
//         {
//           plan: {
//             appRecurringPricingDetails: {
//               price: { amount: ${planPrice}, currencyCode: USD }
//             }
//           }
//         }
//       ]
//     ) {
//       userErrors {
//         field
//         message
//       }
//       confirmationUrl
//       appSubscription {
//         id
//         status
//       }
//     }
//   }
// `
//   );

//   if (response.data.appSubscriptionCreate.userErrors.length > 0) {
//     console.log(
//       `--> Error subscribing ${req.user_shop} to plan:`,
//       response.data.appSubscriptionCreate.userErrors
//     );
//     res.status(400).send({ error: "An error occured." });
//     return;
//   }

//   res.status(200).send({
//     confirmationUrl: `${response.data.appSubscriptionCreate.confirmationUrl}`,
//   });
//   return;
// };

// export default withMiddleware("verifyRequest")(handler);
