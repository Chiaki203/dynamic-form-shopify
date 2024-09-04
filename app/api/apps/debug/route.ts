//This is the same as `pages/api/index.js`.

// import withMiddleware from "@/utils/middleware/withMiddleware.js";

import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
// import verifyRequest from "@/app/api/verification/verifyRequest";

export async function GET(request: NextRequest, response: NextResponse) {
  console.log("GET /api/apps");
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
  return NextResponse.json(
    { message: "This text is coming from `/api/apps route`" },
    { status: 200 }
  );
}

export async function POST(request: NextRequest, response: NextResponse) {
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
  return NextResponse.json(request.body, { status: 200 });
}

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
// const handler = async (req, res) => {
//   if (req.method === "GET") {
//     return res
//       .status(200)
//       .send({ text: "This text is coming from `/api/apps route`" });
//   }

//   if (req.method === "POST") {
//     return res.status(200).send(req.body);
//   }

//   return res.status(400).send({ text: "Bad request" });
// };

// export default withMiddleware("verifyRequest")(handler);
