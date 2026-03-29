import { useEffect } from "react";
import { initializeFCM } from "../utils/fcmClient";
import toast from "react-hot-toast";

/**
 * Custom hook to initialize FCM in React components
 * @param {Function} onMessageReceived - Optional callback when message is received
 */
export function useFCM(onMessageReceived) {
  useEffect(() => {
    const initFCM = async () => {
      try {
        const handleMessage = (payload) => {
          console.log("Message received:", payload);

          // Show toast notification
          if (payload.notification) {
            toast.success(
              `${payload.notification.title}: ${payload.notification.body}`,
            );
          }

          // Call custom handler if provided
          if (onMessageReceived && typeof onMessageReceived === "function") {
            onMessageReceived(payload);
          }
        };

        await initializeFCM(handleMessage);
      } catch (error) {
        console.error("Failed to initialize FCM:", error);
      }
    };

    initFCM();
  }, [onMessageReceived]);
}
