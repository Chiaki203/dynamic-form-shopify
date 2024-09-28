import PendingPage from "@/components/page/PendingApplications";
import prisma from "@/utils/prisma";

const ApplicationsPending = async () => {
  const pendingApplications = await prisma.applications.findMany({
    where: {
      application_status: "pending",
    },
  });
  return (
    <>
      <PendingPage pendingApplications={pendingApplications} />
    </>
  );
};

export default ApplicationsPending;
