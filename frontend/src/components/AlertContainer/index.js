import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertEVENTS } from "../../resources/constants";
import Queue from "../../data-structures/Queue";
import { generateRandomId } from "../../resources/functions";

const AlertContainer = () => {
  const [alerts, setAlerts] = useState([]);
  const alertQueueRef = useRef(new Queue());

  useEffect(() => {
    window.addEventListener(AlertEVENTS.ALERT, handleAlert);
    return () => window.removeEventListener(AlertEVENTS.ALERT, handleAlert);
  }, []);

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => {
      return prevAlerts.filter((alert) => alert?.id !== id);
    });
    processQueue(); // Process the next alert in the queue
  };
  const processQueue = () => {
    if (!alertQueueRef.current.isEmpty()) {
      setAlerts((prev) => {
        const jasdh = alertQueueRef.current.dequeue();
        const newAlerts = [...prev, jasdh];
        setTimeout(() => {
          removeAlert(jasdh?.id);
        }, 5000); // Show each alert for 3 seconds
        return newAlerts;
      });
    }
  };

  const showAlert = (message) => {
    const newid = generateRandomId();
    if (newid) {
      alertQueueRef.current.enqueue({ id: newid, message });
      processQueue();
    }
  };

  const handleAlert = (e) => {
    const errorData = e.detail;
    showAlert(errorData?.message);
  };

  return (
    <div className="alert-container ">
      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <div key={alert?.id} id={alert?.id} className="alert-error pointer-events-auto">
            <div className="h-1/4 min-h-7 border-b border-black flex items-center px-2 justify-between">
              <div>Error</div>
              <div className="cursor-pointer" onClick={() => removeAlert(alert?.id)}>
                Close
              </div>
            </div>
            <div className="h-full p-2">{alert?.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertContainer;
