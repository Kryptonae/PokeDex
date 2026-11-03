import { useState } from "react";
import FlipCard from "./animata/card/flip-card";
import PokemonStats from "./ui/PokemonStats";

// Colour palette for the type chips. Keys match PokéAPI type names, so an
// unknown type safely falls back to the neutral "normal" style.
const typeStyles = {
  normal: "bg-stone-500 border-stone-400",
  fire: "bg-orange-500 border-orange-400",
  water: "bg-blue-500 border-blue-400",
  electric: "bg-yellow-400 border-yellow-300 text-slate-900",
  grass: "bg-green-500 border-green-400",
  ice: "bg-cyan-400 border-cyan-300 text-slate-900",
  fighting: "bg-red-600 border-red-500",
  poison: "bg-purple-500 border-purple-400",
  ground: "bg-amber-600 border-amber-500",
  flying: "bg-sky-400 border-sky-300 text-slate-900",
  psychic: "bg-pink-500 border-pink-400",
  bug: "bg-lime-500 border-lime-400 text-slate-900",
  rock: "bg-yellow-700 border-yellow-600",
  ghost: "bg-indigo-700 border-indigo-600",
  dragon: "bg-violet-600 border-violet-500",
  dark: "bg-slate-800 border-slate-700",
  steel: "bg-slate-500 border-slate-400",
  fairy: "bg-pink-300 border-pink-200 text-slate-900",
};

function Card({ pokemon, priority = false }) {
  // The skeleton is visible until the artwork (or its sprite fallback) loads.
  const [imageState, setImageState] = useState("loading");

  if (!pokemon) {
    return null;
  }

  // Prefer the high-resolution official artwork. Older or incomplete Pokémon
  // entries may only have a front sprite, so use that as a fallback.
  const artwork =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default;
  const fallbackArtwork = pokemon.sprites?.front_default;
  const stats = pokemon.stats ?? [];
  const totalStats = stats.reduce((total, stat) => total + stat.base_stat, 0);
  const height = typeof pokemon.height === "number"
    ? `${(pokemon.height / 10).toFixed(1)} m`
    : "—";
  const weight = typeof pokemon.weight === "number"
    ? `${(pokemon.weight / 10).toFixed(1)} kg`
    : "—";

  // If the primary image fails, retry once with the sprite before hiding the
  // broken image so the card layout stays intact.
  const handleArtworkError = (event) => {
    const image = event.currentTarget;
    if (
      fallbackArtwork &&
      !image.dataset.fallbackApplied &&
      image.src !== fallbackArtwork
    ) {
      image.dataset.fallbackApplied = "true";
      image.src = fallbackArtwork;
      return;
    }

    image.hidden = true;
    setImageState("error");
  };

  return (
    // The wrapper is focusable so keyboard users can trigger the same flip
    // effect that pointer users get on hover.
    <FlipCard
      rotate="y"
      className="h-96 w-64 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950 sm:w-72"
      role="group"
      aria-label={`${pokemon.name} Pokémon card`}
      tabIndex={0}
    >
      {/* Front: identity, artwork, and type chips. */}
      <FlipCard.Front
        className="flex h-full flex-col overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-indigo-950 to-indigo-700 p-6 text-white shadow-2xl shadow-indigo-300/40 dark:shadow-black/50 dark:ring-1 dark:ring-white/10"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Pokémon
            </p>
            <h2 className="mt-1 text-3xl font-bold capitalize">{pokemon.name}</h2>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold text-white/80">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
        </div>
        <div className="relative my-4 flex min-h-0 w-full flex-1 items-center justify-center">
          {artwork && imageState === "loading" && (
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Lightweight Poké Ball placeholder while the image downloads. */}
              <div className="relative h-20 w-20 animate-pulse rounded-full border-4 border-white/15 bg-white/5 motion-reduce:animate-none">
                <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/20" />
                <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/20 bg-slate-900/40" />
              </div>
            </div>
          )}

          {artwork ? (
            <img
              src={artwork}
              data-fallback={fallbackArtwork}
              onLoad={() => setImageState("loaded")}
              onError={handleArtworkError}
              alt={`${pokemon.name} artwork`}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : undefined}
              decoding="async"
              draggable={false}
              width={475}
              height={475}
              className={`h-full w-full object-contain drop-shadow-2xl transition-opacity duration-500 ${
                imageState === "loaded" ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
            <span className="text-xs font-medium uppercase tracking-widest text-white/50">
              No artwork
            </span>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold capitalize shadow-sm ${typeStyles[type.type.name] || typeStyles.normal}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </FlipCard.Front>

      {/* Back: base stats, shown when the card is hovered or focused. */}
      <FlipCard.Back className="flex h-full min-h-0 flex-col overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl shadow-slate-900/10 dark:bg-slate-900 dark:shadow-black/40 dark:ring-1 dark:ring-white/10">
        <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Base stats
            </p>
            <h2 className="mt-1 text-2xl font-bold capitalize text-slate-900 dark:text-slate-100">
              {pokemon.name}
            </h2>
          </div>
          <span className="text-3xl">✦</span>
        </div>

        {/* Compact physical summary keeps the back useful without scrolling. */}
        <div className="mb-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-slate-100 px-1 py-2 dark:bg-white/5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Height
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-slate-100">
              {height}
            </p>
          </div>
          <div className="rounded-xl bg-slate-100 px-1 py-2 dark:bg-white/5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Weight
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-slate-100">
              {weight}
            </p>
          </div>
          <div className="rounded-xl bg-slate-100 px-1 py-2 dark:bg-white/5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-slate-100">
              {totalStats}
            </p>
          </div>
        </div>

        <PokemonStats stats={stats} />
      </FlipCard.Back>
    </FlipCard>
  );
}

export default Card;
