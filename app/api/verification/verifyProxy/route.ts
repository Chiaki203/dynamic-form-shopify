import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest, res: NextResponse) => {
  // console.log("verify proxy req", req);
  // const signature = req.nextUrl.searchParams.get("signature");
  const data = await req.json();
  console.log("verify proxy data", data);

  console.log("signature verifyProxy", data.signature);
  console.log("searchQuery verifyProxy", data.searchQuery);
  console.log("user_shop verifyProxy", data.user_shop);
  // const queryURI = encodeQueryData(data.nextUrl)
  // const queryString = [];
  // queryString.push(data.nextUrl);
  const queryURI = data.searchQuery
    .replace("?", "")
    .replace(/&signature=[^&]*/, "")
    .split("&")
    .map((x: any) => decodeURIComponent(x))
    .sort()
    .join("");

  const calculatedSignature = crypto
    .createHmac("sha256", process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET!)
    .update(queryURI, "utf-8")
    .digest("hex");
  console.log("calculatedSignature", calculatedSignature);

  if (calculatedSignature === data.signature) {
    // req.user_shop = req.query.shop; //myshopify domain
    // return NextResponse.json(
    //   { content: "Proxy Be Working update Thursday" },
    //   { status: 200 }
    // );
    // const resHeaders = {
    //   user_shop: data.user_shop,
    // };
    return NextResponse.json(
      { signatureVerified: true, user_shop: data.user_shop },
      { status: 200 }
    );
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
