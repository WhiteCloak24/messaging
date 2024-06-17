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
    // processQueue(); // Process the next alert in the queue
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
        {alerts.map((alert, index) => (
          <div
            key={alert?.id}
            style={{ order: index + 1 }}
            id={alert?.id}
            className="alert-error flex flex-col pointer-events-auto animate-alertAnimation">
            <div className="h-1/5 min-h-7 border-b border-black flex items-center px-2 justify-between">
              <div>Error</div>
              <div className="cursor-pointer" onClick={() => removeAlert(alert?.id)}>
                Close
              </div>
            </div>
            <div className="h-full p-2">{alert?.message}</div>
            <Loader />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertContainer;

const Loader = ({ time = 5000 }) => {
  const loaderRef = useRef();
  const loaderContainerRef = useRef();
  const timeRef = useRef(0);
  useEffect(() => {
    let interval;
    if (loaderRef.current && loaderContainerRef.current) {
      interval = setInterval(() => {
        const containerWidth = loaderContainerRef.current.offsetWidth - 2;
        timeRef.current = timeRef.current + 10;
        const loaderWidth = (timeRef.current / time) * containerWidth;
        loaderRef.current.style.width = `${loaderWidth}px`;
      }, 10);
    }
    return () => {
      clearInterval(interval);
    };
  }, [loaderRef.current, loaderContainerRef.current]);

  return (
    <div ref={loaderContainerRef} className="h-1 mb-1 mx-1">
      <div ref={loaderRef} className="bg-red-500 w-0 h-full"></div>
    </div>
  );
};
