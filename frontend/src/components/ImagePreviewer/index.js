import React, { useEffect } from "react";
import { AvatarPreview } from "../../resources/constants";

const ImagePreviewer = () => {
  useEffect(() => {
    window.addEventListener(AvatarPreview, handleAvatarPreview);
    return () => window.removeEventListener(AvatarPreview, handleAvatarPreview);
  }, []);

  function handleAvatarPreview(e) {
    const node = e.detail.node;
    const nodeHeight = node.offsetHeight;
    const nodeWidth = node.offsetWidth;
    const aspectRatio = nodeHeight / nodeWidth
    const container = document.getElementById("preview-container");
    container.style.width = `${aspectRatio * container.offsetHeight}px`
    node.classList.remove('hover:opacity-70')
    container.appendChild(node);
  }
  return (
    <div className="h-screen w-screen bg-black opacity-55 fixed top-0 flex flex-col items-center justify-center">
      <div id="preview-container" className="h-3/4 bg-black"></div>
    </div>
  );
};

export default ImagePreviewer;
