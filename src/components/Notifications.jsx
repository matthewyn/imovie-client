import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
  Divider,
  Card,
  CardBody,
  Badge,
} from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineBell, HiCheckBadge, HiMiniXCircle } from "react-icons/hi2";
import { generateApiOrigin } from "../utils/apiOrigin";
import { useEffect, useState } from "react";
import { getAuthHeader, saveToken } from "../utils/token";
import axios from "axios";

const badgeMapping = {
  "order-created": <HiCheckBadge size={24} className="text-green-500" />,
  "order-cancelled": <HiMiniXCircle size={24} className="text-red-500" />,
};

const urlFetch = generateApiOrigin("/api/notifications");

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const len = notifications.length;

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(urlFetch, {
          headers: getAuthHeader(),
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching notifications:", error.response?.data);
          console.error("Error status:", error.response?.status);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Dropdown placement="bottom-end" className="w-80">
      <DropdownTrigger>
        <Button isIconOnly aria-label="Notifications" variant="light">
          {len == 0 ? (
            <HiOutlineBell size={24} />
          ) : (
            <Badge color="secondary" content={notifications.length}>
              <HiOutlineBell size={24} />
            </Badge>
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Notifications"
        variant="flat"
        className="max-h-96 overflow-y-auto"
      >
        <DropdownItem
          key="header-notifications"
          className="h-14 gap-2 cursor-auto"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-lg">Notifications</h4>
            <button className="cursor-pointer text-primary">Clear All</button>
          </div>
          <Divider className="mt-2" />
        </DropdownItem>
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <DropdownItem key={`skeleton-notif-${i}`} className="gap-2">
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-32 h-4 rounded-lg" />
                  <Skeleton className="w-48 h-3 rounded-lg" />
                </div>
              </DropdownItem>
            ))
        ) : len == 0 ? (
          <DropdownItem key="no-notifications" className="gap-2">
            <p className="text-sm text-muted">No notifications to display.</p>
          </DropdownItem>
        ) : (
          notifications.map((notif) => (
            <DropdownItem key={notif.id} className="gap-2">
              <Link to={notif.link} className="w-full">
                <Card>
                  <CardBody>
                    <div className="flex gap-2">
                      {badgeMapping[notif.type]}
                      <div className="flex-1">
                        <h4 className="font-bold">{notif.title}</h4>
                        <p className="text-sm text-muted">
                          {notif.description}
                        </p>
                        <small className="text-xs text-muted text-gray-500">
                          {new Date(notif.createdAt).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </DropdownItem>
          ))
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

export default Notifications;
