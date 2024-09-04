import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest, res: NextResponse) => {
  const { signature } = req.query;

  const queryURI = encodeQueryData(req.query)
    .replace("/?", "")
    .replace(/&signature=[^&]*/, "")
    .split("&")
    .map((x) => decodeURIComponent(x))
    .sort()
    .join("");

  const calculatedSignature = crypto
    .createHmac("sha256", process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET!)
    .update(queryURI, "utf-8")
    .digest("hex");

  if (calculatedSignature === signature) {
    req.user_shop = req.query.shop; //myshopify domain
    return NextResponse.json({ signatureVerified: true });
  } else {
    return NextResponse.json(
      { signatureVerified: false, message: "Signature verification failed" },
      { status: 401 }
    );
    // return res.status(401).send({
    //   success: false,
    //   message: "Signature verification failed",
    // });
  }
};

/**
 * Encodes the provided data into a URL query string format.
 *
 * @param {Record<string, any>} data - The data to be encoded.
 * @returns {string} The encoded query string.
 */
function encodeQueryData(data: any) {
  const queryString = [];
  for (let d in data) queryString.push(d + "=" + encodeURIComponent(data[d]));
  return queryString.join("&");
}

export { handler as GET, handler as POST };
