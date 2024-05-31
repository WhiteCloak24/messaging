export const dispatchCustomEventFn = ({ eventName = "", eventData = null }) => {
  if (!eventName) return;
  const customEvent = new CustomEvent(eventName, { detail: eventData });
  window.dispatchEvent(customEvent);
};
