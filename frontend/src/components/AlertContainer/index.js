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
    <div className="w-60 h-full fixed bottom-0 left-0 pointer-events-none">
      <div className="alerts">F
        {alerts.map((alert) => (
          <div key={alert?.id} id={alert?.id} className="alert bg-red text-black h-28">
            {alert?.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertContainer;
