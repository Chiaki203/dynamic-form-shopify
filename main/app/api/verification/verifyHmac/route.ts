import crypto from "crypto";
import shopify from "@/utils/shopify";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const handler = async (req: NextRequest, res: NextResponse) => {
  try {
    console.log("createHmac req body", req.body);
    const generateHash = crypto
      .createHmac("SHA256", process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET ?? "")
      .update(JSON.stringify(req.body), "utf8")
      .digest("base64");
    const reqHeader = headers();
    console.log("createHmac reqHeader", reqHeader);
    const hmac = reqHeader.get("x-shopify-hmac-sha256");
    // const hmac = req.headers["x-shopify-hmac-sha256"];

    if (shopify.auth.safeCompare(generateHash, hmac!)) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, message: "HMAC verification failed" },
        { status: 401 }
      );
      // return res
      //   .status(401)
      //   .send({ success: false, message: "HMAC verification failed" });
    }
  } catch (e: any) {
    console.log(`---> An error occured while verifying HMAC`, e.message);
    return NextResponse.json(
      { success: false, message: "HMAC verification failed" },
      { status: 401 }
    );
    // return res
    //     .status(401)
    //     .send({ success: false, message: "HMAC verification failed" });
    // return new NextResponse(
    //   JSON.stringify({ success: false, message: "HMAC verification failed" }),
    //   {
    //     status: 401,
    //     headers: {
    //       "content-type": "application/json",
    //     },
    //   }
    // );
  }
};

export { handler as GET, handler as POST };
