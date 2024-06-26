const staticCacheName = "static-cache";
const assets = ["/", "/index.html"];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches
      .open(staticCacheName)
      .then((cache) => {
        cache.addAll(["/static/js/bundle.js", "/manifest.json", "/favicon.ico", "/logo192.png", "/index.html", "/", "/signup"]);
      })
      .catch((err) => {
        console.error(err);
      })
  );
});
self.addEventListener("activate", (evt) => {
  console.log("Service worker has been activated");
});
self.addEventListener("fetch", (evt) => {
  // console.log(evt);
  // dispatchCustomEventFn({ eventName: "ALERT", eventData: { message: "service worker" } });
  evt.respondWith(
    caches.match(evt.request).then((resp) => {
      if (resp) {
        return resp || fetch(evt.request);
      }
    })
  );
});
