import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaPause, FaPlay } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";

const getProcessedAudioData = async (url) => {
  const data = await fetch(url);
  const blob = await data?.blob();
  const arrayBuffer = await data?.arrayBuffer();
  return { blob, arrayBuffer };
};

const AudioPlayer = React.memo(
  ({
    srcUrl = "",
    width = 300,
    height = 35,
    gap = 2,
    barColor = "#991b1b",
    barWidth = 5,
    loadingItem: LoadingItem = () => null,
    downloadOption = true,
    filename = "",
  }) => {
    let rafId;
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [processedAudioFile, setProcessedAudioFile] = useState(false);
    const [audioLevels, setAudioLevels] = useState([]);
    const [audioBuffer, setAudioBuffer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isLoadingMetaData, setIsLoadingMetaData] = useState(true);
    const audioInstance = useRef(new Audio());
    const audioContext = new window.AudioContext();

    const { data: processedAudioData } = useQuery({
      queryFn: ({ queryKey }) => getProcessedAudioData(queryKey[0]),
      queryKey: [`nightsoft_audio_player_${srcUrl}`],
      refetchOnWindowFocus: false,
      retry: false,
      gcTime: Infinity,
      refetchOnMount: false,
      enabled: Boolean(srcUrl),
    });

    useEffect(() => {
      if (audioInstance.current) {
        audioInstance.current.classList.add("ns-audio-controller");
        document.body.appendChild(audioInstance.current);
      }
      return () => {
        if (audioInstance.current) {
          document.body.removeChild(audioInstance.current);
        }
      };
    }, [audioInstance.current]);

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
      if (processedAudioData.blob?.size) {
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
    }, [processedAudioData.blob]);

    // For audio buffer and metadata
    useEffect(() => {
      if (processedAudioData.arrayBuffer) {
        const arrayBuffer = processedAudioData.arrayBuffer;
        audioContext
          .decodeAudioData(arrayBuffer)
          .then((decodeAudioData) => {
            setTotalDuration(Math.ceil(decodeAudioData.duration));
            setAudioBuffer(decodeAudioData);
            audioInstance.current.src = URL.createObjectURL(processedAudioFile);
            setIsLoadingMetaData(false);
          })
          .catch((err) => {
            console.error(err);
            setIsLoadingMetaData(false);
          });
      }
    }, [processedAudioData.arrayBuffer]);

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
      sound.currentTime = currentTime;
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
    const updateAudioLevels = useCallback((decodeAudioData) => {
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
    }, []);

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
            cancelAnimationFrame(rafId);
            setIsPlaying(false);
            setCurrentTime(0);
            fillAudioLevel({ fillX: 0 });
          };
          audioInstance.current.onpause = () => {
            setIsPlaying(false);
            cancelAnimationFrame(rafId);
          };
          audioInstance.current.play();
          rafId = requestAnimationFrame(updateTimer);
        } else {
          audioInstance.current.pause();
          setIsPlaying(false);
          cancelAnimationFrame(rafId);
        }
      } catch (error) {
        console.log(error);
      }
    }, [isPlaying]);

    const updateTimer = useCallback(() => {
      const currentTime = audioInstance.current.currentTime || 0;
      setCurrentTime(Math.floor(currentTime));
      const totalDuration = audioBuffer?.duration || 0;
      const x = (currentTime * canvasRef?.current?.width) / totalDuration;
      fillAudioLevel({ fillX: x });
      requestAnimationFrame(updateTimer);
    }, []);

    if (isLoadingMetaData) return <>Loading...</>;
    return (
      <>
        <div className="w-full flex items-center  gap-4 ">
          <span
            className="bg-gray-900 xxl:min-w-[40px] xl:min-w-[40px] lg:min-w-[40px] md:min-w-[35px] sm:min-w-[35px] xs:min-w-[35px] xxl:h-[40px] xl:h-[40px] lg:h-[40px] md:h-[35px] sm:h-[35px] xs:h-[35px] rounded-full text-green flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              togglePlayPauseFn();
            }}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </span>

          <canvas className="cursor-pointer" width={width} height={height} ref={canvasRef}></canvas>
          <div className="flex items-center gap-4 justify-end">
            {downloadOption && (
              <span
                className="cursor-pointer text-green"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  // downloadFile(processedAudioFile);
                }}>
                <MdFileDownload />
              </span>
            )}
            <span className="font-medium text-sm text-grey-600 min-w-[60px] flex justify-center items-center">
              {/* {secondsToHHMMSS(totalDuration - currentTime)} */}
              {totalDuration - currentTime}
            </span>
          </div>
        </div>
      </>
    );
  }
);

AudioPlayer.displayName = "AudioPlayer";
export default AudioPlayer;
