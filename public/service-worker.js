importScripts(
  "https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js",
);

self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push event received");

  if (!event.data) {
    console.log("[Service Worker] No data in push event");
    return;
  }

  try {
    const data = event.data.json();
    console.log("[Service Worker] Push payload:", data);

    const notificationTitle = data.notification?.title || "iMovie";
    const notificationOptions = {
      body: data.notification?.body || "",
      icon:
        data.notification?.icon ||
        "https://res.cloudinary.com/dfzbnd3qk/image/upload/v1775017796/favicon_dzxsbj.png",
      badge:
        data.notification?.badge ||
        "https://res.cloudinary.com/dfzbnd3qk/image/upload/v1775017796/favicon_dzxsbj.png",
      tag: "imovie-notification",
      requireInteraction: false,
      actions: [],
      data: data.data || {},
      timestamp: Date.now(),
    };

    console.log(
      "[Service Worker] Showing notification:",
      notificationTitle,
      notificationOptions,
    );

    event.waitUntil(
      self.registration
        .showNotification(notificationTitle, notificationOptions)
        .then(() => {
          console.log("[Service Worker] Notification shown successfully");
        })
        .catch((error) => {
          console.error("[Service Worker] Failed to show notification:", error);
        }),
    );
  } catch (error) {
    console.error("[Service Worker] Error handling push:", error);
  }
});

self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification clicked");
  event.notification.close();

  const urlToOpen = event.notification.data.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});

self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event.notification.tag);
});
