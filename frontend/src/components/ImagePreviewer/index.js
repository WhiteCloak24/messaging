import React, { useCallback, useEffect, useRef } from "react";
import { AvatarPreview } from "../../resources/constants";

const ImagePreviewer = () => {
  const previewRef = useRef(null);
  const previewContainerRef = useRef(null);
  useEffect(() => {
    window.addEventListener(AvatarPreview, handleAvatarPreview);
    return () => window.removeEventListener(AvatarPreview, handleAvatarPreview);
  }, []);

  function handleAvatarPreview(e) {
    const node = e.detail.node;
    const clone = node.cloneNode(true);
    openPreview();
    const nodeHeight = node.offsetHeight;
    const nodeWidth = node.offsetWidth;
    const aspectRatio = nodeHeight / nodeWidth;
    const container = previewContainerRef.current;
    container.style.width = `${aspectRatio * container.offsetHeight}px`;
    clone.classList.remove("hover:opacity-70");
    container.appendChild(clone);
  }
  const openPreview = useCallback(() => {
    previewRef.current.classList.add("top-0");
  }, []);
  const closePreview = useCallback(() => {
    const container = previewContainerRef.current;
    previewRef.current.classList.remove("top-0");
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  }, []);
  return (
    <div ref={previewRef} className="h-screen w-screen bg-black opacity-55 fixed flex flex-col items-center justify-center">
      <div className="fixed top-2 right-5 bg-slate-50 p-3 rounded-md cursor-pointer" onClick={closePreview}>Close</div>
      <div ref={previewContainerRef} id="preview-container" className="h-3/4 bg-black overflow-hidden"></div>
    </div>
  );
};

export default ImagePreviewer;
