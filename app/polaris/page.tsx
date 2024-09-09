"use client";

import {
  BlockStack,
  Card,
  Icon,
  InlineStack,
  Layout,
  Page,
} from "@shopify/polaris";
import { AppsIcon } from "@shopify/polaris-icons";
import { useRouter } from "next/navigation";
import React from "react";

const PolarisPage = () => {
  const router = useRouter();
  return (
    <>
      <Page
        title="Polaris Learning Page"
        subtitle="This is where we learn Polaris"
        backAction={{
          content: "Back",
          onAction: () => {
            router.push("/");
          },
        }}
        primaryAction={{
          content: "Primary",
          onAction: () => {
            alert("button clicked");
          },
        }}
      >
        <Layout>
          <Layout.Section variant="oneHalf">
            {/* <BlockStack gap="400"> */}
            <InlineStack gap="200" wrap={false}>
              <Card>
                <InlineStack gap="200" wrap={false}>
                  <Icon source={AppsIcon} tone="base" />
                  <p>This is some content for the card</p>
                </InlineStack>
              </Card>
              <Card>
                <p>This is some content for the card</p>
              </Card>
              <Card>
                <p>This is some content for the card</p>
              </Card>
            </InlineStack>
            {/* </BlockStack> */}
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <BlockStack gap="400">
              <Card>
                <p>This is some content for the card</p>
              </Card>
              <Card>
                <p>This is some content for the card</p>
              </Card>
              <Card>
                <p>This is some content for the card</p>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default PolarisPage;
