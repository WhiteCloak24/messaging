import React, { useEffect, useRef, useState } from "react";
import { AlertEVENTS } from "../../resources/constants";
import Queue from "../../data-structures/Queue";
import { generateRandomId } from "../../resources/functions";
import { IoClose } from "react-icons/io5";
import { MdError } from "react-icons/md";
import { MdCheck } from "react-icons/md";

const alertClassLookup = {
  error: "alert-error",
  success: "alert-success",
};
const alertIconLookup = {
  error: <MdError />,
  success: <MdCheck />,
};
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
  };
  const processQueue = () => {
    if (!alertQueueRef.current.isEmpty()) {
      setAlerts((prev) => {
        const lastAlert = alertQueueRef.current.dequeue();
        const newAlerts = [...prev, lastAlert];
        setTimeout(() => {
          document.getElementById(lastAlert?.id).classList.add("animate-alertAnimationOut");
          setTimeout(() => {
            removeAlert(lastAlert?.id);
          }, 500);
        }, 4500); // Show each alert for n seconds
        return newAlerts;
      });
    }
  };

  const showAlert = ({ message, type }) => {
    const newid = generateRandomId();
    if (newid) {
      alertQueueRef.current.enqueue({ id: newid, message, type });
      processQueue();
    }
  };

  const handleAlert = (e) => {
    const errorData = e.detail;
    showAlert({ message: errorData?.message, type: errorData?.type || "error" });
  };

  return (
    <div className="alert-container ">
      <div className="flex flex-col gap-3">
        {alerts.map((alert, index) => (
          <div
            key={alert?.id}
            style={{ order: index + 1 }}
            id={alert?.id}
            className={`${alertClassLookup[alert?.type]} flex flex-col justify-center pointer-events-auto animate-alertAnimationIn relative`}>
            <div className="h-full flex items-center px-2 justify-between w-full gap-4">
              <div className="min-w-fit max-w-fit h-full flex items-center justify-center alert-close">{alertIconLookup[alert?.type]}</div>
              <div className="p-2 w-full h-full break-words alert-message">{alert?.message}</div>
              <div className="cursor-pointer min-w-fit max-w-fit h-full flex items-center justify-center alert-close" onClick={() => removeAlert(alert?.id)}>
                <IoClose className="w-5 h-5" />
              </div>
            </div>
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
    <div ref={loaderContainerRef} className="h-1 mb-1 w-full overflow-hidden  absolute bottom-0">
      <div ref={loaderRef} className="alert-loader w-0 h-full"></div>
    </div>
  );
};
