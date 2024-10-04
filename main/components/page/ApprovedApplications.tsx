"use client";

import { applications } from "@prisma/client";
import {
  Button,
  Card,
  IndexTable,
  Layout,
  Modal,
  Page,
  Text,
  useIndexResourceState,
} from "@shopify/polaris";
import { useRouter } from "next/navigation";
import NoApplication from "./NoApplication";
import { useCallback, useState } from "react";

const ApprovedApplications = ({
  approvedApplications,
}: {
  approvedApplications: applications[];
}) => {
  const router = useRouter();
  const [approved, setApproved] = useState(approvedApplications);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [currentApplication, setCurrentApplication] =
    useState<applications | null>(null);
  const [active, setActive] = useState(false);
  const resourceName = {
    singular: "application",
    plural: "applications",
  };
  const { selectedResources, handleSelectionChange } = useIndexResourceState(
    approved || []
  );
  const updateApplications = async () => {
    const response = await (
      await fetch("/api/apps/application/fetch/approved")
    ).json();
    console.log("updateApplications approved", response);
    setApproved(response);
  };
  const handleModalOpen = (application: applications) => {
    setCurrentApplication(application);
    setActive(true);
  };
  const handleModalClose = useCallback(() => {
    setActive(false);
    setCurrentApplication(null);
  }, []);
  const rowMarkup =
    approved.length !== 0 &&
    approved.map((values, index) => (
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
    ));
  const modalMarkup = currentApplication && (
    <Modal
      open={active}
      onClose={handleModalClose}
      title={`${currentApplication.name}'s Application`}
      primaryAction={{
        content: "View In Admin",
        onAction: () => {
          open(
            `shopify://admin/customers/${currentApplication.customer_id}`,
            "_blank"
          );
        },
      }}
      secondaryActions={[
        {
          destructive: true,
          outline: true,
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
              alert("There was an error rejecting the application");
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
        title="Approved Applications"
        backAction={{
          content: "Applications",
          onAction: () => router.push("/applications"),
        }}
      >
        <Layout>
          {approved.length !== 0 ? (
            <>
              <Layout.Section>
                <Card padding="0">
                  <IndexTable
                    resourceName={resourceName}
                    itemCount={approved.length}
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

export default ApprovedApplications;
