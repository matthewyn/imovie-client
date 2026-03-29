import { useState, useEffect } from "react";
import { Button, Card, Input, Textarea } from "@heroui/react";
import toast from "react-hot-toast";
import {
  requestNotificationPermission,
  getStoredToken,
  getFCMToken,
} from "../utils/fcmClient";
import axios from "axios";
import { generateApiOrigin } from "../utils/apiOrigin";

export default function NotificationTestPanel() {
  const [fcmToken, setFcmToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("Test Notification");
  const [body, setBody] = useState("This is a test push notification");
  const [customData, setCustomData] = useState('{"type":"test"}');

  // Get initial token
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setFcmToken(token);
    }
  }, []);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      const token = await requestNotificationPermission();
      if (token) {
        setFcmToken(token);
        toast.success("Permission granted! Token obtained.");
      } else {
        toast.error("Permission denied or token not obtained");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error requesting permission");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    setIsLoading(true);
    try {
      const token = await getFCMToken();
      if (token) {
        setFcmToken(token);
        toast.success("Token refreshed!");
      } else {
        toast.error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error refreshing token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      toast.success("Token copied to clipboard!");
    }
  };

  const handleSendTestNotification = async () => {
    if (!fcmToken) {
      toast.error("No FCM token available. Request permission first.");
      return;
    }

    setIsLoading(true);
    try {
      let parsedData = {};
      try {
        parsedData = JSON.parse(customData);
      } catch (e) {
        console.warn("Invalid JSON for custom data, using empty object");
      }

      const response = await axios.post(
        generateApiOrigin("/api/notifications/test"),
        {
          token: fcmToken,
          title,
          body,
          data: parsedData,
        },
      );

      if (response.data.success) {
        toast.success("Test notification sent!");
      } else {
        toast.error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast.error(
        error.response?.data?.message || "Error sending notification",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 m-4 bg-gray-900 border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-white">
        🔔 Notification Test Panel
      </h2>

      {/* Token Section */}
      <div className="mb-6 pb-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold mb-3 text-gray-200">
          Your FCM Token
        </h3>
        <div className="flex gap-2 mb-3">
          <Input
            isReadOnly
            type="password"
            label="FCM Token"
            value={fcmToken}
            placeholder="No token yet"
            className="flex-1"
          />
          <Button
            isIconOnly
            onClick={handleCopyToken}
            disabled={!fcmToken}
            className="mt-2"
          >
            📋
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRequestPermission}
            isLoading={isLoading}
            color="primary"
            className="flex-1"
          >
            Request Permission
          </Button>
          <Button
            onClick={handleRefreshToken}
            isLoading={isLoading}
            color="secondary"
            className="flex-1"
          >
            Refresh Token
          </Button>
        </div>
      </div>

      {/* Test Notification Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-200">
          Send Test Notification
        </h3>
        <div className="space-y-3 mb-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
          />
          <Textarea
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Notification body"
            rows={3}
          />
          <Textarea
            label="Custom Data (JSON)"
            value={customData}
            onChange={(e) => setCustomData(e.target.value)}
            placeholder='{"type":"test","url":"/path"}'
            rows={2}
          />
        </div>
        <Button
          onClick={handleSendTestNotification}
          isLoading={isLoading}
          disabled={!fcmToken}
          color="success"
          className="w-full"
        >
          Send Test Notification
        </Button>
        <p className="text-xs text-gray-400 mt-2">
          Requires a token first. Keep the app open or in background.
        </p>
      </div>
    </Card>
  );
}
