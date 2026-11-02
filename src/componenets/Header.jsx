
import { motion } from "framer-motion";
import { useState } from "react";

const navItems = [
  { id: 1, label: "Home", href: "#home" },
  { id: 2, label: "Explore", href: "#explore" },
  { id: 3, label: "About", href: "#about" },
];

function Header() {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <header className="relative z-10 mx-2 max-w-6xl rounded-4xl border-b border-slate-200 bg-white/10 backdrop-blur-md sm:mx-auto">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-4 sm:px-6">

        {/* Logo */}
        <a
          className="shrink-0 text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
          href="/"
        >
          PokéDex
        </a>

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
                  className="relative isolate flex items-center rounded-full px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors duration-200 hover:text-slate-800 sm:px-4 sm:text-sm"
                  href={navItem.href}
                  onMouseEnter={() => setHoveredItem(navItem.id)}
                  onFocus={() => setHoveredItem(navItem.id)}
                >
                  {/* Original Hover Animation */}
                  {hoveredItem === navItem.id && (
                    <motion.span
                      className="pointer-events-none absolute inset-0 z-0 rounded-full bg-slate-200/60"
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
                  <span className="relative z-10">
                    {navItem.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </header>
  );
}

export default Header;
