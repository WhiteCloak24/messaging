import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaPause, FaPlay } from "react-icons/fa";
import { formatSeconds } from "../../resources/functions";
import ListDropDown from "../ListDropDown";

const getProcessedAudioData = async (url) => {
  const data = await fetch(url);
  const blob = await data?.blob();
  const arrayBuffer = await blob.arrayBuffer();
  return { blob, arrayBuffer };
};

const AudioPlayer = React.memo(({ srcUrl = "", width = 300, height = 35, gap = 2, barColor = "#991b1b", barWidth = 3, downloadOption = false }) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [processedAudioFile, setProcessedAudioFile] = useState(null);
  const [audioLevels, setAudioLevels] = useState([]);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoadingMetaData, setIsLoadingMetaData] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioInstance = useRef();
  const audioContext = new window.AudioContext();

  const { data: processedAudioData } = useQuery({
    queryFn: ({ queryKey }) => getProcessedAudioData(queryKey[1]),
    queryKey: [`nightsoft_audio_player`, srcUrl],
    refetchOnWindowFocus: false,
    retry: false,
    gcTime: Infinity,
    staleTime: Infinity,
    refetchOnMount: false,
    enabled: Boolean(srcUrl),
  });

  useEffect(() => {
    if (audioInstance.current && processedAudioFile && !isLoadingMetaData) {
      audioInstance.current.src = URL.createObjectURL(processedAudioFile);
    }
  }, [audioInstance.current, processedAudioFile, isLoadingMetaData]);

  useEffect(() => {
    if (canvasRef.current && audioBuffer) {
      canvasRef.current.addEventListener("mousedown", enableSetDragging);
      canvasRef.current.addEventListener("mouseup", disableSetDragging);
      canvasRef.current.addEventListener("mousemove", getClickPosition);
      canvasRef.current.addEventListener("click", getClickPosition);
    }
    return () => {
      canvasRef?.current?.removeEventListener("mousedown", enableSetDragging);
      canvasRef?.current?.removeEventListener("mouseup", disableSetDragging);
      canvasRef?.current?.removeEventListener("mousemove", getClickPosition);
      canvasRef?.current?.removeEventListener("click", getClickPosition);
    };
  }, [canvasRef?.current, audioBuffer, isDragging]);

  // For audio file
  useEffect(() => {
    if (processedAudioData?.blob?.size) {
      (async () => {
        try {
          const file = new File([processedAudioData.blob], `random_ns_audio.${processedAudioData.blob.type.split("/")[1]}`, {
            type: processedAudioData.blob.type,
            lastModified: Date.now(),
            size: processedAudioData.blob.size,
          });
          setProcessedAudioFile(file);
        } catch (err) {
          console.error(err);
          setIsLoadingMetaData(false);
        }
      })();
    }
  }, [processedAudioData?.blob]);
  // For audio buffer and metadata
  useEffect(() => {
    if (processedAudioData?.arrayBuffer && processedAudioFile) {
      const clone = new ArrayBuffer(processedAudioData.arrayBuffer.byteLength);
      const view = new Uint8Array(processedAudioData.arrayBuffer);
      const cloneView = new Uint8Array(clone);
      cloneView.set(view);
      const arrayBuffer = clone;
      audioContext
        .decodeAudioData(arrayBuffer)
        .then((decodeAudioData) => {
          setTotalDuration(Math.ceil(decodeAudioData.duration));
          setAudioBuffer(decodeAudioData);
          setIsLoadingMetaData(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoadingMetaData(false);
        });
    }
  }, [processedAudioData?.arrayBuffer, processedAudioFile]);

  useEffect(() => {
    if (!isLoadingMetaData && audioBuffer) {
      updateAudioLevels(audioBuffer);
    }
  }, [isLoadingMetaData, audioBuffer]);

  function getClickPosition(event) {
    event.stopPropagation();
    event.preventDefault();
    if (!isDragging && event.type !== "click") return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    // const y = event.clientY - rect.top;
    const currentTime = totalDuration * (x / canvasRef?.current?.width);
    audioInstance.current.currentTime = currentTime;
    fillAudioLevel({ fillX: x });
  }

  function enableSetDragging(e) {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
  }
  function disableSetDragging(e) {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(false);
  }
  const updateAudioLevels = useCallback(
    (decodeAudioData) => {
      const number_of_bars = Math.floor(canvasRef?.current?.width / (barWidth + gap));
      const { duration, sampleRate } = decodeAudioData;
      const perBarDataDuration = duration / number_of_bars;

      const audioLevels = [];
      const channelData = decodeAudioData?.getChannelData(0);
      for (let i = 0; i < duration; i = i + perBarDataDuration) {
        const startSample = Math.floor(i * sampleRate);
        const endSample = Math.min(Math.floor((i + perBarDataDuration) * sampleRate), channelData.length);
        let sumSquared = 0;
        for (let j = startSample; j < endSample; j++) {
          sumSquared += channelData[j] ** 2;
        }
        const rms = Math.sqrt(sumSquared / (endSample - startSample));
        audioLevels.push(rms);
      }
      setAudioLevels(audioLevels);
      drawAudioLevel(audioLevels);
    },
    [canvasRef?.current]
  );

  function fillAudioLevel({ fillX = 0 }) {
    const dataParam = audioLevels;
    const context = canvasRef?.current?.getContext("2d");
    if (!context) return;
    context.lineWidth = 1;
    context.clearRect(0, 0, canvasRef?.current?.width, canvasRef?.current?.height);
    let x = 0;
    const drawableHeight = canvasRef?.current?.height;
    const max = Math.max(...dataParam);
    dataParam.forEach((value) => {
      const valueHeight = Math.max((value * drawableHeight) / max, 2);
      const ystart = (drawableHeight - valueHeight) / 2;
      context.moveTo(0, 0);
      if (fillX < x) {
        context.fillStyle = "#CACED3";
      } else {
        context.fillStyle = barColor;
      }
      context.fillRect(x, ystart, barWidth, valueHeight);
      x = x + barWidth + gap;
    });
  }

  function drawAudioLevel(dataParam = []) {
    const context = canvasRef?.current?.getContext("2d");
    if (!context) return;
    context.lineWidth = 1;
    context.clearRect(0, 0, canvasRef?.current?.width, canvasRef?.current?.height);
    let x = 0;
    const drawableHeight = canvasRef?.current?.height;
    const max = Math.max(...dataParam);
    dataParam.forEach((value) => {
      const valueHeight = Math.max((value * drawableHeight) / max, 2);
      const ystart = (drawableHeight - valueHeight) / 2;
      context.moveTo(0, 0);
      context.fillStyle = "#CACED3";
      context.fillRect(x, ystart, barWidth, valueHeight);
      x = x + barWidth + gap;
    });
  }

  const togglePlayPauseFn = useCallback(() => {
    try {
      if (!isPlaying) {
        const audioElements = document.querySelectorAll(".ns-audio-controller") || [];
        audioElements?.forEach(function (audio) {
          audio?.pause();
        });
        setIsPlaying(true);
        audioInstance.current.onended = () => {
          cancelAnimationFrame(animationFrameId.current);
          setIsPlaying(false);
          setCurrentTime(0);
          fillAudioLevel({ fillX: 0 });
        };
        audioInstance.current.onpause = () => {
          setIsPlaying(false);
          cancelAnimationFrame(animationFrameId.current);
        };
        audioInstance.current.play();
        animationFrameId.current = requestAnimationFrame(updateTimer);
      } else {
        audioInstance.current.pause();
        setIsPlaying(false);
        cancelAnimationFrame(animationFrameId.current);
      }
    } catch (error) {
      console.log(error);
    }
  }, [isPlaying, audioLevels]);

  const updateTimer = useCallback(() => {
    const currentTime = audioInstance.current.currentTime || 0;
    setCurrentTime(Math.floor(currentTime));
    const totalDuration = audioBuffer?.duration || 0;
    const x = (currentTime * canvasRef?.current?.width) / totalDuration;
    fillAudioLevel({ fillX: x });
    animationFrameId.current = requestAnimationFrame(updateTimer);
  }, [audioLevels]);

  const playbackDropDownList = useMemo(() => {
    return [
      { label: "1x", value: 1, onChange: (val) => setPlaybackSpeed(val) },
      { label: "1.5x", value: 1.5, onChange: (val) => setPlaybackSpeed(val) },
      { label: "2x", value: 2, onChange: (val) => setPlaybackSpeed(val) },
    ];
  }, []);

  if (isLoadingMetaData) return <>Loading...</>;
  return (
    <>
      <audio ref={audioInstance} hidden className="ns-audio-controller"></audio>
      <div className="w-full flex items-center gap-2 border rounded-md p-2">
        <span
          className={`text-red-800 bg-white border border-red-800 opacity-50 h-10 w-10 rounded-full flex items-center justify-center cursor-not-allowed`}>
          {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
        </span>
        <div style={{ width: `${width}px`, height: `${height}px` }} className="flex items-center justify-center">
          s
        </div>
      </div>
      <div className="w-full flex items-start gap-2 border rounded-md p-2">
        <span
          className={`${
            isPlaying ? "bg-red-800 text-white" : "text-red-800 bg-white border border-red-800"
          } h-10 w-10 rounded-full flex items-center justify-center cursor-pointer transition-all`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            togglePlayPauseFn();
          }}>
          {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
        </span>
        <div style={{ width: `${width}px` }} className="flex flex-col">
          <canvas className="cursor-pointer" width={width} height={height} ref={canvasRef}></canvas>
          <div className="w-full flex justify-between items-start">
            <span className="text-xs text-grey-600 min-w-[60px] max-w-[60px] flex items-start justify-start">{formatSeconds(currentTime)}</span>
            <span className="text-xs text-grey-600 min-w-[60px] max-w-[60px] flex items-start justify-end">{formatSeconds(totalDuration)}</span>
          </div>
        </div>
        <div style={{ height: `${height}px` }} className="h-full flex items-center gap-2 justify-end">
          <ListDropDown className="audio-playback" dropDownList={playbackDropDownList}>
            <span className="cursor-pointer bg-black flex items-center justify-center text-xs text-white rounded-xl px-4 py-1 transition-all hover:bg-gray-800">
              {playbackSpeed}x
            </span>
          </ListDropDown>
        </div>
      </div>
    </>
  );
});

AudioPlayer.displayName = "AudioPlayer";
export default AudioPlayer;
