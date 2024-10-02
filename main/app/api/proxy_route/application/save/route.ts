import clientProvider from "@/utils/clientProvider.mjs";
import prisma from "@/utils/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
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
    console.log("proxy save user_shop", user_shop);

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
    console.log("proxy save verifyProxyResponseData", verifyProxyResponseData);
    const verifiedUserShop = verifyProxyResponseData.user_shop;
    const applicationData = await req.json();
    console.log("proxy save applicationData", applicationData);
    console.log("proxy save verifiedUserShop", verifiedUserShop);
    const name = applicationData.name;
    const email = applicationData.email;
    const customer_id = applicationData.customer_id;
    delete applicationData.name;
    delete applicationData.email;
    delete applicationData.customer_id;
    const { client } = await clientProvider.offline.graphqlClient({
      shop: verifiedUserShop ?? "",
    });
    console.log("proxy save client", client);
    await client.request(
      `
        mutation tagsAdd($id: ID!, $tags: [String!]!) {
          tagsAdd(id:$id, tags:$tags) {
            node {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        variables: {
          id: `gid://shopify/Customer/${customer_id}`,
          tags: ["pending"],
        },
      }
    );
    await prisma.applications.upsert({
      where: {
        email: email,
      },
      update: {
        name: name,
        email: email,
        customer_id: customer_id,
        fields: applicationData,
      },
      create: {
        name: name,
        email: email,
        customer_id: customer_id,
        fields: applicationData,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.log("proxy save error", e);
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
