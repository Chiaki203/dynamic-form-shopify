import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // console.log("proxy shop req", req);
    const headersData = headers();
    // console.log("proxy fields headersData", headersData);
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
    console.log("proxy fields user_shop", user_shop);

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
    console.log(
      "proxy fields verifyProxyResponseData",
      verifyProxyResponseData
    );
    const applicationForm = await prisma.applicationForm.findFirst();
    const fields = !applicationForm
      ? []
      : JSON.parse(applicationForm?.fields as string);
    return NextResponse.json({ fields }, { status: 200 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: true }, { status: 401 });
  }
}
