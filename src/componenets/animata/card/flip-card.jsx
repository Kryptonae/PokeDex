import { createContext, useContext, useMemo } from "react";

// Front and Back read the chosen axis from context so both faces always
// rotate together.
const FlipCardContext = createContext(null);

// Tailwind classes for the two supported flip axes. The `back` class is
// applied to the hidden face so it starts facing away from the viewer.
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

// Outer wrapper owns the perspective; the inner element is the one that
// rotates. `group/card` lets both faces respond to hover and keyboard focus.
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

// Front face: visible by default.
function FlipCardFront({ className = "", ...props }) {
  useFlipCard();

  return (
    <div
      className={`absolute inset-0 backface-hidden ${className}`}
      {...props}
    />
  );
}

// Back face: pre-rotated 180° so it lands face-up when the card flips.
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

// Expose the faces as `FlipCard.Front` and `FlipCard.Back` while keeping a
// single default export for consumers.
const FlipCard = Object.assign(FlipCardRoot, {
  Front: FlipCardFront,
  Back: FlipCardBack,
});

export default FlipCard;
export { FlipCard, FlipCardBack, FlipCardFront, FlipCardRoot };