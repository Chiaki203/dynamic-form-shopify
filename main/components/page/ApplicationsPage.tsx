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

const ApplicationPage = ({ pending }: { pending: number }) => {
  const router = useRouter();
  return (
    <>
      <Page
        title="Wholesale Applications"
        backAction={{
          onAction: () => {
            router.push("/");
          },
        }}
      >
        <Layout>
          <Layout.Section variant="fullWidth">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  {`Pending Applications (${pending})`}
                </Text>
                <Text as="p">
                  New applications that are waiting to be reviewed.
                </Text>
                <InlineStack align="end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      router.push("/applications/pending");
                    }}
                  >
                    View
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Approved Applications
                </Text>
                <Text as="p">A list of approved applications</Text>
                <InlineStack align="end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      router.push("/applications/approved");
                    }}
                  >
                    Approved Applications
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Rejected Applications
                </Text>
                <Text as="p">A list of rejected applications</Text>
                <InlineStack align="end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      router.push("/applications/rejected");
                    }}
                  >
                    Rejected Applications
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

export default ApplicationPage;
