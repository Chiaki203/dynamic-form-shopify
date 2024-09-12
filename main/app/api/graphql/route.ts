import shopify from "@/utils/shopify";
import sessionHandler from "@/utils/sessionHandler.mjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });
    const session = await sessionHandler.loadSession(sessionId!);
    const response = await shopify.clients.graphqlProxy({
      session: session!,
      rawBody: req.body,
    });

    // res.status(200).send(response.body);
    return NextResponse.json(response.body, { status: 200 });
  } catch (e) {
    console.error("An error occured at /api/graphql", e);
    return NextResponse.json(e, { status: 403 });
    // return res.status(403).send(e);
  }
}

// import withMiddleware from "@/utils/middleware/withMiddleware.js";
// import shopify from "@/utils/shopify.js";
// import sessionHandler from "@/utils/sessionHandler.js";

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
// const handler = async (req, res) => {
//   //Reject anything that's not a POST
//   if (req.method !== "POST") {
//     return res.status(400).send({ text: "We don't do that here." });
//   }

//   try {
//     const sessionId = await shopify.session.getCurrentId({
//       isOnline: true,
//       rawRequest: req,
//       rawResponse: res,
//     });
//     const session = await sessionHandler.loadSession(sessionId);
//     const response = await shopify.clients.graphqlProxy({
//       session,
//       rawBody: req.body,
//     });

//     res.status(200).send(response.body);
//   } catch (e) {
//     console.error("An error occured at /api/graphql", e);
//     return res.status(403).send(e);
//   }
// };

// withMiddleware("verifyRequest")(handler);
