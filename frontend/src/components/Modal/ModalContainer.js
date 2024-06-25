import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ModalEvent } from "../../resources/constants";
import { generateRandomId } from "../../resources/functions";
import ReactDOM from "react-dom/client";
import useClickOutside from "../../hooks/useClickOutside";

const initialState = { show: false, modalData: { Component: <></>, closeOnClickOutside: false, onClose: () => null } };

const ModalContainer = () => {
  const ModalContainerIdRef = useRef(generateRandomId());
  const modalContainerRef = useRef(null);
  const backdropRef = useRef(null);
  const [showModal, setShowModal] = useState(initialState);

  useEffect(() => {
    window.addEventListener(ModalEvent.OPEN, handleOpenModal);
    window.addEventListener(ModalEvent.CLOSE, handleCloseModal);
    return () => {
      window.removeEventListener(ModalEvent.OPEN, handleOpenModal);
      window.removeEventListener(ModalEvent.CLOSE, handleCloseModal);
    };
  }, []);

  useLayoutEffect(() => {
    if (showModal.show) {
      updateOpenModalDom();
    }
  }, [showModal.show]);
  useEffect(() => {
    if (showModal.show) {
      modalContainerRef.current?.focus();
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (showModal.show) {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [showModal.show]);

  const handleOpenModal = (e) => {
    setShowModal({ show: true, modalData: e.detail });
  };
  const handleCloseModal = (e) => {
    setShowModal({ show: false, modalData: e.detail });
  };

  const updateOpenModalDom = () => {
    const modalNode = document.getElementById(`ns-modal-${ModalContainerIdRef?.current}`);
    if (modalNode) {
      const containerNode = modalNode.getElementsByClassName("ns-modal-container")?.[0] || null;
      // backdropRef?.current?.classList?.replace("opacity-0", "opacity-100");
      if (containerNode) {
        const modalChild = showModal.modalData?.Component || <></>;
        const root = ReactDOM.createRoot(modalNode.getElementsByClassName("ns-modal-container")?.[0]);
        return root.render(modalChild);
      }
    }
  };

  const trapFocus = useCallback(
    (event) => {
      const focusableElements = modalContainerRef.current.querySelectorAll(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (focusableElements.length === 0) {
        event.preventDefault();
      }
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    },
    [modalContainerRef.current]
  );

  function getBackgroundRef() {
    return backdropRef.current || null;
  }

  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      trapFocus(event);
    } else if (event.key === "Escape") {
      showModal.modalData.onClose();
    }
  };
  useClickOutside({
    useDocument: false,
    backGround: getBackgroundRef,
    ref: showModal.show ? [modalContainerRef] : [],
    onClickOutsideCb: showModal.modalData.closeOnClickOutside ? showModal.modalData.onClose : () => null,
  });
  return (
    <>
      {showModal.show ? (
        <div id={`ns-modal-${ModalContainerIdRef?.current}`} role="modal" className="fixed z-50 inset-0">
          <div
            ref={backdropRef}
            className={`backdrop opacity-0 fixed inset-0 flex items-center justify-center opacity-animation`}
          ></div>
          <div ref={modalContainerRef} tabIndex={-1} className="ns-modal-container absolute top-1/2 left-1/2 transform shadow-sm p-8 bg-white"></div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ModalContainer;
