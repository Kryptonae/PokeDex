export function KineticText({
  text,
  as: Tag = "h1",
  className = "",
  style,
  ...rest
}) {
  const mergedStyle = {
    "--hover-padding": "calc(1em / 12)",
    ...style,
  };

  return (
    <Tag
      {...rest}
      aria-label={text}
      className={`kinetic-text flex flex-nowrap justify-center font-light text-indigo-600 ${className}`}
      style={mergedStyle}
    >
      {text.split("").map((character, index) => (
        <span
          aria-hidden="true"
          className="kinetic-text-character"
          key={`${character}-${index}`}
        >
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
