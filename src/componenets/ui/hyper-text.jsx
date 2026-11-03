import { useRef, useState } from "react";

const RANDOM_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function getRandomCharacter() {
  return RANDOM_CHARACTERS[
    Math.floor(Math.random() * RANDOM_CHARACTERS.length)
  ];
}

export function HyperText({ children, className = "", speed = 35 }) {
  const text = String(children);
  const [displayText, setDisplayText] = useState(text);
  const animationRef = useRef(null);

  const handleMouseEnter = () => {
    if (animationRef.current) {
      window.clearInterval(animationRef.current);
    }

    let revealedCount = 0;

    animationRef.current = window.setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((character, index) => {
            if (character === " " || index < revealedCount) {
              return character;
            }

            return getRandomCharacter();
          })
          .join(""),
      );

      revealedCount += 1;

      if (revealedCount > text.length) {
        window.clearInterval(animationRef.current);
        animationRef.current = null;
        setDisplayText(text);
      }
    }, speed);
  };

  return (
    <span
      aria-label={text}
      className={`relative inline-block align-baseline ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {displayText}
      </span>
    </span>
  );
}
