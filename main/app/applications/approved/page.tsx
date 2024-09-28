import ApprovedApplications from "@/components/page/ApprovedApplications";
import prisma from "@/utils/prisma";

const ApplicationsApproved = async () => {
  const approvedApplications = await prisma.applications.findMany({
    where: {
      application_status: "approved",
    },
  });
  return <ApprovedApplications approvedApplications={approvedApplications} />;
};

export default ApplicationsApproved;
