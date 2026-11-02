import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

const RANDOM_CHARS = "_!X$0-+*#";

function getRandomChar(prevChar) {
  let char;

  do {
    char = RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
  } while (char === prevChar);

  return char;
}

export function SpecialText({
  children,
  speed = 20,
  delay = 0,
  className = "",
  inView = false,
  once = true,
}) {
  const containerRef = useRef(null);

  const isInView = useInView(containerRef, {
    once,
    margin: "-100px",
  });

  const shouldAnimate = inView ? isInView : true;
  const text = children;

  const [displayText, setDisplayText] = useState(() => " ".repeat(text.length));

  useEffect(() => {
    setDisplayText(" ".repeat(text.length));

    if (!shouldAnimate) return;

    let phase = 1;
    let step = 0;
    let intervalId = null;

    if (!text.length) {
      setDisplayText("");
      return;
    }

    const runAnimation = () => {
      if (phase === 1) {
        const currentLength = Math.min(step + 1, text.length);

        const chars = [];

        for (let i = 0; i < currentLength; i++) {
          const prevChar = i > 0 ? chars[i - 1] : undefined;
          chars.push(getRandomChar(prevChar));
        }

        for (let i = currentLength; i < text.length; i++) {
          chars.push("\u00A0");
        }

        setDisplayText(chars.join(""));

        step++;

        if (step >= text.length * 2) {
          phase = 2;
          step = 0;
        }
      } else {
        const revealedCount = Math.floor(step / 2);
        const chars = [];

        for (let i = 0; i < revealedCount; i++) {
          chars.push(text[i]);
        }

        if (revealedCount < text.length) {
          chars.push(step % 2 === 0 ? "_" : getRandomChar());
        }

        for (let i = chars.length; i < text.length; i++) {
          chars.push(getRandomChar());
        }

        setDisplayText(chars.join(""));

        step++;

        if (step >= text.length * 2) {
          setDisplayText(text);
          window.clearInterval(intervalId);
          intervalId = null;
        }
      }
    };

    const startTimeout = window.setTimeout(
      () => {
        intervalId = window.setInterval(runAnimation, Math.max(1, speed));
      },
      Math.max(0, delay * 1000),
    );

    return () => {
      window.clearTimeout(startTimeout);

      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [text, speed, delay, shouldAnimate]);

  return (
    <span
      ref={containerRef}
      aria-label={text}
      className={`inline-block whitespace-pre font-mono font-medium ${className}`}
    >
      {displayText}
    </span>
  );
}
