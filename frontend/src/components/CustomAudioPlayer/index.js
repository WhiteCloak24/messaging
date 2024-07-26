import { Download, MusicNote, Pause, Play } from 'assets/images';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { downloadFile, secondsToHHMMSS } from 'shared/resources';
import { useQuery } from '@tanstack/react-query';
import EllipsisTextWithTooltip from 'components/EllipsisTextWithTooltip';

const fetchFn = async (url) => {
  const data = await fetch(url);
  const blob = await data?.blob();
  return blob;
};
const CustomAudioPlayer = React.memo(
  ({
    srcfile = null,
    srcUrl = '',
    width = 300,
    height = 35,
    gap = 2,
    barColor = '#6D8F50',
    barWidth = 5,
    minimal = false,
    loadingItem: LoadingItem = () => null,
    downloadOption = true,
    withIcon = true,
    filename = '',
  }) => {
    let rafId;
    const canvasRef = useRef(null);
    const minimalCanvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(false);
    const [audioLevels, setAudioLevels] = useState([]);
    const [audioBuffer, setAudioBuffer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isBrokenFile, setIsBrokenFile] = useState(false);
    const [isLoadingMetaData, setIsLoadingMetaData] = useState(true);
    const [sound, setSound] = useState(null);
    const audioContext = new window.AudioContext();
    const fileVal = useMemo(() => srcfile, [srcfile]);

    const { data: fileData, isLoading } = useQuery({
      queryFn: ({ queryKey }) => fetchFn(queryKey[0]),
      queryKey: [srcUrl],
      refetchOnWindowFocus: false,
      retry: false,
      gcTime: Infinity,
      refetchOnMount: false,
      enabled: Boolean(srcUrl),
    });

    const LoadingAudio = isLoadingMetaData || isLoading;
    useEffect(() => {
      const newSound = new Audio();
      setSound(newSound);
      document.body.appendChild(newSound);
    }, []);

    useEffect(() => {
      return () => {
        try {
          if (sound) {
            sound?.pause();
          }
        } catch (err) {
          console.error(err);
        }
      };
    }, [sound]);

    useEffect(() => {
      if (canvasRef.current && audioBuffer) {
        canvasRef.current.addEventListener('mousedown', enableSetDragging);
        canvasRef.current.addEventListener('mouseup', disableSetDragging);
        canvasRef.current.addEventListener('mousemove', getClickPosition);
        canvasRef.current.addEventListener('click', getClickPosition);
      }
      return () => {
        canvasRef?.current?.removeEventListener('mousedown', enableSetDragging);
        canvasRef?.current?.removeEventListener('mouseup', disableSetDragging);
        canvasRef?.current?.removeEventListener('mousemove', getClickPosition);
        canvasRef?.current?.removeEventListener('click', getClickPosition);
      };
    }, [canvasRef?.current, audioBuffer, isDragging]);

    useEffect(() => {
      if (fileData?.size) {
        (async () => {
          try {
            const file = new File([fileData], `greetingRecording.mp3`, {
              type: fileData.type,
              lastModified: Date.now(),
              size: fileData.size,
            });
            setFile(file);
            setIsBrokenFile(false);
          } catch (err) {
            console.error(err);
            setIsBrokenFile(true);
            setIsLoadingMetaData(false);
          }
        })();
      } else {
        setIsBrokenFile(true);
      }
    }, [fileData]);

    useEffect(() => {
      if (srcfile) {
        setFile(srcfile);
        return;
      }
    }, [fileVal]);

    useEffect(() => {
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const arrayBuffer = event.target.result;
          audioContext
            .decodeAudioData(arrayBuffer)
            .then((decodeAudioData) => {
              setTotalDuration(Math.ceil(decodeAudioData.duration));
              setAudioBuffer(decodeAudioData);
              sound.src = URL.createObjectURL(file);
              setIsLoadingMetaData(false);
              setIsBrokenFile(false);
            })
            .catch((err) => {
              console.error(err);
              setIsBrokenFile(true);
              setIsLoadingMetaData(false);
            });
        };
        reader.readAsArrayBuffer(file);
      }
    }, [file]);

    useEffect(() => {
      if (!LoadingAudio && audioBuffer) {
        tick(audioBuffer);
      }
    }, [LoadingAudio, audioBuffer]);

    function getClickPosition(event) {
      event.stopPropagation();
      event.preventDefault();
      if (minimal) return;
      if (!isDragging && event.type !== 'click') return;
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
      if (minimal) return;
      setIsDragging(true);
    }
    function disableSetDragging(e) {
      e.stopPropagation();
      e.preventDefault();
      if (minimal) return;
      setIsDragging(false);
    }
    function tick(decodeAudioData) {
      if (minimal) return;
      const number_of_bars = Math.floor(
        canvasRef?.current?.width / (barWidth + gap),
      );
      const { duration, sampleRate } = decodeAudioData;
      const perBarDataDuration = duration / number_of_bars;

      const audioLevels = [];
      const channelData = decodeAudioData?.getChannelData(0);

      for (let i = 0; i < duration; i = i + perBarDataDuration) {
        const startSample = Math.floor(i * sampleRate);
        const endSample = Math.min(
          Math.floor((i + perBarDataDuration) * sampleRate),
          channelData.length,
        );
        let sumSquared = 0;
        for (let j = startSample; j < endSample; j++) {
          sumSquared += channelData[j] ** 2;
        }
        const rms = Math.sqrt(sumSquared / (endSample - startSample));
        audioLevels.push(rms);
      }
      setAudioLevels(audioLevels);
      drawAudioLevel(audioLevels);
    }

    function fillAudioLevel({ fillX = 0 }) {
      if (minimal) return;
      const dataParam = audioLevels;
      const context = canvasRef?.current?.getContext('2d');
      if (!context) return;
      context.lineWidth = 1;
      context.clearRect(
        0,
        0,
        canvasRef?.current?.width,
        canvasRef?.current?.height,
      );
      let x = 0;
      const drawableHeight = canvasRef?.current?.height;
      const max = Math.max(...dataParam);
      dataParam.forEach((value) => {
        const valueHeight = Math.max((value * drawableHeight) / max, 2);
        const ystart = (drawableHeight - valueHeight) / 2;
        context.moveTo(0, 0);
        if (fillX < x) {
          context.fillStyle = '#CACED3';
        } else {
          context.fillStyle = barColor;
        }
        context.fillRect(x, ystart, barWidth, valueHeight);
        x = x + barWidth + gap;
      });
    }

    function drawAudioLevel(dataParam = []) {
      if (minimal) return;
      const context = canvasRef?.current?.getContext('2d');
      if (!context) return;
      context.lineWidth = 1;
      context.clearRect(
        0,
        0,
        canvasRef?.current?.width,
        canvasRef?.current?.height,
      );
      let x = 0;
      const drawableHeight = canvasRef?.current?.height;
      const max = Math.max(...dataParam);
      dataParam.forEach((value) => {
        const valueHeight = Math.max((value * drawableHeight) / max, 2);
        const ystart = (drawableHeight - valueHeight) / 2;
        context.moveTo(0, 0);
        context.fillStyle = '#CACED3';
        context.fillRect(x, ystart, barWidth, valueHeight);
        x = x + barWidth + gap;
      });
    }

    function playFn() {
      try {
        if (!isPlaying) {
          const audioElements = document.querySelectorAll('audio') || [];
          audioElements?.forEach(function (audio) {
            audio?.pause();
          });
          setIsPlaying(true);
          sound.onended = () => {
            cancelAnimationFrame(rafId);
            setIsPlaying(false);
            setCurrentTime(0);
            fillAudioLevel({ fillX: 0 });
          };
          sound.onpause = () => {
            setIsPlaying(false);
          };
          sound.play();
          rafId = window.requestAnimationFrame(() => Timer(sound));
        } else {
          sound.pause();
          setIsPlaying(false);
          cancelAnimationFrame(rafId);
        }
      } catch (error) {
        console.log(error);
      }
    }

    function Timer(playAudioContext) {
      rafId = window.requestAnimationFrame(() => Timer(playAudioContext));
      const currentTime = playAudioContext.currentTime || 0;
      setCurrentTime(Math.floor(currentTime));
      const totalDuration = audioBuffer?.duration || 0;
      const x = (currentTime * canvasRef?.current?.width) / totalDuration;
      if (minimal) {
        drawMinimalTimer(currentTime, totalDuration);
      } else {
        fillAudioLevel({ fillX: x });
      }
    }

    function drawMinimalTimer(currentTime, totalDuration) {
      const context = minimalCanvasRef?.current?.getContext('2d');
      if (!context) return;
      context.clearRect(
        0,
        0,
        minimalCanvasRef?.current?.width,
        minimalCanvasRef?.current?.height,
      );
      context.lineWidth = 1;
      context.beginPath();
      context.strokeStyle = 'grey';
      context.arc(
        minimalCanvasRef?.current?.width / 2,
        minimalCanvasRef?.current?.width / 2,
        minimalCanvasRef?.current?.width / 2 - 2,
        0,
        2 * Math.PI,
      );
      context.stroke();
      context.lineWidth = 2;
      context.beginPath();
      context.arc(
        minimalCanvasRef?.current?.width / 2,
        minimalCanvasRef?.current?.width / 2,
        minimalCanvasRef?.current?.width / 2 - 2,
        4.71239,
        2 * Math.PI * (currentTime / totalDuration) + 4.71239,
      );
      context.strokeStyle = 'green';
      context.stroke();
    }
    if (LoadingAudio) return <LoadingItem />;
    if (isBrokenFile)
      return <div className="text-danger">Unable to load audio file</div>;
    return (
      <>
        {minimal ? (
          <span
            className="cursor-pointer relative flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              playFn();
            }}
          >
            <canvas width={50} height={50} ref={minimalCanvasRef}></canvas>
            <div className="absolute ">
              {isPlaying ? (
                <Pause className="text-green w-6 h-6" />
              ) : (
                <Play className="text-green w-6 h-6" />
              )}
            </div>
          </span>
        ) : (
          <div className="w-full flex items-center  gap-4 ">
            {withIcon && (
              <span className="bg-green-100 min-w-[40px] h-10 rounded-full text-green flex items-center justify-center">
                <MusicNote />
              </span>
            )}
            <span
              className="bg-green-100 xxl:min-w-[40px] xl:min-w-[40px] lg:min-w-[40px] md:min-w-[35px] sm:min-w-[35px] xs:min-w-[35px] xxl:h-[40px] xl:h-[40px] lg:h-[40px] md:h-[35px] sm:h-[35px] xs:h-[35px] rounded-full text-green flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                playFn();
              }}
            >
              {isPlaying ? <Pause className="w-[22px] h-[22px]" /> : <Play />}
            </span>
            {filename && (
              <div className=" text-sm font-medium whitespace-nowrap	min-w-[105px]">
                <EllipsisTextWithTooltip charLength={15} string={filename} />
              </div>
            )}
            <canvas
              className="cursor-pointer"
              width={width}
              height={height}
              ref={canvasRef}
            ></canvas>
            <div className="flex items-center gap-4 justify-end">
              {downloadOption && (
                <span
                  className="cursor-pointer text-green"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    downloadFile(file);
                  }}
                >
                  <Download />
                </span>
              )}
              <span className="font-medium text-sm text-grey-600 min-w-[60px] flex justify-center items-center">
                {secondsToHHMMSS(totalDuration - currentTime)}
              </span>
            </div>
          </div>
        )}
      </>
    );
  },
);

CustomAudioPlayer.displayName = 'CustomAudioPlayer';
export default CustomAudioPlayer;
