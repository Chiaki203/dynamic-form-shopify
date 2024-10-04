import prisma from "@/utils/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
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
  console.log("api application fetch approved resData", resData);
  const userShop = resHeaders.get("user_shop");
  console.log("api application fetch approved userShop", userShop);
  const userSession = JSON.parse(resHeaders.get("user_session") ?? "{}");
  console.log("api application fetch approved userSession", userSession);
  try {
    const applications = await prisma.applications.findMany({
      where: { application_status: "approved" },
    });
    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.log("api application fetch approved error", error);
    return NextResponse.json(
      { error: "Failed to fetch approved applications" },
      { status: 401 }
    );
  }
}
