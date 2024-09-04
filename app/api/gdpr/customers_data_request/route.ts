import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
// import verifyHmac from "@/app/api/verification/verifyHmac/route";

export async function GET(req: NextRequest, res: NextResponse) {
  return NextResponse.json(
    { content: "gdpr/customers_data_request" },
    { status: 200 }
  );
}

export async function POST(req: NextRequest, res: NextResponse) {
  const headersData = headers();
  const host = headersData.get("host");
  console.log("customers_data_request req body", req.body);
  const protocol =
    (headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost"))
      ? "http"
      : "https";
  const apiBase = `${protocol}://${host}`;
  const verifyHmacResponse = await fetch(
    `${apiBase}/api/verification/verifyHmac`
  );
  // const { hmac } = await verifyHmac(req, res);
  // if (!hmac) {
  //   return NextResponse.json(
  //     { success: false, message: "HMAC verification failed" },
  //     { status: 401 }
  //   );
  // }
  const { body } = req;
  const shop = req.body?.shop_domain;
  console.log("gdpr/customers_data_request", body, shop);
}

// import withMiddleware from "@/utils/middleware/withMiddleware";
// import { NextApiRequest, NextApiResponse } from "next";

/**
//  * @param {import("next").NextApiRequest} req - The HTTP request object.
//  * @param {import("next").NextApiResponse} res - The HTTP response object.
//  */
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method !== "POST") {
//     return res.status(401).send("Must be POST");
//   }
//   const { body } = req;
//   const shop = req.body.shop_domain;
//   console.log("gdpr/customers_data_request", body, shop);
// };

// export default withMiddleware("verifyHmac")(handler);
