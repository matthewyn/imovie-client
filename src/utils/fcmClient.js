import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";

/**
 * Request user permission for notifications and get FCM token
 * @returns {Promise<string|null>} FCM token or null if permission denied
 */
export async function requestNotificationPermission() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Workers not supported");
    return null;
  }

  try {
    // Check if permission is already granted
    const permission = Notification.permission;

    if (permission === "granted") {
      return await getFCMToken();
    }

    if (permission === "denied") {
      console.log("Notification permission denied");
      return null;
    }

    // Request permission (permission === 'default')
    const result = await Notification.requestPermission();

    if (result === "granted") {
      return await getFCMToken();
    } else {
      console.log("Notification permission not granted");
      return null;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
}

/**
 * Get FCM token for this device
 * @returns {Promise<string|null>} FCM token or null
 */
export async function getFCMToken() {
  try {
    if (!("serviceWorker" in navigator)) {
      console.log("Service Workers not supported");
      return null;
    }

    // Register service worker if not already registered
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js",
      {
        scope: "/",
      },
    );

    const token = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token) {
      // Store token locally
      localStorage.setItem("FCM_TOKEN", token);
      return token;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }

  return null;
}

/**
 * Get stored FCM token from localStorage
 * @returns {string|null} Stored FCM token or null
 */
export function getStoredToken() {
  return localStorage.getItem("FCM_TOKEN");
}

/**
 * Clear stored FCM token
 */
export function clearStoredToken() {
  localStorage.removeItem("FCM_TOKEN");
}

/**
 * Listen for foreground messages
 * @param {Function} callback - Function to call when message received
 * @returns {Function} Unsubscribe function
 */
export function listenForForegroundMessages(callback) {
  try {
    return onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);

      // Show notification while app is in foreground
      if (payload.notification) {
        const { title, body } = payload.notification;
        const notification = new Notification(title || "iMovie Notification", {
          body: body || "",
          icon: "/vite.svg",
          badge: "/vite.svg",
          data: payload.data || {},
        });

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          if (payload.data?.url) {
            window.location.href = payload.data.url;
          }
        };
      }

      // Call the callback with payload
      if (callback && typeof callback === "function") {
        callback(payload);
      }
    });
  } catch (error) {
    console.error("Error listening for foreground messages:", error);
  }
}

/**
 * Initialize FCM - request permissions and set up listeners
 * @param {Function} onMessageCallback - Optional callback for messages
 */
export async function initializeFCM(onMessageCallback) {
  try {
    // Request notification permission and get token
    const token = await requestNotificationPermission();

    if (token) {
      console.log("FCM Token:", token);
      // You can send this token to your backend to store it
      // for sending targeted notifications
    } else {
      console.log("Failed to get FCM token");
    }

    // Listen for messages while app is in foreground
    if (onMessageCallback) {
      listenForForegroundMessages(onMessageCallback);
    } else {
      listenForForegroundMessages((payload) => {
        console.log("Message payload:", payload);
      });
    }
  } catch (error) {
    console.error("Error initializing FCM:", error);
  }
}
