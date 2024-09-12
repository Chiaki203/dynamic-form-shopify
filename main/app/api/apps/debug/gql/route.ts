import clientProvider from "@/utils/clientProvider.mjs";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  console.log("GET /api/apps/debug/gql");
  try {
    const headersData = headers();
    const host = headersData.get("host");
    const authorization = headersData.get("authorization");
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
    const { client } = await clientProvider.online.graphqlClient({
      req,
      res,
      session: resData.onlineSession,
    });
    const shop = await client.request(`{shop{name}}`);
    console.log("/api/apps/debug/gql shop", shop);
    return NextResponse.json({ text: shop.data.shop.name }, { status: 200 });
  } catch (e) {
    console.error(`---> An error occured`, e);
    return NextResponse.json({ text: "Bad request" }, { status: 400 });
  }
}

// const handler = async (req: NextRequest, res: NextResponse) => {
//   if (req.method === "GET") {
//     try {
//       const { client } = await clientProvider.online.graphqlClient({
//         req,
//         res,
//       });
//       const shop = await client.request(`{shop{name}}`);
//       return res.status(200).send({ text: shop.data.shop.name });
//     } catch (e) {
//       console.error(`---> An error occured`, e);
//       return res.status(400).send({ text: "Bad request" });
//     }
//   } else {
//     res.status(400).send({ text: "Bad request" });
//   }
// };

// export default withMiddleware("verifyRequest")(handler);
