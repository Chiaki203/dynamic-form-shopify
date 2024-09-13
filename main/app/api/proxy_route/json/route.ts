import clientProvider from "@/utils/clientProvider.mjs";
import { headers } from "next/headers";
// import verifyProxy from "@/app/api/verification/verifyProxy";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// const handler = async (req: NextRequest, res: NextResponse) => {
//   // const { signature } = req.query;
//   console.log("proxy-route req", req);
//   const signature = req.nextUrl.searchParams.get("signature");
//   console.log("signature", signature);

//   const queryURI = encodeQueryData(req.query)
//     .replace("/?", "")
//     .replace(/&signature=[^&]*/, "")
//     .split("&")
//     .map((x) => decodeURIComponent(x))
//     .sort()
//     .join("");

//   const calculatedSignature = crypto
//     .createHmac("sha256", process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET!)
//     .update(queryURI, "utf-8")
//     .digest("hex");

//   if (calculatedSignature === signature) {
//     // req.user_shop = req.query.shop; //myshopify domain

//     // const { client } = await clientProvider.offline.graphqlClient({
//     //   shop: req.user_shop,
//     // });
//     return NextResponse.json(
//       { content: "Proxy Be Working update Thursday" },
//       { status: 200 }
//     );

//     // return NextResponse.json({ signatureVerified: true });
//   } else {
//     return NextResponse.json(
//       { signatureVerified: false, message: "Signature verification failed" },
//       { status: 401 }
//     );
//     // return res.status(401).send({
//     //   success: false,
//     //   message: "Signature verification failed",
//     // });
//   }
// };

// /**
//  * Encodes the provided data into a URL query string format.
//  *
//  * @param {Record<string, any>} data - The data to be encoded.
//  * @returns {string} The encoded query string.
//  */
// function encodeQueryData(data: any) {
//   const queryString = [];
//   for (let d in data) queryString.push(d + "=" + encodeURIComponent(data[d]));
//   return queryString.join("&");
// }

// export { handler as GET, handler as POST };

// <script>
// async function fetchData() {
// const response = await fetch("/apps/subpath/json")
// }
// console.log(await response.json())
// fetchData()
// </script>

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const headersData = headers();
    const host = headersData.get("host");
    const authorization = headersData.get("authorization");
    const protocol =
      (headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost"))
        ? "http"
        : "https";
    // const apiBase = `${protocol}://${host}`;
    const apiBase = process.env.NEXT_PUBLIC_SHOPIFY_APP_URL;
    // console.log("proxy-route req", req);
    console.log("proxy-route nextURL", req.nextUrl.search);
    const signature = req.nextUrl.searchParams.get("signature");
    const user_shop = req.nextUrl.searchParams.get("shop");
    console.log("signature", signature);
    const verifyProxyResponse = await fetch(
      `${apiBase}/api/verification/verifyProxy`,
      {
        method: "POST",
        headers: {
          authorization: authorization ?? "",
        },
        body: JSON.stringify({
          signature: signature,
          searchQuery: req.nextUrl.search,
          user_shop: user_shop,
        }),
      }
    );
    const verifyProxyResponseData = await verifyProxyResponse.json();
    console.log("verifyProxyResponseData", verifyProxyResponseData);
    // const resHeaders = headers();
    // console.log("resHeaders", resHeaders);
    // const { signatureVerified } = await verifyProxy(req, res);
    // if (!signatureVerified) {
    //   return NextResponse.json(
    //     { success: false, message: "Signature verification failed" },
    //     { status: 401 }
    //   );
    // }
    const verifiedUserShop = verifyProxyResponseData.user_shop;
    const { client } = await clientProvider.offline.graphqlClient({
      shop: verifiedUserShop ?? "",
    });
    console.log("client", client);
    return NextResponse.json(
      { content: "Proxy Be Working again" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized call" }, { status: 401 });
  }
}

// import withMiddleware from "@/utils/middleware/withMiddleware";
// import { NextApiRequest, NextApiResponse } from "next";

// /**
//  * @param {import("next").NextApiRequest} req - The HTTP request object.
//  * @param {import("next").NextApiResponse} res - The HTTP response object.
//  */
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
// const { client } = await clientProvider.offline.graphqlClient({
//   shop: req.user_shop,
// });

//   return res.status(200).send({ content: "Proxy Be Working" });
// };

// export default withMiddleware("verifyProxy")(handler);
