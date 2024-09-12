"use client";

import {
  BlockStack,
  Card,
  DataTable,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// import { headers } from "next/headers";

const ActiveWebhooks = () => {
  const router = useRouter();
  // const header = headers();
  // console.log("ActiveWebhooks header", header);
  const [rows, setRows] = useState([
    ["Loading", "I haven't implemented swr or react query yet."],
  ]);

  async function fetchWebhooks() {
    const res = await fetch("/api/apps/debug/activeWebhooks");
    const data = await res.json();
    console.log("fetchWebhooks data", data);
    let rowData: any = [];
    Object.entries(data.data.webhookSubscriptions.edges).map(([key, value]) => {
      const topic = (value as any).node.topic;
      const callbackUrl = (value as any).node.endpoint.callbackUrl;
      rowData.push([topic, callbackUrl]);
    });
    setRows(rowData);
  }

  useEffect(() => {
    fetchWebhooks();
  }, []);

  return (
    <>
      <Page
        title="Webhooks"
        backAction={{ content: "Home", onAction: () => router.push("/debug") }}
      >
        <Layout>
          <Layout.Section>
            <Card padding="0">
              <DataTable
                columnContentTypes={["text", "text"]}
                headings={["Topic", "Callback Url"]}
                rows={rows}
              />
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Note
                </Text>
                <Text as="p">
                  Webhooks are registered when the app is installed, or when
                  tokens are refetched by going through the authentication
                  process. If your Callback URL isn't the same as your current
                  URL (happens usually during dev when using ngrok), you need to
                  go through the auth process again.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default ActiveWebhooks;
