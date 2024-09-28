import RejectedApplications from "@/components/page/rejectedApplications";
import prisma from "@/utils/prisma";

const ApplicationRejected = async () => {
  const rejectedApplications = await prisma.applications.findMany({
    where: {
      application_status: "rejected",
    },
  });
  return <RejectedApplications rejectedApplications={rejectedApplications} />;
};

export default ApplicationRejected;
