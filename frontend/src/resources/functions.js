import moment from "moment";

export const dispatchCustomEventFn = ({ eventName = "", eventData = null }) => {
  if (!eventName) return;
  const customEvent = new CustomEvent(eventName, { detail: eventData });
  window.dispatchEvent(customEvent);
};

export function generateRandomId(length = 16) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let id = "";
  for (let i = 0; i < length; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return id;
}
export function getInitials({ firstName = "", lastName = "" }) {
  return `${firstName?.charAt(0)?.toUpperCase() || "U"}${lastName?.charAt(0)?.toUpperCase() || ""}`;
}
export function formatTime({ timestamp = "", format = "hh:mm A" }) {
  if (!timestamp) return "Invalid Date";
  return moment(timestamp).format(format);
}
export function formatDate({ timestamp = "", format = "DD/MM/YY" }) {
  if (!timestamp) return "Invalid Date";
  return moment(timestamp).format(format);
}
export const formatSeconds = (seconds = 0) => {
  if (!seconds) return "00:00";
  return moment.utc(seconds * 1000).format("mm:ss");
};
export function getTimeFromNow({ timestamp = "", format = "DD/MM/YY" }) {
  if (!timestamp) return "Invalid Date";
  return moment(timestamp).fromNow();
}

export function showUpdateNotification() {
  const notification = document.createElement("div");
  notification.innerText = "New content is available. Please refresh.";
  notification.style.position = "fixed";
  notification.style.bottom = "0";
  notification.style.width = "100%";
  notification.style.backgroundColor = "#ff9800";
  notification.style.color = "#fff";
  notification.style.textAlign = "center";
  notification.style.padding = "1em";
  notification.style.zIndex = "1000";

  const refreshButton = document.createElement("button");
  refreshButton.innerText = "Refresh";
  refreshButton.style.marginLeft = "1em";
  refreshButton.addEventListener("click", () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ action: "skipWaiting" });
    }
    window.location.reload();
  });
  notification.appendChild(refreshButton);
  document.body.appendChild(notification);
  window.location.reload();
}

export function convertFileToArrayBuffer(file) {
  if (file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const fileBuffer = new Uint8Array(event.target.result);
        resolve({ fileName: file.name, fileBuffer: fileBuffer, fileType: file.type, url: URL.createObjectURL(file) });
      };
      reader.readAsArrayBuffer(file);
    });
  } else {
    return null;
  }
}

async function fetchWithProgress(url, onProgress) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentLength = response.headers.get("Content-Length");
  if (!contentLength) {
    throw new Error("Content-Length response header is missing");
  }

  const total = parseInt(contentLength, 10);
  let loaded = 0;

  const reader = response.body.getReader();

  const stream = new ReadableStream({
    start(controller) {
      function push() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }

            loaded += value.byteLength;
            onProgress(loaded, total);
            controller.enqueue(value);
            push();
          })
          .catch((error) => {
            console.error("Stream read error:", error);
            controller.error(error);
          });
      }

      push();
    },
  });

  const responseWithProgress = new Response(stream);
  return responseWithProgress.blob(); // or responseWithProgress.text(), or responseWithProgress.json(), etc.
}

// Usage example:
const url =
  "https://media-dev.nextere.com/v1/signed-url/335952c9-7d8b-4700-a6c1-12c32241402d/greeting?filename=ae71dec7-485e-4fa0-923d-beecdbefe9c0.mp3";
// fetchWithProgress(url, (loaded, total) => {
//   console.log(`Progress: ${((loaded / total) * 100).toFixed(2)}%`);
// })
//   .then((blob) => {
//     console.log("Download complete!", blob);
//     // Do something with the downloaded blob
//   })
//   .catch((error) => {
//     console.error("Fetch error:", error);
//   });

export const isActivePath = ({ order = "1", pathname = "", path = "" }) => {
  if (order === "1") {
    const activePath = pathname?.split("/")?.pop();
    if (activePath === path) {
      return true;
    }
  }
  return false;
};

export const getProcessedResource = async (url) => {
  try {
    const data = await fetch(url);
    const blob = await data?.blob();
    return { blob };
  } catch (err) {
    return {
      blob: {},
    };
  }
};

export const getAttachmentType = ({ fileName = "" }) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm"];

  // Extract the file extension from the fileName
  const extension = fileName.split(".").pop().toLowerCase();

  // Determine the type based on the file extension
  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else {
    return "unknown"; // Return 'unknown' if the type is not identified
  }
};
