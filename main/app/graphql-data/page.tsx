"use client";

import { useEffect } from "react";

const GraphqlData = () => {
  const fetchGraphQLData = async () => {
    const response = await (await fetch("/api/apps")).json();
    console.log("fetchGraphqlData response", response);
  };
  useEffect(() => {
    fetchGraphQLData();
  }, []);
  return <div>Graphql Data</div>;
};

export default GraphqlData;
