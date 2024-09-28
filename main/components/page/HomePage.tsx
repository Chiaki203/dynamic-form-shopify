"use client";

import {
  BlockStack,
  Button,
  Card,
  InlineStack,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  return (
    <>
      <Page title="Home">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Edit Form
                </Text>
                <Text as="p" variant="bodyMd">
                  Edit the form that's being served to the end users
                </Text>
                <InlineStack align="end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      router.push("/applications/edit");
                    }}
                  >
                    Edit
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Form Submissions
                </Text>
                <Text as="p" variant="bodyMd">
                  View what the customers have submitted in form content
                </Text>
                <InlineStack align="end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      router.push("/applications");
                    }}
                  >
                    View Form Submissions
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default HomePage;
