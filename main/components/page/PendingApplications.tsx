"use client";

import { applications } from "@prisma/client";
import { Card, EmptyState, Layout, Page } from "@shopify/polaris";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NoApplication from "./NoApplication";

const PendingPage = ({
  pendingApplications,
}: {
  pendingApplications: applications[];
}) => {
  const [pending, setPending] = useState(pendingApplications);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [currentApplication, setCurrentApplication] =
    useState<applications | null>(null);

  return (
    <>
      <Page
        title="Pending Applications"
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

export default PendingPage;
