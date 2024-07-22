import React from "react";
import { MdCancel } from "react-icons/md";

const ImagePreviewer = ({ file, handleRemoveAttachments = () => null, index }) => {
  return (
    <div className="bg-white rounded-md min-w-40 max-w-40 flex justify-center shadow relative">
      <div
        className="absolute top-[-4px] right-[-4px] bg-black text-white rounded-full cursor-pointer"
        onClick={() => handleRemoveAttachments(index)}>
        <MdCancel />
      </div>
      <img className="h-full w-full rounded-md" src={file.url} alt="" />
    </div>
  );
};

export default ImagePreviewer;
