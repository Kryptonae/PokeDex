export function DiaTextReveal({ text, children, className = "" }) {
  if (children) {
    return (
      <span
        aria-label={text}
        className={`dia-text-reveal-container inline-block ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span aria-label={text} className={`inline-block ${className}`}>
      {text.split("").map((character, index) => (
        <span
          aria-hidden="true"
          className="dia-text-reveal-char"
          key={`${character}-${index}`}
          style={{ "--dia-delay": `${index * 35}ms` }}
        >
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
    </span>
  );
}
