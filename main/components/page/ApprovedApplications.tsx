"use client";

import { applications } from "@prisma/client";
import { Layout, Page } from "@shopify/polaris";
import { useRouter } from "next/navigation";
import NoApplication from "./NoApplication";

const ApprovedApplications = ({
  approvedApplications,
}: {
  approvedApplications: applications[];
}) => {
  const router = useRouter();
  return (
    <>
      <Page
        title="Approved Applications"
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

export default ApprovedApplications;
