"use client";

import {
  Button,
  Card,
  Layout,
  Page,
  Select,
  TextField,
} from "@shopify/polaris";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditApplication = ({ formFields }: { formFields: any }) => {
  console.log("formFields", formFields);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState(formFields);
  const [canAddField, setCanAddField] = useState(true);

  const fieldTypes = [
    { label: "URL", value: "url" },
    { label: "Text", value: "text" },
    { label: "Number", value: "number" },
    { label: "Dropdown", value: "dropdown" },
  ];
  const formatId = (label: string) => {
    return label.trim().toLowerCase();
  };
  const addField = () => {
    if (!canAddField) return;
    const newField = {
      id: "",
      label: "",
      type: "text",
      value: "",
      options: [],
    };
    setFields((prev: any) => [...prev, newField]);
  };
  const removeField = (id: string) => {
    setFields((prev: any) => prev.filter((field: any) => field.id !== id));
  };
  const saveForm = async () => {
    setIsLoading(true);
    const response = await fetch("/api/apps/application/saveForm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: fields,
      }),
    });
    const data = await response.json();
    setIsLoading(false);
    if (!data.error) {
      console.log(data);
      alert("Form saved successfully!");
    } else {
      alert("Error saving form");
      console.log("Error saving form", data);
    }
  };

  console.log("fields", fields);
  useEffect(() => {
    // setFields(formFields);
    const lastField = fields[fields.length - 1];
    if (
      lastField.label &&
      (lastField.type !== "dropdown" ||
        (lastField.type === "dropdown" && lastField.options.length >= 2))
    ) {
      setCanAddField(true);
    } else {
      setCanAddField(false);
    }
  }, [formFields, fields]);

  return (
    <>
      <Page
        title="Application Fields"
        backAction={{
          content: "Home",
          onAction: () => {
            router.push("/");
          },
        }}
        primaryAction={{
          content: "Save",
          onAction: saveForm,
          loading: isLoading,
        }}
      >
        <Layout>
          <Layout.Section>
            <Card>
              {fields.map((field: any, index: any) => (
                <div key={index}>
                  <div>
                    {index > 0 && <div style={{ marginTop: "10px" }}></div>}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "50%" }}>
                        <TextField
                          label={`Field Label`}
                          value={field.label}
                          autoComplete="off"
                          onChange={(label) => {
                            const id = formatId(label);
                            setFields((prev: any) =>
                              prev.map((f: any) =>
                                f.id === field.id
                                  ? { ...f, label: label, id: id }
                                  : f
                              )
                            );
                          }}
                        />
                      </div>
                      <div style={{ width: "10px" }}></div>
                      <div style={{ width: "50%" }}>
                        <Select
                          label="Field Type"
                          options={fieldTypes}
                          value={field.type}
                          onChange={(value) => {
                            setFields((prev: any) =>
                              prev.map((f: any) =>
                                f.id === field.id ? { ...f, type: value } : f
                              )
                            );
                          }}
                        />
                      </div>
                    </div>
                    {field.type === "dropdown" && (
                      <TextField
                        label="Dropdown Options (comma-separated)"
                        value={field.options.join(",")}
                        autoComplete="off"
                        onChange={(options) =>
                          setFields((prev: any) =>
                            prev.map((f: any) =>
                              f.id === field.id
                                ? { ...f, options: options.split(",") }
                                : f
                            )
                          )
                        }
                      />
                    )}
                  </div>
                  {index > 1 && (
                    <div style={{ marginTop: "5px" }}>
                      <Button
                        variant="primary"
                        tone="critical"
                        onClick={() => removeField(field.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <br />
              <Button
                variant="primary"
                fullWidth
                onClick={addField}
                disabled={false}
              >
                Add Field
              </Button>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default EditApplication;
