import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import verifyHmac from "@/app/api/verification/verifyHmac/route";

export async function POST(req: NextRequest, res: NextResponse) {
  const headersData = headers();
  const host = headersData.get("host");
  console.log("shop_redact req body", req.body);
  const protocol =
    (headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost"))
      ? "http"
      : "https";
  // const apiBase = `${protocol}://${host}`;
  const apiBase = process.env.NEXT_PUBLIC_SHOPIFY_APP_URL;
  const verifyHmacResponse = await fetch(
    `${apiBase}/api/verification/verifyHmac`
  );
  const { body } = req;
  const shop = req.body.shop_domain;
  console.log("gdpr/customers_redact", body, shop);
}

// import withMiddleware from "@/utils/middleware/withMiddleware";
// import { NextApiRequest, NextApiResponse } from "next";

// /**
//  * @param {import("next").NextApiRequest} req - The HTTP request object.
//  * @param {import("next").NextApiResponse} res - The HTTP response object.
//  */
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method !== "POST") {
//     return res.status(401).send("Must be POST");
//   }
//   const { body } = req;
//   const shop = req.body.shop_domain;
//   console.log("gdpr/shop_redact", body, shop);
// };

// export default withMiddleware("verifyHmac")(handler);
