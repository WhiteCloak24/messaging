const staticCacheName = "static-cache";
const assets = ["/", "/index.html"];

self.addEventListener("install", (evt) => {
  caches
    .open(staticCacheName)
    .then((cache) => {
      cache.addAll([]);
    })
    .catch((err) => {
      console.error(err);
    });
});
self.addEventListener("activate", (evt) => {
  console.log("Service worker has been activated");
});
self.addEventListener("fetch", (evt) => {
  //   console.log("Fetch Event", evt);
});
