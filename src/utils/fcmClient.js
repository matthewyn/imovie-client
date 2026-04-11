import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";

export async function requestNotificationPermission() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Workers not supported");
    return null;
  }

  try {
    const permission = Notification.permission;

    if (permission === "granted") {
      return await getFCMToken();
    }

    if (permission === "denied") {
      console.log("Notification permission denied");
      return null;
    }

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

export async function getFCMToken() {
  try {
    if (!("serviceWorker" in navigator)) {
      console.log("Service Workers not supported");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/service-worker.js",
      {
        scope: "/",
        updateViaCache: "none",
      },
    );

    await navigator.serviceWorker.ready;

    registration.update();

    const token = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token) {
      localStorage.setItem("FCM_TOKEN", token);
      return token;
    } else {
      console.error("[FCM] Failed to get token from Firebase");
    }
  } catch (error) {
    console.error("[FCM] Error getting FCM token:", error);
  }

  return null;
}

export function getStoredToken() {
  return localStorage.getItem("FCM_TOKEN");
}

export function clearStoredToken() {
  localStorage.removeItem("FCM_TOKEN");
}

export function listenForForegroundMessages(callback) {
  try {
    return onMessage(messaging, (payload) => {
      if (payload.notification) {
        const { title, body } = payload.notification;
        const notification = new Notification(title || "iMovie Notification", {
          body: body || "",
          icon: "/vite.svg",
          badge: "/vite.svg",
          data: payload.data || {},
        });

        notification.onclick = () => {
          window.focus();
          if (payload.data?.url) {
            window.location.href = payload.data.url;
          }
        };
      }

      if (callback && typeof callback === "function") {
        callback(payload);
      }
    });
  } catch (error) {
    console.error("Error listening for foreground messages:", error);
  }
}

export async function initializeFCM(onMessageCallback) {
  try {
    const token = await requestNotificationPermission();

    if (token) {
    } else {
      console.log("Failed to get FCM token");
    }

    if (onMessageCallback) {
      listenForForegroundMessages(onMessageCallback);
    } else {
      listenForForegroundMessages((payload) => {});
    }
  } catch (error) {
    console.error("Error initializing FCM:", error);
  }
}
