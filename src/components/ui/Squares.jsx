import { useRef, useEffect } from "react";

const Squares = ({
  direction = "right",
  speed = 1,
  borderColor = "rgba(255, 255, 255, 0.1)",
  squareSize = 40,
  hoverFillColor = "rgba(255, 255, 255, 0.05)",
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquareRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas, { passive: true });
    resizeCanvas();

    const draw = (timestamp) => {
      if (!ctx || canvas.width === 0 || canvas.height === 0) return;

      timeRef.current = timestamp / 5000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const angle = timeRef.current;
      const r = canvas.width * 0.75;

      const x1 = canvas.width / 2 + Math.cos(angle) * r;
      const y1 = canvas.height / 2 + Math.sin(angle) * r;
      const x2 = canvas.width / 2 - Math.cos(angle) * r;
      const y2 = canvas.height / 2 - Math.sin(angle) * r;

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, "#000428");
      gradient.addColorStop(1, "#002545ff");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          if (
            hoveredSquareRef.current &&
            Math.floor((x - startX) / squareSize) === hoveredSquareRef.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }
    };

    const updateAnimation = (timestamp) => {
      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case "right":
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case "left":
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case "up":
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case "down":
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case "diagonal":
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

      draw(timestamp);
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    // Ambil posisi mouse langsung dari koordinat viewport tanpa getBoundingClientRect
    const handleMouseMove = (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      if (
        mouseX < 0 ||
        mouseX > window.innerWidth ||
        mouseY < 0 ||
        mouseY > window.innerHeight
      ) {
        hoveredSquareRef.current = null;
        return;
      }

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);

      if (
        !hoveredSquareRef.current ||
        hoveredSquareRef.current.x !== hoveredSquareX ||
        hoveredSquareRef.current.y !== hoveredSquareY
      ) {
        hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseout", handleMouseLeave, { passive: true });

    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full border-none block"
    ></canvas>
  );
};

export default Squares;
