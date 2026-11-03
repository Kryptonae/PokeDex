
import { createContext, useContext, useMemo } from "react";

const FlipCardContext = createContext(null);

const ROTATION_CLASS = {
  x: {
    hover: "group-hover/card:rotate-x-180 group-focus/card:rotate-x-180",
    back: "rotate-x-180",
  },
  y: {
    hover: "group-hover/card:rotate-y-180 group-focus/card:rotate-y-180",
    back: "rotate-y-180",
  },
};

function useFlipCard() {
  const context = useContext(FlipCardContext);

  if (!context) {
    throw new Error(
      "FlipCard.Front and FlipCard.Back must be used within FlipCard."
    );
  }

  return context;
}

// Main FlipCard
function FlipCardRoot({
  rotate = "y",
  className = "",
  children,
  ...props
}) {
  const value = useMemo(() => ({ rotate }), [rotate]);

  return (
    <FlipCardContext.Provider value={value}>
      <div
        className={`group/card perspective-[1000px] ${
          className || "h-72 w-56"
        }`}
        {...props}
      >
        <div
          className={`relative h-full rounded-2xl transition-transform duration-500 ease-out transform-3d will-change-transform motion-reduce:transition-none ${
            ROTATION_CLASS[rotate].hover
          }`}
        >
          {children}
        </div>
      </div>
    </FlipCardContext.Provider>
  );
}

// Front Face
function FlipCardFront({ className = "", ...props }) {
  useFlipCard();

  return (
    <div
      className={`absolute inset-0 backface-hidden ${className}`}
      {...props}
    />
  );
}

// Back Face
function FlipCardBack({ className = "", ...props }) {
  const { rotate } = useFlipCard();

  return (
    <div
      className={`absolute inset-0 backface-hidden ${
        ROTATION_CLASS[rotate].back
      } ${className}`}
      {...props}
    />
  );
}

// Compound Component
const FlipCard = Object.assign(FlipCardRoot, {
  Front: FlipCardFront,
  Back: FlipCardBack,
});

export default FlipCard;
export { FlipCard, FlipCardBack, FlipCardFront, FlipCardRoot };