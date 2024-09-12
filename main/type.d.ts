import {
  Shopify,
  WebhookValidation,
  WebhookValidationInvalid,
} from "@shopify/shopify-api";

import { NextRequest } from "next/server";

// import { NextApiRequest } from "next";

declare module "@shopify/shopify-api" {
  interface Shopify {
    user: {
      webhooks: Array<{
        topics: string[];
        url: string;
        callback: Function;
        filter?: string;
        include_fields?: string[];
      }>;
    };
  }
  interface WebhookValidation {
    topic: string;
  }
  interface WebhookValidationInvalid {
    topic: string;
  }
}

declare module "next/server" {
  interface NextRequest {
    user_session: any;
    user_shop: string;
    body: any;
    query: any;
  }
}

// declare module "next" {
//   interface NextApiRequest {
//     user_session: any;
//     user_shop: string;
//   }
// }
