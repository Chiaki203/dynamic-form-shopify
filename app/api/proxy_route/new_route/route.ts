import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const headersData = headers();
    const host = headersData.get("host");
    const authorization = headersData.get("authorization");
    const protocol =
      (headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost"))
        ? "http"
        : "https";
    const apiBase = `${protocol}://${host}`;
    const signature = req.nextUrl.searchParams.get("signature");
    const user_shop = req.nextUrl.searchParams.get("shop");
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
    const { signatureVerified } = await verifyProxyResponse.json();
    console.log("signatureVerified", signatureVerified);
    return NextResponse.json(
      { content: "This is coming from new route" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized call" }, { status: 401 });
  }
}
