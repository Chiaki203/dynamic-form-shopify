/**
 *
 * Do not remove the Prisma query that upserts the shop to `true`.
 *
 */
import prisma from "./prisma";

/**
 * @async
 * @function freshInstall
 * @param {Object} params - The function parameters container.
 * @param {string} params.shop - The shop URL in the format '*.myshopify.com'.
 */
const freshInstall = async ({ shop }: { shop: string }) => {
  try {
    console.log("This is a fresh install, running onboarding functions");

    await prisma.stores.upsert({
      where: {
        shop: shop,
      },
      update: {
        shop: shop,
        isActive: true,
      },
      create: {
        shop: shop,
        isActive: true,
      },
    });

    //Other functions start here
  } catch (e: any) {
    console.error(
      `---> An error occured in freshInstall function: ${e.message}`,
      e
    );
  }
};

export default freshInstall;
