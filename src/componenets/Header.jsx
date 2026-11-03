import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import { useTheme } from "./use-theme";

const navItems = [
  { id: 1, label: "Home", href: "#home" },
  { id: 2, label: "Explore", href: "#explore" },
  { id: 3, label: "About", href: "#about" },
];

function Header() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const { theme, setTheme } = useTheme();

  return (
    <header className="relative z-10 mx-2 max-w-6xl rounded-4xl border-b border-slate-200 bg-white/10 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/40 sm:mx-auto">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-4 sm:px-6">
        {/* Logo */}
        {/* BASE_URL resolves to "/" in development and "/PokeDex/" in the
            production build, so the logo keeps working on GitHub Pages. */}
        <a
          className="shrink-0 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl"
          href={import.meta.env.BASE_URL}
        >
          <span className="text-orange-600 dark:text-orange-400">Poké</span>Dex
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Navigation */}
          <nav
            aria-label="Main navigation"
            onMouseLeave={() => setHoveredItem(null)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setHoveredItem(null);
              }
            }}
          >
            <ul className="flex items-center gap-0 sm:gap-1">
              {navItems.map((navItem) => (
                <li className="relative" key={navItem.id}>
                  <a
                    className="relative isolate flex items-center rounded-full px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors duration-200 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white sm:px-4 sm:text-sm"
                    href={navItem.href}
                    onMouseEnter={() => setHoveredItem(navItem.id)}
                    onFocus={() => setHoveredItem(navItem.id)}
                  >
                    {/* Original Hover Animation */}
                    {hoveredItem === navItem.id && (
                      <motion.span
                        className="pointer-events-none absolute inset-0 z-0 rounded-full bg-slate-200/60 dark:bg-white/10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        layoutId="header-hover"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Navigation Text */}
                    <span className="relative z-10">{navItem.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <AnimatedThemeToggler
            theme={theme}
            onThemeChange={setTheme}
            duration={500}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20 dark:hover:text-white dark:focus-visible:outline-indigo-400"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
