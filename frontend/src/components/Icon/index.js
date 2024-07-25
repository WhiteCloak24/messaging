import React, { useEffect, useRef } from "react";

let interval;
const Icon = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    interval = setInterval(() => {
      const num = Math.random();
      drawIcon(num);
    }, 800);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function drawIcon(num) {
    const context = canvasRef.current.getContext("2d");
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Center coordinates
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;

    context.fillStyle = "#000000";
    context.lineWidth = 10;
    const lineShift = canvasWidth / 10;
    const totalHeight = 2 * lineShift + canvasHeight / 4;
    const volume = 0.8;
    const height = volume * totalHeight;

    context.beginPath();
    context.moveTo(centerX - lineShift, centerY);
    context.lineTo(centerX - lineShift, centerY - canvasHeight / 4);

    context.arc(centerX, centerY - canvasHeight / 4, lineShift, Math.PI, 0, false);

    context.lineTo(centerX + lineShift, centerY);

    context.arc(centerX, centerY, lineShift, 0, Math.PI, false);

    context.stroke();
    context.closePath();

    const startRatio = Math.min(1, height / lineShift);
    const endRatio = 1 - startRatio;
    context.beginPath();
    // context.arc(centerX, centerY, Math.min(lineShift, height), endRatio * Math.PI, startRatio * Math.PI, false);
    // context.fill();
    context.closePath();
    if (height > lineShift) {
      const barHeight = Math.min(height - lineShift, canvasHeight / 4);
      context.beginPath();
      // context.fillRect(centerX - lineShift, centerY, 2 * lineShift, -barHeight);
      context.closePath();
    }

    if (height > totalHeight - lineShift) {
      context.beginPath();
      context.arc(centerX, centerY - canvasHeight / 4, lineShift - 5, Math.PI, 0, false);
      context.fillStyle = "white";
      context.fill();
      context.closePath();
      context.beginPath();
      const arcHeight = height - lineShift - canvasHeight / 4;
      const startRatio = Math.min(1, arcHeight / lineShift) / 2;
      const endRatio = 0.5 - startRatio;
      const startAngle = (1 + startRatio) * Math.PI;
      const endAngle = 0 * Math.PI;
      console.log({ startAngle, endAngle });
      context.arc(centerX, centerY - canvasHeight / 4, lineShift - 5, startAngle, endAngle, false);
      context.fillStyle = "black";
      context.fill();
      context.closePath();
    }

    // Base Arc
    context.lineWidth = 10;
    context.beginPath();
    context.arc(centerX, centerY, lineShift + 40, Math.PI, 0, true);
    context.stroke();
    context.closePath();
  }
  return <canvas ref={canvasRef} width={500} height={500} className="border" />;
};

export default Icon;
