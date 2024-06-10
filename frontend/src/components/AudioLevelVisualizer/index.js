import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

let rafId;
let analyser;
let frequency_array;
let source;
let mediaRecorder;

let audioData = [];
let then = new Date().getTime();
let now = new Date().getTime();

const AudioVisualizer = ({
  getAudioBlob = () => null,
  width = 300,
  height = 50,
  gap = 2,
  barColour = "#6D8F50",
  fromMic = true,
  barWidth = 5,
}) => {
  const [stream, setStream] = useState(null);
  const canvasRef = useRef(null);
  const context = canvasRef?.current?.getContext("2d");


  useEffect(() => {
    if (stream) {
      const context = new window.AudioContext();
      analyser = context.createAnalyser();
      source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      frequency_array = new Uint8Array(analyser.frequencyBinCount);
      tick();
    }
  }, [stream]);

  const tick = () => {
    analyser.getByteTimeDomainData(frequency_array);
    const number_of_bars = Math.floor(
      canvasRef?.current?.width / (barWidth + gap)
    );

    rafId = window.requestAnimationFrame(tick);
    now = new Date().getTime();
    if (now - then > 20) {
      const newValue = Math.max(...frequency_array);
      if (audioData?.length > number_of_bars) {
        audioData = [...audioData.slice(1), newValue];
      } else {
        audioData = [...audioData, newValue];
      }
      drawMic(audioData);
      then = new Date().getTime();
    }
  };

  const drawMic = (dataParam = []) => {
    context.lineWidth = 1;
    context.clearRect(
      0,
      0,
      canvasRef?.current?.width,
      canvasRef?.current?.height
    );
    let x = 0;
    const drawableHeight = canvasRef?.current?.height;
    dataParam.forEach((value) => {
      const valueHeight = ((value - 97) / 158) * height;
      const ystart = (drawableHeight - valueHeight) / 2;
      context.moveTo(0, 0);
      context.fillStyle = barColour;
      context.fillRect(x, ystart, barWidth, valueHeight);
      x = x + barWidth + gap;
    });
  };


  return <canvas width={width} height={height} ref={canvasRef}></canvas>;
};

export default AudioVisualizer;
