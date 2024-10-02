import prisma from "../prisma";
import { RequestedTokenType } from "@shopify/shopify-api";
import sessionHandler from "../sessionHandler.mjs";
import shopify from "../shopify";
import freshInstall from "../freshInstall";
import { registerWebhooks } from "../register-webhooks";

const isShopAvailable = async (context: any) => {
  try {
    console.log("initial load context", context);
    const shop = context.searchParams.shop;
    const idToken = context.searchParams.id_token as string;

    //Initial Load
    if (idToken && shop) {
      const { session: offlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop: shop as string,
        requestedTokenType: RequestedTokenType.OfflineAccessToken,
      });

      const { session: onlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop: shop as string,
        requestedTokenType: RequestedTokenType.OnlineAccessToken,
      });

      await sessionHandler.storeSession(offlineSession);
      await sessionHandler.storeSession(onlineSession);

      const isFreshInstall = await prisma.stores.findFirst({
        where: {
          shop: onlineSession.shop,
        },
      });

      if (!isFreshInstall || isFreshInstall?.isActive === false) {
        // !isFreshInstall -> New Install
        // isFreshInstall?.isActive === false -> Reinstall
        await freshInstall({ shop: onlineSession.shop });
      }
      await registerWebhooks(onlineSession);
    } else {
      // The user has visited the page again.
      // We know this because we're not preserving any url params and idToken doesn't exist here
    }
    return {
      props: {
        data: "ok",
      },
    };
  } catch (e: any) {
    // if (e.message.startsWith("InvalidJwtError")) {
    if (e.message.includes("InvalidJwtError")) {
      console.error(
        "JWT Error - happens in dev mode and can be safely ignored, even in prod."
      );
    } else {
      console.error(`---> An error occured at isInitialLoad: ${e.message}`, e);
      return {
        props: {
          serverError: true,
        },
      };
    }
    return {
      props: {
        data: "ok",
      },
    };
  }

  // const shop = context.searchParams.shop;
  // console.log("isShopAvailable shop", shop);
  // if (shop) {
  //   const isShopAvailable = await prisma.stores.findUnique({
  //     where: { shop: shop },
  //   });
  //   if (!isShopAvailable || !isShopAvailable?.isActive) {
  //     return {
  //       redirect: {
  //         destination: `${process.env.NEXT_PUBLIC_SHOPIFY_APP_URL}/api/auth?shop=${shop}`,
  //         permanent: false,
  //       },
  //     };
  //   }
  //   return {
  //     props: {
  //       user_shop: context.searchParams.shop,
  //     },
  //   };
  // }
  // return { props: { data: "ok" } };
};
export default isShopAvailable;

// const isInitialLoad = async (context: any) => {
//   try {
//     console.log("initial load context", context);
//     const shop = context.searchParams.shop;
//     const idToken = context.searchParams.id_token as string;

//     //Initial Load
//     if (idToken && shop) {
//       const { session: offlineSession } = await shopify.auth.tokenExchange({
//         sessionToken: idToken,
//         shop: shop as string,
//         requestedTokenType: RequestedTokenType.OfflineAccessToken,
//       });

//       const { session: onlineSession } = await shopify.auth.tokenExchange({
//         sessionToken: idToken,
//         shop: shop as string,
//         requestedTokenType: RequestedTokenType.OnlineAccessToken,
//       });

//       await sessionHandler.storeSession(offlineSession);
//       await sessionHandler.storeSession(onlineSession);

//       const isFreshInstall = await prisma.stores.findFirst({
//         where: {
//           shop: onlineSession.shop,
//         },
//       });

//       if (!isFreshInstall || isFreshInstall?.isActive === false) {
//         // !isFreshInstall -> New Install
//         // isFreshInstall?.isActive === false -> Reinstall
//         await freshInstall({ shop: onlineSession.shop });
//       }
//       await registerWebhooks(onlineSession);
//     } else {
//       // The user has visited the page again.
//       // We know this because we're not preserving any url params and idToken doesn't exist here
//     }
//     return {
//       props: {
//         data: "ok",
//       },
//     };
//   } catch (e: any) {
//     // if (e.message.startsWith("InvalidJwtError")) {
//     if (
//       e.message.includes("InvalidJwtError") ||
//       e.includes("InvalidJwtError")
//     ) {
//       console.error(
//         "JWT Error - happens in dev mode and can be safely ignored, even in prod."
//       );
//     } else {
//       console.error(`---> An error occured at isInitialLoad: ${e.message}`, e);
//       return {
//         props: {
//           serverError: true,
//         },
//       };
//     }
//     return {
//       props: {
//         data: "ok",
//       },
//     };
//   }
// };

// export default isInitialLoad;
