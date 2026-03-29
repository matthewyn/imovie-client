// Import the Firebase scripts
importScripts(
  "https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js",
);

// Handle incoming push messages
self.addEventListener("push", (event) => {
  if (!event.data) {
    console.log("Push notification received but no data");
    return;
  }

  try {
    const data = event.data.json();
    const options = {
      body: data.notification?.body || event.data.text(),
      icon: "/vite.svg",
      badge: "/vite.svg",
      tag: data.notification?.tag || "notification",
      requireInteraction: data.notification?.requireInteraction || false,
      data: data.data || {},
    };

    event.waitUntil(
      self.registration.showNotification(
        data.notification?.title || "iMovie Notification",
        options,
      ),
    );
  } catch (error) {
    console.error("Error handling push notification:", error);
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
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

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event.notification.tag);
});
