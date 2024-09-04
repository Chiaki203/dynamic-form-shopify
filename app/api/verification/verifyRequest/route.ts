import sessionHandler from "@/utils/sessionHandler.mjs";
import shopify from "@/utils/shopify";
import { RequestedTokenType, Session } from "@shopify/shopify-api";
import validateJWT from "../../../../utils/validateJWT.mjs";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const handler = async (req: NextRequest, res: NextResponse) => {
  try {
    const reqHeader = headers();
    // console.log("verify Request reqHeader", reqHeader);
    const authHeader = reqHeader.get("authorization");
    // console.log("verify Request authHeader", authHeader);
    if (!authHeader) {
      console.log("No authorization header found.");
      throw Error("No authorization header found.");
    }

    const payload = validateJWT(authHeader.split(" ")[1]) as { dest: string };
    // console.log("verify Request payload", payload);

    let shop = shopify.utils.sanitizeShop(payload.dest.replace("https://", ""));
    console.log("verify Request shop", shop);
    if (!shop) {
      console.log("No shop found, not a valid request");
      throw Error("No shop found, not a valid request");
    }

    // const sessionId = await shopify.session.getCurrentId({
    //   isOnline: true,
    //   rawRequest: req,
    //   rawResponse: res,
    // });
    // console.log("verify Request sessionId", sessionId);

    // let session = await sessionHandler.loadSession(sessionId!);
    // if (!session) {
    //   session = await getSession({ shop, authHeader });
    // }

    let session = await getSession({ shop, authHeader });
    // console.log("verify Request session", session);
    const onlineSession = session?.onlineSession;
    const offlineSession = session?.offlineSession;
    console.log("verify Request onlineSession", onlineSession);
    // console.log("verify Request offlineSession", offlineSession);
    if (
      new Date(onlineSession?.expires!) > new Date() &&
      shopify.config.scopes!.equals(onlineSession?.scope)
    ) {
    } else {
      session = await getSession({ shop, authHeader });
    }

    //Add session and shop to the request object so any subsequent routes that use this middleware can access it
    // req.user_session = onlineSession;
    // req.user_shop = onlineSession?.shop!;
    const resHeaders = {
      user_session: JSON.stringify(onlineSession),
      user_shop: onlineSession?.shop!,
    };
    // res.headers.set("user_session", JSON.stringify(onlineSession));
    // res.headers.set("user_shop", onlineSession?.shop!);
    // const setHeaders = headers();
    // console.log("verify Request setHeaders", setHeaders);

    // await next(req, res);

    // return { auth: true };
    return NextResponse.json(
      { onlineSession },
      { status: 200, headers: resHeaders }
    );
    // const response = NextResponse.json({ onlineSession }, { status: 200 });
    // response.headers.set("user_session", JSON.stringify(onlineSession));
    // response.headers.set("user_shop", onlineSession?.shop!);
    // return response;
  } catch (e: any) {
    console.error(
      `---> An error happened at verifyRequest middleware: ${e.message}`
    );
    return NextResponse.json({ error: "Unauthorized call" }, { status: 401 });
    // return { auth: false };
  }
};

async function getSession({
  shop,
  authHeader,
}: {
  shop: string;
  authHeader: string;
}) {
  try {
    const sessionToken = authHeader.split(" ")[1];

    const { session: onlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    });

    sessionHandler.storeSession(onlineSession);

    const { session: offlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OfflineAccessToken,
    });

    sessionHandler.storeSession(offlineSession);
    // console.log("onlineSession", onlineSession);
    // console.log("offlineSession", offlineSession);
    // console.log("onlineSession.id", onlineSession.id);
    // console.log("offlineSession.id", offlineSession.id);

    // return new Session(onlineSession);
    return {
      onlineSession: new Session(onlineSession),
      offlineSession: offlineSession,
    };
  } catch (e: any) {
    console.error(
      `---> Error happened while pulling session from Shopify: ${e.message}`
    );
  }
}

// export default verifyRequest;
export { handler as GET, handler as POST };
