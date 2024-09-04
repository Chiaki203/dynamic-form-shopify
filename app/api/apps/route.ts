import { NextResponse, NextRequest } from "next/server";
// import verifyRequest from "@/app/api/verification/verifyRequest";

export async function GET(request: NextRequest, response: NextResponse) {
  console.log("GET /api/apps");
  // const { auth } = await verifyRequest(request, response);
  // if (!auth) {
  //   return NextResponse.json({ error: "Unauthorized call" }, { status: 401 });
  // }
  return NextResponse.json(
    { message: "This text is coming from `/api/apps route`" },
    { status: 200 }
  );
}

export async function POST(request: NextRequest, response: NextResponse) {
  // const { auth } = await verifyRequest(request, response);
  // if (!auth) {
  //   return NextResponse.json({ error: "Unauthorized call" }, { status: 401 });
  // }
  return NextResponse.json(request.body, { status: 200 });
}

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
