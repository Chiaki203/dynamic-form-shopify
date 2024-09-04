import clientProvider from "@/utils/clientProvider.mjs";
import verifyProxy from "@/app/api/verification/verifyProxy";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { signatureVerified } = await verifyProxy(req, res);
  if (!signatureVerified) {
    return NextResponse.json(
      { success: false, message: "Signature verification failed" },
      { status: 401 }
    );
  }
  const { client } = await clientProvider.offline.graphqlClient({
    shop: req.user_shop,
  });
  return NextResponse.json({ content: "Proxy Be Working" }, { status: 200 });
}

// import withMiddleware from "@/utils/middleware/withMiddleware";
// import { NextApiRequest, NextApiResponse } from "next";

// /**
//  * @param {import("next").NextApiRequest} req - The HTTP request object.
//  * @param {import("next").NextApiResponse} res - The HTTP response object.
//  */
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
// const { client } = await clientProvider.offline.graphqlClient({
//   shop: req.user_shop,
// });

//   return res.status(200).send({ content: "Proxy Be Working" });
// };

// export default withMiddleware("verifyProxy")(handler);
