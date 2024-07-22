import React from "react";
import ImagePreviewer from "./ImagePreviewer/ImagePreviewer";

const AttachmentsPreviewer = ({ attachments = [], handleRemoveAttachments = () => null }) => {
  return (
    <div className="absolute w-full h-40 bg-customBlue top-[-160px] left-0 border border-white rounded-md p-3 flex gap-4 overflow-x-auto">
      {attachments.map((file, index) => {
        if (file.fileType.includes("image/")) {
          return <ImagePreviewer index={index} file={file} handleRemoveAttachments={handleRemoveAttachments} />;
        }
        return <>file</>;
      })}
    </div>
  );
};

export default AttachmentsPreviewer;
