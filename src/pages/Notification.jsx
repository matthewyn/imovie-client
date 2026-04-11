import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import NotificationTestPanel from "../components/NotificationTestPanel";

function Profile() {
  return (
    <div className="p-6">
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Account</BreadcrumbItem>
        <BreadcrumbItem>Profile</BreadcrumbItem>
      </Breadcrumbs>
      <NotificationTestPanel />
    </div>
  );
}

export default Profile;
