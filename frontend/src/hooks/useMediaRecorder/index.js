import React, { useCallback, useEffect, useRef } from "react";

const useMediaRecorder = () => {
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const mediaStream = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      mediaRecorder.current = new MediaRecorder(micStream);
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.current.push(event.data);
      });
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks.current, {
          type: mediaRecorder.mimeType,
        });
        console.log(audioBlob);
      });
      mediaRecorder.start();
      mediaStream.current = micStream;
    } catch (err) {
      console.log("could not start audio");
    }
  }, []);

  const stopMicrophone = useCallback(async () => {
    mediaRecorder?.current.stop();
    audioChunks.current = [];
    mediaStream.current &&
      mediaStream.current.getTracks().forEach((track) => track.stop());
    // cancelAnimationFrame(rafId);
    // analyser?.disconnect();
    // source?.disconnect();
  }, []);

  return { startRecording, stopMicrophone };
};

export default useMediaRecorder;
