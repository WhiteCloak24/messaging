import React, { useEffect } from "react";
import { dispatchCustomEventFn } from "../../resources/functions";
import { ModalEvent } from "../../resources/constants";

const Modal = ({ open = false, onClose = () => null, closeOnClickOutside = false, children }) => {
  useEffect(() => {
    if (open) {
      dispatchCustomEventFn({ eventName: ModalEvent.OPEN, eventData: { Component: children, closeOnClickOutside, onClose } });
    } else {
      dispatchCustomEventFn({ eventName: ModalEvent.CLOSE, eventData: { Component: <></>, closeOnClickOutside, onClose } });
    }
  }, [open]);

  return <></>;
};

export default Modal;
