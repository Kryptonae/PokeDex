import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Header from "./componenets/Header";
import { AuroraText } from "./componenets/ui/aurora-text";
import { DiaTextReveal } from "./componenets/ui/dia-text-reveal";
import { HyperText } from "./componenets/ui/hyper-text";
import { Particles } from "./componenets/ui/particles";
import { ShineBorder } from "./componenets/ui/shine-border";
import { InteractiveHoverButton } from "./componenets/ui/interactive-hover-button";
import { useTheme } from "./componenets/use-theme";
import Card from "./componenets/Card";
import Footer from "./componenets/Footer";

function App() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [inputValue, setInputValue] = useState("");
  const [searchError, setSearchError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Search Pokémon
  const handleSearch = async (e) => {
    e.preventDefault();

    const pokemonName = inputValue.trim().toLowerCase();

    if (!pokemonName) {
      setSearchError("Please enter a Pokémon name");
      return;
    }

    setSearchError(null);
    setIsSearching(true);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemonName)}`,
      );

      if (response.status === 404) {
        throw new Error(`Pokémon "${pokemonName}" not found`);
      }

      if (!response.ok) {
        throw new Error("Failed to fetch Pokémon data");
      }

      const jsonData = await response.json();
      setPokemonData(jsonData);

      console.log("Pokémon Data:", jsonData);
    } catch (error) {
      setSearchError(error.message);
      console.error("Search Error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextUrl || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const response = await fetch(nextUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch more Pokémon");
      }

      const data = await response.json();

      const newPokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);

          if (!detailResponse.ok) {
            throw new Error(`Failed to fetch ${pokemon.name}`);
          }

          return detailResponse.json();
        }),
      );

      setPokemonList((currentList) => [...currentList, ...newPokemonDetails]);

      setNextUrl(data.next);
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Pokémon list");
        }

        const data = await response.json();
        setNextUrl(data.next);

        console.log("List API response:", data);

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url);

            if (!detailResponse.ok) {
              throw new Error(`Failed to fetch ${pokemon.name}`);
            }

            return detailResponse.json();
          }),
        );

        setPokemonList(pokemonDetails);
      } catch (error) {
        console.error("List fetch error:", error);
      }
    };

    fetchPokemonList();
  }, []);

  return (
    <>
      <div className="relative isolate min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Full Website Background Animation */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
        >
          <Particles
            className="absolute inset-0"
            quantity={100}
            ease={80}
            color={isDark ? "#ffffff" : "#000000"}
            refresh
          />
        </div>

        {/* Website Content */}
        <div className="relative z-10">
          <Header />

          <main
            className="mx-auto max-w-6xl px-6 py-16 flex flex-col items-center justify-center text-center"
            id="home"
          >
            <h1 className="mb-3 text-balance text-5xl uppercase tracking-wide text-indigo-600 dark:text-indigo-300 sm:text-6xl lg:text-7xl">
              <AuroraText weight={300}>Pokémon explorer</AuroraText>
            </h1>

            <h2 className="text-3xl font-medium tracking-tight text-slate-950 dark:text-slate-100">
              <DiaTextReveal
                className="font-bold tracking-tight"
                text="Discover your next Pokémon."
              >
                Discover your next <HyperText>Pokémon</HyperText>.
              </DiaTextReveal>
            </h2>

            {/* Pokémon Search */}
            <form className="mt-10 w-full max-w-xl" onSubmit={handleSearch}>
              <div
                onFocus={() => setIsSearchFocused(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setIsSearchFocused(false);
                  }
                }}
                className="relative isolate overflow-hidden rounded-2xl border border-white/70 bg-white/70 p-2 shadow-xl shadow-indigo-100/50 backdrop-blur-md transition-all duration-300 focus-within:border-indigo-300 focus-within:shadow-indigo-200/70 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/30 dark:focus-within:border-indigo-400/60 dark:focus-within:shadow-indigo-900/40"
              >
                {/* Search Input and Button */}
                <div className="relative z-10 flex items-center gap-2">
                  <input
                    aria-label="Pokémon name"
                    autoComplete="off"
                    type="text"
                    placeholder="Search for a Pokémon..."
                    value={inputValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputValue(value);

                      if (!value.trim()) {
                        setPokemonData(null);
                      }
                    }}
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />

                  <InteractiveHoverButton type="submit" disabled={isSearching}>
                    <Search aria-hidden="true" className="h-4 w-4" />
                    {isSearching ? "Searching..." : "Search"}
                  </InteractiveHoverButton>
                </div>

                {isSearchFocused && (
                  <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                )}
              </div>

              {/* Search Error */}
              {searchError && (
                <p
                  className="mt-3 text-left text-sm font-medium text-rose-600 dark:text-rose-400"
                  role="alert"
                >
                  {searchError}
                </p>
              )}
            </form>

            {pokemonData && (
              <div className="mt-8">
                <Card key={pokemonData.id} pokemon={pokemonData} priority />
              </div>
            )}

            <div
              className="mt-8 grid w-full grid-cols-1 items-start justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3"
              id="explore"
            >
              {pokemonList.map((pokemon, index) => (
                <Card
                  key={pokemon.id}
                  pokemon={pokemon}
                  priority={index < 6}
                />
              ))}
            </div>
            {nextUrl && (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="mt-10 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {isLoadingMore ? "Loading..." : "Load More"}
              </button>
            )}
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
