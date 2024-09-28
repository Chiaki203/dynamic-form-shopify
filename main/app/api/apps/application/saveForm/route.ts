import prisma from "@/utils/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const headersData = headers();
  const host = headersData.get("host");

  const authorization = headersData.get("authorization");
  // console.log("activeWebhooks authorization", authorization);
  console.log("activeWebhooks host", host);
  // console.log("activeWebhooks req.user_session", req.user_session);
  const protocol =
    (headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost"))
      ? "http"
      : "https";
  // const apiBase = `${protocol}://${host}`;
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
  // console.log("activeWebhooks resHeaders", resHeaders);
  console.log("api application saveForm resData", resData);
  const userShop = resHeaders.get("user_shop");
  console.log("api application saveForm userShop", userShop);
  const userSession = JSON.parse(resHeaders.get("user_session") ?? "{}");
  console.log("api application saveForm userSession", userSession);
  try {
    const { fields } = await req.json();
    console.log("saveForm api fields", fields);
    const formId = await prisma.applicationForm.findMany({});
    console.log("saveForm api formId", formId);
    const form = await prisma.applicationForm.upsert({
      where: { id: formId[0]?.id ?? "form_id" },
      update: {
        fields: JSON.stringify(fields),
      },
      create: {
        fields: JSON.stringify(fields),
      },
    });
    console.log("saveForm api form", form);
    return NextResponse.json({ form, success: true, status: 200 });
  } catch (error) {
    console.log("saveForm api error", error);
    return NextResponse.json({ success: false, error: error, status: 401 });
  }
}
