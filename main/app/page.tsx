// "use client";

// import isInitialLoad from "@/utils/middleware/isInitialLoad";
import isShopAvailable from "@/utils/middleware/isShopAvailable";
import HomePage from "@/components/page/HomePage";

const Home = async (context: any) => {
  console.log("context", context);
  const initialLoad = await isShopAvailable(context);
  return <HomePage />;
};

export default Home;
