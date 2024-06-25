import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
      document.addEventListener("keydown", handlePreventTabAction);
    }
    return () => {
      if (showModal.show) {
        document.removeEventListener("keydown", handlePreventTabAction);
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
      if (containerNode) {
        const modalChild = showModal.modalData?.Component || <></>;
        const root = ReactDOM.createRoot(modalNode.getElementsByClassName("ns-modal-container")?.[0]);
        return root.render(modalChild);
      }
    }
  };

  function getBackgroundRef() {
    return backdropRef.current || null;
  }
  function handlePreventTabAction(e) {
    if (e.key === "Tab") {
      e.preventDefault();
    }
  }
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
          <div ref={backdropRef} className="backdrop opacity-100 transition-opacity fixed inset-0"></div>
          <div ref={modalContainerRef} className="ns-modal-container absolute top-1/2 left-1/2 transform shadow-sm p-8 bg-white"></div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ModalContainer;
