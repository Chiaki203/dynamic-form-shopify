// "use client";

import isInitialLoad from "@/utils/middleware/isInitialLoad";
import HomePage from "@/components/page/HomePage";

const Home = async (context: any) => {
  console.log("context", context);
  const initialLoad = await isInitialLoad(context);
  console.log("page initialLoad", initialLoad);
  return <HomePage />;
};

export default Home;
