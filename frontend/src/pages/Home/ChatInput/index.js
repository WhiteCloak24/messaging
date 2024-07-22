import React, { useRef, useState, useCallback, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa6";
import { FaSmile, FaMicrophone, FaTelegramPlane } from "react-icons/fa";
import TooltipWrapper from "../../../components/Tooltip/TooltipWrapper";
import { useApplicationSocket } from "../../../hooks/useApplicationSocket";
import AttachmentsPreviewer from "./AttachmentsPreviewer/AttachmentsPreviewer";
import { convertFileToArrayBuffer } from "../../../resources/functions";

const ChatInput = ({ activeChat }) => {
  const inputRef = useRef();
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const { sendMessage } = useApplicationSocket();

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [activeChat?.user_id]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      console.log(event);
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      audioChunks.current = [];
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };

  const sendMessageHandler = useCallback(
    (message, attachments = []) => {
      if (!message?.trim() && attachments.length === 0) return;
      const attachment = attachments.map((attachment) => attachment.fileBuffer);
      sendMessage({ recipients: [activeChat?.user_id], message, attachments: attachment });
      setMessage("");
    },
    [activeChat?.user_id]
  );

  const handleImageAttachments = useCallback(async (e) => {
    const files = [];
    setIsFileProcessing(true);
    for (let index = 0; index < e.target.files.length; index++) {
      const file = e.target.files[index];
      const resolvedData = await convertFileToArrayBuffer(file);
      files.push(resolvedData);
    }
    setAttachments((prev) => [...prev, ...files]);
    setIsFileProcessing(false);
  }, []);

  const handleRemoveAttachments = useCallback(
    (index) => {
      const newAttach = [...attachments];
      newAttach.splice(index, 1);
      setAttachments(newAttach);
    },
    [attachments]
  );
  return (
    <div className="w-full flex p-4 border-t bg-white items-center gap-3 relative">
      {attachments.length > 0 && <AttachmentsPreviewer attachments={attachments} handleRemoveAttachments={handleRemoveAttachments} />}
      <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:text-amber-700">
        <FiPlus />
      </div>
      <TooltipWrapper tooltipText="Select Image">
        <label
          htmlFor="attachment-image"
          className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:text-blue-300">
          <FaRegImage />
          <input id="attachment-image" type="file" hidden accept="image/*" multiple onChange={handleImageAttachments} />
        </label>
      </TooltipWrapper>
      <TooltipWrapper tooltipText="Select Emoji">
        <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:text-yellow-600">
          <FaSmile />
        </div>
      </TooltipWrapper>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a message..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessageHandler(message, attachments);
          }
        }}
        value={message}
        className="flex-1 p-2 rounded border"
      />
      {!isRecording ? (
        <TooltipWrapper tooltipText="Start Recording">
          <div className="cursor-pointer" onClick={startRecording}>
            <FaMicrophone />
          </div>
        </TooltipWrapper>
      ) : (
        <div className="cursor-pointer" onClick={stopRecording}>
          Stop
        </div>
      )}
      <TooltipWrapper tooltipText="Send Message">
        <div className="cursor-pointer" onClick={() => sendMessageHandler(message, attachments)}>
          <FaTelegramPlane />
        </div>
      </TooltipWrapper>
      {audioURL && <audio src={audioURL} controls />}
    </div>
  );
};
export default ChatInput;
