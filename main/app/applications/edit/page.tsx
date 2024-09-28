import EditApplication from "@/components/page/EditApplication";
import prisma from "@/utils/prisma";

const ApplicationEdit = async () => {
  const applicationForm = await prisma.applicationForm.findFirst();
  let fields = [
    { id: "name", label: "Name", value: "", type: "text", options: [] },
    { id: "email", label: "Email", value: "", type: "text", options: [] },
  ];
  if (applicationForm && applicationForm.fields) {
    fields = JSON.parse(applicationForm.fields as string);
  }
  return <EditApplication formFields={fields} />;
};

export default ApplicationEdit;
