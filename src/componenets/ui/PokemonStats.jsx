import { memo } from "react";

const statColors = {
  hp: "bg-emerald-500",
  attack: "bg-rose-500",
  defense: "bg-amber-500",
  "special-attack": "bg-violet-500",
  "special-defense": "bg-sky-500",
  speed: "bg-pink-500",
};

const statLabels = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

function PokemonStats({ stats = [] }) {
  return (
    <div className="flex min-h-0 w-full flex-col gap-1.5">
      {stats.map((item) => {
        const statName = item.stat.name;
        const statValue = item.base_stat;
        const percentage = Math.min((statValue / 255) * 100, 100);

        return (
          <div key={statName} className="flex flex-col gap-1">
            {/* Stat Name and Value */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {statLabels[statName] || statName.replaceAll("-", " ")}
              </span>

              <span className="font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {statValue}
              </span>
            </div>

            {/* Progress Bar */}
            <div
              role="progressbar"
              aria-label={statLabels[statName] || statName}
              aria-valuenow={statValue}
              aria-valuemin={0}
              aria-valuemax={255}
              className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700/70"
            >
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                  statColors[statName] || "bg-indigo-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(PokemonStats);
