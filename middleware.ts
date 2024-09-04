// import { stackMiddlewares } from "@/middlewares/stackHandlers";
// import { verifyRequest } from "@/middlewares/verifyRequest";
// import { main } from "@/middlewares/main";

// const middlewares = [main, verifyRequest];

// export const middleware = stackMiddlewares(middlewares);

/**
 * Middleware to add Content Security Policy headers to matched requests.
 */

import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Exceptions:
     * /api/auth, /api/webhooks, /api/proxy_route, /api/gdpr, /_next,
     * /_proxy, /_auth, /_static, /_vercel, /public (/favicon.ico, etc)
     */
    "/((?!api/auth|api/webhooks|api/proxy_route|api/gdpr|_next|_proxy|_auth|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

/**
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} The response object with modified headers.
 */
export default function middleware(request: NextRequest) {
  // const {
  //   nextUrl: { search },
  // } = request;
  // console.log("middleware request", request);
  // console.log("nextUrl", request.nextUrl);
  const shopUrl = request.nextUrl.searchParams.get("shop");
  console.log("shopUrl", shopUrl);

  const reqHeaders = new Headers(request.headers);

  // console.log("middleware reqHeaders", reqHeaders);

  // const urlSearchParams = new URLSearchParams(search);
  // console.log("middleware urlSearchParams", urlSearchParams);
  // const params = Object.fromEntries(urlSearchParams.entries());

  // console.log("middleware params", params);

  const shop = shopUrl || "*.myshopify.com";

  reqHeaders.set(
    "Content-Security-Policy",
    `frame-ancestors https://${shop} https://admin.shopify.com;`
  );
  reqHeaders.set("x-shopify-shop-domain", shop);

  console.log("headers set shop", shop);
  return NextResponse.next({
    headers: reqHeaders,
    request: {
      headers: reqHeaders,
    },
  });
  // const res = NextResponse.next();
  // res.headers.set(
  //   "Content-Security-Policy",
  //   `frame-ancestors https://${shop} https://admin.shopify.com;`
  // );

  // console.log("res headers set policy", res.headers);
  // return res;
}
