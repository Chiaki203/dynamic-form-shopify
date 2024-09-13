import clientProvider from "@/utils/clientProvider.mjs";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
// import withMiddleware from "@/utils/middleware/withMiddleware";

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req: NextRequest, res: NextResponse) => {
  //false for offline session, true for online session
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

  const { client } = await clientProvider.online.graphqlClient({
    req,
    res,
    session: resData.onlineSession,
  });

  const response = await client.request(
    `{
      appInstallation {
        activeSubscriptions {
          name
          status
          lineItems {
            plan {
              pricingDetails {
                ... on AppRecurringPricing {
                  __typename
                  price {
                    amount
                    currencyCode
                  }
                  interval
                }
              }
            }
          }
          test
        }
      }
    }`
  );
  return NextResponse.json(response, { status: 200 });
  // res.status(200).send(response);
};

export { handler as GET, handler as POST };
