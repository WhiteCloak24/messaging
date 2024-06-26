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
export function formatDate({ timestamp = "" }) {
  if (!timestamp) return "Invalid Date";
  return moment(timestamp).format("hh:mm A");
}

export function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.innerText = 'New content is available. Please refresh.';
  notification.style.position = 'fixed';
  notification.style.bottom = '0';
  notification.style.width = '100%';
  notification.style.backgroundColor = '#ff9800';
  notification.style.color = '#fff';
  notification.style.textAlign = 'center';
  notification.style.padding = '1em';
  notification.style.zIndex = '1000';

  const refreshButton = document.createElement('button');
  refreshButton.innerText = 'Refresh';
  refreshButton.style.marginLeft = '1em';
  refreshButton.addEventListener('click', () => {
      if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
      }
      window.location.reload();
  });
  notification.appendChild(refreshButton);
  document.body.appendChild(notification);
  window.location.reload();
}