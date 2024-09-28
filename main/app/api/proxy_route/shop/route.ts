import clientProvider from "@/utils/clientProvider.mjs";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // console.log("proxy shop req", req);
    const headersData = headers();
    // console.log("proxy shop headersData", headersData);
    const host = headersData.get("host");
    const authorization = headersData.get("authorization");
    const protocol =
      (headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost"))
        ? "http"
        : "https";
    const apiBase = `${protocol}://${host}`;
    // const apiBase = process.env.NEXT_PUBLIC_SHOPIFY_APP_URL;

    const signature = req.nextUrl.searchParams.get("signature");
    const user_shop = req.nextUrl.searchParams.get("shop");
    console.log("user_shop", user_shop);

    const verifyProxyResponse = await fetch(
      `${apiBase}/api/verification/verifyProxy`,
      {
        method: "POST",
        headers: {
          authorization: authorization ?? "",
          // "ngrok-skip-browser-warning": "1",
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
    const verifiedUserShop = verifyProxyResponseData.user_shop;
    const { client } = await clientProvider.offline.graphqlClient({
      shop: verifiedUserShop ?? "",
    });
    console.log("client", client);
    const response = await client.request(
      `
        query {
          shop {
            name
          }
        }
      `
    );
    console.log("shop graphql response", response.data);
    console.log("api base ", apiBase);

    return NextResponse.json(
      {
        content: "This is coming from shopify proxy route",
        shop: response.data.shop.name,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
