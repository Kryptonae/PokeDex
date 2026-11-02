import { useState } from "react";
import { Search } from "lucide-react";
import Header from "./componenets/Header";
import { AuroraText } from "./componenets/ui/aurora-text";
import { SpecialText } from "./componenets/ui/special-text";
import BoidsEcosystem from "./componenets/animata/background/boids-ecosystem";
import { ShineBorder } from "./componenets/ui/shine-border";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [searchError, setSearchError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Search Pokémon
  const handleSearch = async (e) => {
    e.preventDefault();

    const pokemonName = inputValue.trim().toLowerCase();

    // Validate input
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

      // Check if Pokémon exists
      if (response.status === 404) {
        throw new Error(`Pokémon "${pokemonName}" not found`);
      }

      // Check other API errors
      if (!response.ok) {
        throw new Error("Failed to fetch Pokémon data");
      }

      // Convert response into JSON
      const jsonData = await response.json();

      // Display data in console
      console.log("Pokémon Data:", jsonData);
    } catch (error) {
      setSearchError(error.message);
      console.error("Search Error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <div className="relative isolate min-h-screen bg-slate-50">
        {/* Full Website Background Animation */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
        >
          <BoidsEcosystem
            count={100}
            background="#f8fafc"
            palette={["#6366f1", "#0ea5e9", "#8b5cf6", "#ec4899"]}
            cursorRadius={110}
            agentShape="triangle"
            className="h-full w-full"
          />
        </div>

        {/* Website Content */}
        <div className="relative z-10">
          <Header />

          <main className="mx-auto max-w-6xl px-6 py-16 flex flex-col items-center justify-center text-center">
            <h1 className="mb-3 text-7xl font-extrabold uppercase tracking-wide text-indigo-600">
              <AuroraText>Pokémon explorer</AuroraText>
            </h1>

            <h2 className="text-3xl font-medium tracking-tight text-slate-950">
              <SpecialText speed={20}>Discover your next Pokémon.</SpecialText>
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
                className="relative isolate overflow-hidden rounded-2xl border border-white/70 bg-white/70 p-2 shadow-xl shadow-indigo-100/50 backdrop-blur-md transition-all duration-300 focus-within:border-indigo-300 focus-within:shadow-indigo-200/70"
              >
                {/* Search Input and Button */}
                <div className="relative z-10 flex items-center gap-2">
                  <input
                    aria-label="Pokémon name"
                    autoComplete="off"
                    type="text"
                    placeholder="Search for a Pokémon..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="submit"
                    disabled={isSearching}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-300/40 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-300/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <Search aria-hidden="true" className="h-4 w-4" />
                    {isSearching ? "Searching..." : "Search"}
                  </button>
                </div>

                {isSearchFocused && (
                  <ShineBorder
                    shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  />
                )}
              </div>

              {/* Search Error */}
              {searchError && (
                <p
                  className="mt-3 text-left text-sm font-medium text-rose-600"
                  role="alert"
                >
                  {searchError}
                </p>
              )}
            </form>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
