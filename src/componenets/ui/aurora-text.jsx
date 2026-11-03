import { Fragment, memo } from "react";

const DEFAULT_COLORS = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"];

function getContent(children, text) {
  if (typeof text === "string" || typeof text === "number") {
    return String(text);
  }

  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  return null;
}

export const AuroraText = memo(function AuroraText({
  children,
  text,
  className = "",
  colors = DEFAULT_COLORS,
  speed = 1,
  weight = 300,
  style,
  ...rest
}) {
  const content = getContent(children, text);
  const tokens = content === null ? [] : content.split(/(\s+)/).filter(Boolean);

  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]})`,
    backgroundSize: "200% auto",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: weight,
    animationDuration: `${10 / Math.max(speed, 0.01)}s`,
  };

  const kineticStyle = {
    "--hover-padding": "calc(1em / 12)",
    ...style,
  };

  return (
    <span
      {...rest}
      className={`aurora-text relative inline-block ${className}`}
      style={kineticStyle}
    >
      <span className="sr-only">{content ?? children}</span>

      <span
        aria-hidden="true"
        className="animate-aurora relative inline-block motion-reduce:animate-none"
        style={gradientStyle}
      >
        {content === null
          ? children
          : tokens.map((token, tokenIndex) => {
              if (/^\s+$/.test(token)) {
                return (
                  <Fragment key={`space-${tokenIndex}`}>{token}</Fragment>
                );
              }

              return (
                <span className="aurora-text-word" key={`word-${tokenIndex}`}>
                  {Array.from(token).map((character, characterIndex) => (
                    <span
                      className="kinetic-text-character"
                      key={`${character}-${characterIndex}`}
                    >
                      {character}
                    </span>
                  ))}
                </span>
              );
            })}
      </span>
    </span>
  );
});

AuroraText.displayName = "AuroraText";
