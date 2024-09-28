import ApplicationPage from "@/components/page/ApplicationsPage";
import prisma from "@/utils/prisma";

const ApplicationHome = async () => {
  const pendingApplicationsCount = await prisma.applications.count({
    where: { application_status: "pending" },
  });
  return <ApplicationPage pending={pendingApplicationsCount} />;
};

export default ApplicationHome;
