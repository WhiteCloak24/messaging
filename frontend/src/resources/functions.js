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
