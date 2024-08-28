"use client";
import React, { useEffect, useRef } from "react";
interface Point {
  x: number;
  y: number;
  baseX: number;
  speed: number;
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    console.log("Component mounted");
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Unable to get 2D context");
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);
      initializePoints();
    };

    const initializePoints = () => {
      const numPoints = 50;
      pointsRef.current = [];
      for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * canvas.width;
        const y = (Math.random() * canvas.height) / 2 + canvas.height / 2;
        pointsRef.current.push({
          x,
          y,
          baseX: x,
          speed: 0.1 + Math.random() * 0.2,
        });
      }
      console.log(`Initialized ${numPoints} points`);
    };

    const drawBackground = (time: number) => {
      if (!canvas || !ctx) {
        console.error("Canvas or context not available in animation frame");
        return;
      }

      // Fill the entire canvas with black
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set up clipping region for bottom half
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, canvas.height / 2, canvas.width, canvas.height / 2);
      ctx.clip();

      // Update point positions
      pointsRef.current.forEach((point) => {
        point.x = point.baseX + Math.sin(time * 0.001 * point.speed) * 20;
      });

      // Draw connections
      ctx.strokeStyle = "rgb(247,147,26)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < pointsRef.current.length; i++) {
        for (let j = i + 1; j < pointsRef.current.length; j++) {
          const dx = pointsRef.current[i].x - pointsRef.current[j].x;
          const dy = pointsRef.current[i].y - pointsRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(pointsRef.current[i].x, pointsRef.current[i].y);
            ctx.lineTo(pointsRef.current[j].x, pointsRef.current[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = "purple";
      pointsRef.current.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animationRef.current = requestAnimationFrame(drawBackground);
    };

    try {
      resizeCanvas();
      animationRef.current = requestAnimationFrame(drawBackground);

      window.addEventListener("resize", resizeCanvas);

      console.log("Animation started");
    } catch (error) {
      console.error("Error in animation setup:", error);
    }

    return () => {
      console.log("Component unmounting");
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
}
