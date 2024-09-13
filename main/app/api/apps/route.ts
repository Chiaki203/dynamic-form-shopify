import clientProvider from "@/utils/clientProvider.mjs";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
// import verifyRequest from "@/app/api/verification/verifyRequest";

export async function GET(req: NextRequest, res: NextResponse) {
  console.log("GET /api/apps");
  const headersData = headers();
  const host = headersData.get("host");
  const authorization = headersData.get("authorization");
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
  try {
    const { client } = await clientProvider.online.graphqlClient({
      req,
      res,
      session: resData.onlineSession,
    });
    const response = await client.request(
      `
        mutation UpdateProduct {
          productUpdate(
            input: {id: "gid://shopify/Product/9435930099976", title: "Graphql Snowboard new liquid!"}
          ) {
            product {
              description
              id
              title
            }
            userErrors {
              field
              message
            }
          }
        }
      `
    );
    console.dir(response, { depth: null });
    return NextResponse.json({ data: response }, { status: 200 });
  } catch (e: any) {
    console.error(e.message);
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

// export async function POST(request: NextRequest, response: NextResponse) {
//   const body = await request.json();
//   console.log("request body", body);
//   const headersData = headers();
//   const host = headersData.get("host");
//   const authorization = headersData.get("authorization");
//   const protocol =
//     (headersData.get("x-forwarded-proto") ?? host?.startsWith("localhost"))
//       ? "http"
//       : "https";
//   const apiBase = `${protocol}://${host}`;
//   const verifyRequestResponse = await fetch(
//     `${apiBase}/api/verification/verifyRequest`,
//     {
//       headers: {
//         authorization: authorization ?? "",
//       },
//     }
//   );
//   return NextResponse.json({ text: body.content }, { status: 200 });
// }

// import withMiddleware from "@/utils/middleware/withMiddleware";
// import prisma from "@/utils/prisma.js";
// import { NextApiRequest, NextApiResponse } from "next";

// /**
//  * @param {import("next").NextApiRequest} req - The HTTP request object.
//  * @param {import("next").NextApiResponse} res - The HTTP response object.
//  */
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === "GET") {
//     return res
//       .status(200)
//       .send({ text: "This text is coming from `/api/apps route`" });
//   }

//   if (req.method === "POST") {
//     return res.status(200).send({ text: req.body.content });
//   }

//   return res.status(400).send({ text: "Bad request" });
// };

// // export default withMiddleware("verifyRequest")(handler);

// export default handler;
