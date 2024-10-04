"use client";

import { applications } from "@prisma/client";
import {
  Button,
  IndexTable,
  Layout,
  Card,
  Modal,
  Page,
  Text,
  useIndexResourceState,
} from "@shopify/polaris";
import { useRouter } from "next/navigation";
import NoApplication from "./NoApplication";
import { useCallback, useState } from "react";

const RejectedApplications = ({
  rejectedApplications,
}: {
  rejectedApplications: applications[];
}) => {
  const router = useRouter();
  const [rejected, setRejected] = useState(rejectedApplications);
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [currentApplication, setCurrentApplication] =
    useState<applications | null>(null);
  const resourceName = {
    singular: "application",
    plural: "applications",
  };

  const { selectedResources, handleSelectionChange } =
    useIndexResourceState(rejected);
  async function updateApplications() {
    const response = await (
      await fetch("/api/apps/application/fetch/rejected")
    ).json();
    setRejected(response);
  }

  const handleModalOpen = (application: applications) => {
    setCurrentApplication(application);
    setActive(true);
  };

  const handleModalClose = useCallback(() => {
    setActive(false);
    setCurrentApplication(null);
  }, []);

  const rowMarkup =
    rejected.length !== 0 ? (
      rejected.map((values, index) => (
        <>
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
        </>
      ))
    ) : (
      <></>
    );
  const modalMarkup = currentApplication && (
    <Modal
      open={active}
      onClose={handleModalClose}
      title={`${currentApplication.name}'s Application`}
      primaryAction={{
        content: "View In Admin",
        onAction: async () => {
          open(
            `shopify://admin/customers/${currentApplication.customer_id}`,
            "_blank"
          );
        },
      }}
      secondaryActions={[
        {
          outline: true,
          loading: isLoading,
          content: "Approve",
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
        title="Rejected Applications"
        backAction={{
          content: "Applications",
          onAction: () => router.push("/applications"),
        }}
      >
        <Layout>
          {rejectedApplications.length !== 0 ? (
            <>
              <Layout.Section>
                <Card padding="0">
                  <IndexTable
                    resourceName={resourceName}
                    itemCount={rejected.length}
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
                </Card>
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

export default RejectedApplications;
