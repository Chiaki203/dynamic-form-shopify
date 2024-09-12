/**
 * Middleware to add Content Security Policy headers to matched requests.
 */

import { NextRequest, NextResponse, NextFetchEvent } from "next/server";
import { MiddlewareFactory } from "./stackHandlers";

export const main: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const {
      nextUrl: { search },
    } = request;
    // console.log("middleware request", request);
    // console.log("nextUrl", request.nextUrl);
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const shop = params.shop || "*.myshopify.com";

    const res = NextResponse.next();
    console.log("headers set shop");
    res.headers.set(
      "Content-Security-Policy",
      `frame-ancestors https://${shop} https://admin.shopify.com;`
    );

    console.log("res headers set policy", res.headers);
    return next(request, _next);
  };
};
