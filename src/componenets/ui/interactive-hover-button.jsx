function InteractiveHoverButton({
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`group relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-orange-600 text-gray-50 px-6 py-3 text-sm font-semibold shadow-sm transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:focus-visible:outline-indigo-400 ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-indigo-600 transition-transform duration-300 group-hover:translate-x-0 group-disabled:translate-x-full"
      />
    </button>
  );
}

export { InteractiveHoverButton };
