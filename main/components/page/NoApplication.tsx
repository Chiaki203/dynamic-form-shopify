import {
  BlockStack,
  Box,
  Card,
  EmptyState,
  Layout,
  Text,
} from "@shopify/polaris";
import React from "react";
import { IoSearch } from "react-icons/io5";

const NoApplication = () => {
  return (
    <>
      <Layout.Section>
        <Card>
          <BlockStack gap="200" align="center" inlineAlign="center">
            <Box>
              <IoSearch size={80} color="gray" />
            </Box>
            <Text as="h1" variant="headingLg">
              No applications found
            </Text>
            <Text as="p" variant="bodyMd">
              Try changing the filters or search terms.
            </Text>
          </BlockStack>
        </Card>
      </Layout.Section>
    </>
  );
};

export default NoApplication;
