import React, { useRef, useState, useCallback, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa6";
import { FaSmile, FaMicrophone, FaTelegramPlane } from "react-icons/fa";
import TooltipWrapper from "../../../components/Tooltip/TooltipWrapper";
import { useApplicationSocket } from "../../../hooks/useApplicationSocket";

const ChatInput = ({ activeChat }) => {
  const inputRef = useRef();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
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
    (message) => {
      sendMessage({ recipients: [activeChat?.user_id], message });
    },
    [activeChat?.user_id]
  );

  return (
    <div className="w-full flex p-4 border-t bg-white items-center gap-3">
      <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:text-amber-700">
        <FiPlus />
      </div>
      <TooltipWrapper tooltipText="Select Image">
        <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:text-blue-300">
          <FaRegImage />
        </div>
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
        <div className="cursor-pointer" onClick={() => sendMessageHandler(message)}>
          <FaTelegramPlane />
        </div>
      </TooltipWrapper>
      {audioURL && <audio src={audioURL} controls />}
    </div>
  );
};
export default ChatInput;
