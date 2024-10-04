"use client";

import { applications } from "@prisma/client";
import {
  Button,
  Card,
  EmptyState,
  IndexTable,
  Layout,
  LegacyCard,
  Modal,
  Page,
  Text,
  useIndexResourceState,
} from "@shopify/polaris";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
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
  const resourceName = {
    singular: "application",
    plural: "applications",
  };
  const { selectedResources, handleSelectionChange } = useIndexResourceState(
    pending || []
  );
  console.log("pendingApplications", pending);
  console.log("pendingApplications selectedResources", selectedResources);
  const updateApplications = async () => {
    const response = await (
      await fetch("/api/apps/application/fetch/pending")
    ).json();
    console.log("updateApplications response", response);
    setPending(response);
  };
  const handleModalOpen = (application: applications) => {
    setCurrentApplication(application);
    setActive(true);
  };
  console.log("currentApplication", currentApplication);
  const handleModalClose = useCallback(() => {
    setActive(false);
    setCurrentApplication(null);
  }, []);
  const rowMarkup =
    pending.length !== 0 &&
    pending.map((values, index) => (
      // <>
      <IndexTable.Row
        id={values.id}
        key={values.id}
        selected={selectedResources.includes(values.id)}
        position={index}
      >
        <IndexTable.Cell>{values.name}</IndexTable.Cell>
        <IndexTable.Cell>{values.email}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button onClick={() => handleModalOpen(values)} variant="primary">
            View
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
      // </>
    ));

  const modalMarkup = currentApplication && (
    <Modal
      open={active}
      onClose={handleModalClose}
      title={`${currentApplication.name}'s Application`}
      primaryAction={{
        content: "Approve",
        loading: isLoading,
        onAction: async () => {
          setIsLoading(true);
          const response = await fetch(
            "/api/apps/application/actions/approve",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...currentApplication,
              }),
            }
          );
          setIsLoading(false);
          if (response.ok) {
            handleModalClose();
            updateApplications();
          } else {
            alert("There was an error approving this user");
          }
        },
      }}
      secondaryActions={[
        {
          content: "Reject",
          loading: rejectLoading,
          onAction: async () => {
            setRejectLoading(true);
            const response = await fetch(
              "/api/apps/application/actions/reject",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...currentApplication,
                }),
              }
            );
            setRejectLoading(false);
            if (response.ok) {
              handleModalClose();
              updateApplications();
            } else {
              alert("There was an error rejecting this user");
            }
          },
        },
      ]}
    >
      <Modal.Section>
        <Text as="h3" variant="headingMd">
          <Text as="p" variant="headingMd" fontWeight="bold">
            Name: {currentApplication.name}
          </Text>
          <Text as="p" variant="bodyMd" fontWeight="regular">
            Email: {currentApplication.email}
          </Text>
          {currentApplication.fields &&
            Object.entries(currentApplication.fields).map(([key, value]) => (
              <Text key={key} as="p" variant="bodyMd">
                {`${key}: ${value}`}
              </Text>
            ))}
        </Text>
      </Modal.Section>
    </Modal>
  );

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
          {pending.length !== 0 ? (
            <>
              <Layout.Section>
                <LegacyCard>
                  <IndexTable
                    resourceName={resourceName}
                    itemCount={pending.length}
                    selectedItemsCount={selectedResources.length}
                    onSelectionChange={handleSelectionChange}
                    selectable={false}
                    headings={[
                      { title: "Name" },
                      { title: "Email" },
                      { title: "" },
                    ]}
                  >
                    {rowMarkup}
                  </IndexTable>
                  {modalMarkup}
                </LegacyCard>
              </Layout.Section>
            </>
          ) : (
            <NoApplication />
          )}
        </Layout>
      </Page>
    </>
  );
};

export default PendingPage;
