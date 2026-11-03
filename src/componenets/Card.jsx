import FlipCard from "./animata/card/flip-card";
import PokemonStats from "./ui/PokemonStats";

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

function Card({ pokemon }) {
  if (!pokemon) {
    return null;
  }

  return (
    <FlipCard rotate="y" className="h-96 w-64 sm:w-72">
      {/* Front Side */}
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
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          loading="lazy"
          decoding="async"
          className="my-4 min-h-0 flex-1 w-full object-contain drop-shadow-2xl"
        />
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

      {/* Back Side */}
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

        <PokemonStats stats={pokemon.stats} />
      </FlipCard.Back>
    </FlipCard>
  );
}

export default Card;
