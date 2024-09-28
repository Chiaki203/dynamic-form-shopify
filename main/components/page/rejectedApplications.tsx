"use client";

import { applications } from "@prisma/client";
import { Layout, Page } from "@shopify/polaris";
import { useRouter } from "next/navigation";
import NoApplication from "./NoApplication";

const RejectedApplications = ({
  rejectedApplications,
}: {
  rejectedApplications: applications[];
}) => {
  const router = useRouter();
  return (
    <>
      <Page
        title="Rejected Applications"
        backAction={{
          content: "Applications",
          onAction: () => router.push("/applications"),
        }}
      >
        <Layout>
          <NoApplication />
        </Layout>
      </Page>
    </>
  );
};

export default RejectedApplications;
