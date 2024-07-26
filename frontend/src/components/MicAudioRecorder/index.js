import React, { useCallback, useRef, useState } from "react";
import DynamicMicIcon from "../DynamicMicIcon";

const MicAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioLevelInterval = useRef(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const startRecording = useCallback(async () => {
    const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    handleMediaRecording({ micStream });
    handleAudioLevelDetection({ micStream });
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorder.current.stop();
    setIsRecording(false);
    if (audioLevelInterval.current) {
      clearInterval(audioLevelInterval.current);
    }
  }, []);

  function handleRecordingButton() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  const handleMediaRecording = useCallback(({ micStream = null }) => {
    if (micStream) {
      mediaRecorder.current = new MediaRecorder(micStream);
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        audioChunks.current = [];
        mediaRecorder.current = null;
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    }
  }, []);

  const handleAudioLevelDetection = useCallback(({ micStream = null }) => {
    if (micStream) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();

      // Create a media stream source
      const source = audioContext.createMediaStreamSource(micStream);
      source.connect(analyser);
      // Set up the analyser
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const getAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Normalize to range 0 to 1
        const normalizedLevel = average / 128; // 256 is the max value in dataArray
        return normalizedLevel;
      };

      audioLevelInterval.current = setInterval(() => {
        const level = getAudioLevel();
        setAudioLevel(level);
      }, 150); // Update every second
    }
  }, []);
  return (
    <div className="flex justify-between gap-10 min-h-80 min-w-[550px]">
      <div className="flex flex-col gap-5">
        <div>
          Click on <b> Start Recording </b>to record your audio
        </div>
        <div
          style={{ transition: "background-color 0.2s ease" }}
          className={`p-4 select-none ${isRecording ? "bg-red-800" : "bg-green-700"} max-w-fit rounded-md cursor-pointer text-white`}
          onClick={handleRecordingButton}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </div>
        <div>{audioBlob && <audio controls src={URL.createObjectURL(audioBlob)}></audio>}</div>
      </div>
      <div>
        <DynamicMicIcon audioLevel={audioLevel} />
      </div>
    </div>
  );
};

export default MicAudioRecorder;
