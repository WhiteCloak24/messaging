import React, { useRef, useEffect, useCallback } from "react";

const HomeIconCanvas = ({ size = 400 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(canvas.offsetWidth / 2, canvas.offsetHeight / 2, canvas.offsetWidth / 2 - 10, 0.8 * Math.PI, 2.7 * Math.PI); // Incomplete circle arc
    ctx.lineTo(10, canvas.offsetHeight - 10);
    const endX = canvas.offsetWidth / 2 + (canvas.offsetWidth / 2 - 10) * Math.cos(0.8 * Math.PI);
    const endY = canvas.offsetHeight / 2 + (canvas.offsetHeight / 2 - 10) * Math.sin(0.8 * Math.PI);
    ctx.lineTo(endX + 1, endY - 4);
    ctx.stroke();

    // Draw the three dots inside the chat bubble
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const dotRadius = 10;
    const dotSpacing = 50;
    const dotsCenterY = centerY;
    ctx.fillStyle = "blue";
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(centerX + i * dotSpacing, dotsCenterY, dotRadius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, []);

  return <canvas ref={canvasRef} width={size} height={size} />;
};

export default HomeIconCanvas;
