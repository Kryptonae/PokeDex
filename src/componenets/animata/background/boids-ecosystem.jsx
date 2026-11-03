import { useEffect, useRef } from "react";

const DEFAULT_PALETTE = ["#f5f5f4", "#fde68a", "#93c5fd", "#fca5a5"];

export default function BoidsEcosystem({
  count = 120,
  background = "#0b0b12",
  palette = DEFAULT_PALETTE,
  cursorRadius = 90,
  attractors,
  agentsRef,
  agentShape = "triangle",
  className = "",
  children,
}) {
  const canvasRef = useRef(null);

  const cursorRef = useRef({
    x: 0,
    y: 0,
    active: false,
  });

  const liveRef = useRef({
    palette,
    cursorRadius,
    attractors,
    agentShape,
  });

  liveRef.current = {
    palette,
    cursorRadius,
    attractors,
    agentShape,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const agents = [];

    // Canvas resizing
    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const w = () => canvas.width / dpr;
    const h = () => canvas.height / dpr;

    // Initialize agents
    const initialPalette = liveRef.current.palette;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 0.6;

      agents.push({
        x: Math.random() * w(),
        y: Math.random() * h(),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color:
          initialPalette[Math.floor(Math.random() * initialPalette.length)],
      });
    }

    if (agentsRef) {
      agentsRef.current = agents;
    }

    const perception = 36;
    const maxSpeed = 1.8;

    let animationFrame = 0;

    // Main animation loop
    const step = () => {
      const {
        cursorRadius: cr,
        attractors: atts,
        agentShape: shape,
      } = liveRef.current;

      const W = w();
      const H = h();

      // Fade previous frame to transparent so the themed CSS background shows
      // through. This also keeps theme switches instant without repainting the
      // whole canvas with the old background colour.
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.86)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      for (const a of agents) {
        let ax = 0;
        let ay = 0;

        let sx = 0;
        let sy = 0;

        let cx = 0;
        let cy = 0;

        let n = 0;

        // Boids flocking behavior
        for (const b of agents) {
          if (a === b) continue;

          const dx = b.x - a.x;
          const dy = b.y - a.y;

          const d2 = dx * dx + dy * dy;

          if (d2 < perception * perception) {
            ax += b.vx;
            ay += b.vy;

            cx += b.x;
            cy += b.y;

            if (d2 < 18 * 18 && d2 > 0.0001) {
              const d = Math.sqrt(d2);

              sx -= dx / d;
              sy -= dy / d;
            }

            n++;
          }
        }

        if (n > 0) {
          // Alignment
          a.vx += (ax / n - a.vx) * 0.04;
          a.vy += (ay / n - a.vy) * 0.04;

          // Cohesion
          a.vx += (cx / n - a.x) * 0.0006;
          a.vy += (cy / n - a.y) * 0.0006;

          // Separation
          a.vx += sx * 0.06;
          a.vy += sy * 0.06;
        }

        // Custom attractors
        if (atts?.length) {
          for (const att of atts) {
            const tx = att.x * W;
            const ty = att.y * H;

            const dx = tx - a.x;
            const dy = ty - a.y;

            const d = Math.hypot(dx, dy) || 1;
            const radius = att.radius ?? 220;

            if (d < radius) {
              const force = ((radius - d) / radius) * (att.strength ?? 0.05);

              a.vx += (dx / d) * force;
              a.vy += (dy / d) * force;
            }
          }
        }

        // Cursor interaction
        if (cursorRef.current.active) {
          const dx = a.x - cursorRef.current.x;
          const dy = a.y - cursorRef.current.y;

          const d = Math.hypot(dx, dy);

          if (d < cr && d > 0) {
            const force = (cr - d) / cr;

            a.vx += (dx / d) * force * 0.6;
            a.vy += (dy / d) * force * 0.6;
          }
        }

        // Limit maximum speed
        const speed = Math.hypot(a.vx, a.vy);

        if (speed > maxSpeed) {
          a.vx = (a.vx / speed) * maxSpeed;
          a.vy = (a.vy / speed) * maxSpeed;
        }

        // Update position
        a.x += a.vx;
        a.y += a.vy;

        // Wrap around canvas edges
        if (a.x < 0) a.x += W;
        if (a.x > W) a.x -= W;

        if (a.y < 0) a.y += H;
        if (a.y > H) a.y -= H;

        // Draw agents
        ctx.fillStyle = a.color;
        ctx.globalAlpha = 0.88;

        if (shape === "dot") {
          ctx.beginPath();
          ctx.arc(a.x, a.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const angle = Math.atan2(a.vy, a.vx);

          ctx.save();
          ctx.translate(a.x, a.y);
          ctx.rotate(angle);

          ctx.beginPath();
          ctx.moveTo(6, 0);
          ctx.lineTo(-4, 3);
          ctx.lineTo(-4, -3);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      }

      ctx.globalAlpha = 1;

      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);

    // Global mouse tracking
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      cursorRef.current.x = x;
      cursorRef.current.y = y;

      cursorRef.current.active =
        x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    };

    const onPageLeave = () => {
      cursorRef.current.active = false;
    };

    window.addEventListener("pointermove", onMove);

    document.documentElement.addEventListener("pointerleave", onPageLeave);

    window.addEventListener("blur", onPageLeave);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame);

      resizeObserver.disconnect();

      window.removeEventListener("pointermove", onMove);

      document.documentElement.removeEventListener("pointerleave", onPageLeave);

      window.removeEventListener("blur", onPageLeave);

      if (agentsRef) {
        agentsRef.current = null;
      }
    };
  }, [count, agentsRef]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ background }}
      />

      {children && (
        <div className="pointer-events-none relative z-10 flex h-full items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}