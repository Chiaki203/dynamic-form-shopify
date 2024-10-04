import clientProvider from "@/utils/clientProvider.mjs";
import prisma from "@/utils/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const headersData = headers();
  const authorization = headersData.get("authorization");
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
  const resHeaders = verifyRequestResponse.headers;
  console.log("api application approve resData", resData);
  const userShop = resHeaders.get("user_shop");
  console.log("api application approve userShop", userShop);
  const userSession = JSON.parse(resHeaders.get("user_session") ?? "{}");
  console.log("api application approve userSession", userSession);
  try {
    const applicationData = await req.json();
    // const { client } = await clientProvider.offline.graphqlClient({
    //   shop: userShop || "",
    // });
    const { client } = await clientProvider.online.graphqlClient({
      req,
      res,
      session: resData.onlineSession,
    });
    await client.request(
      `
        mutation tagsAdd($id: ID!, $tags: [String!]!) {
          tagsAdd(id: $id, tags: $tags) {
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
          id: `gid://shopify/Customer/${applicationData.customer_id}`,
          tags: ["wholesale"],
        },
      }
    );
    await client.request(
      `
        mutation tagsRemove($id:ID!, $tags:[String!]!) {
          tagsRemove(id: $id, tags: $tags) {
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
          id: `gid://shopify/Customer/${applicationData.customer_id}`,
          tags: ["pending"],
        },
      }
    );
    await prisma.applications.update({
      where: { email: applicationData.email },
      data: {
        application_status: "approved",
      },
    });
    return NextResponse.json({ success: true, status: 200 });
  } catch (error) {
    console.log("api application approve error", error);
    return NextResponse.json({ success: false, status: 401 });
  }
}
