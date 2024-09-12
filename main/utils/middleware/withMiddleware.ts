import { label } from "next-api-middleware";
import verifyHmac from "./verifyHmac.mjs";
import verifyProxy from "./verifyProxy.mjs";
import verifyRequest from "./verifyRequest";

const withMiddleware = label({
  verifyRequest: verifyRequest,
  verifyProxy: verifyProxy,
  verifyHmac: verifyHmac,
});

export default withMiddleware;
