import { useState, useEffect, useMemo } from "react";
import { fetchPokemon } from "./api.js";
import { useLocalStorage } from "./useLocalStorage.js";
import Controls from "./components/Controls.jsx";
import PokemonCard from "./components/PokemonCard.jsx";

function App() {
  // --- Data state: the three states of any fetch ---
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0); // bump to retry

  // --- UI state ---
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // --- Favorites (array of Pokémon ids) saved in localStorage ---
  const [favorites, setFavorites] = useLocalStorage("pokedex-favorites", []);

  // Fetch data when the component mounts (and again on retry)
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchPokemon(151, controller.signal)
      .then((data) => setPokemon(data))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    // Cleanup: cancel the request if the component unmounts
    return () => controller.abort();
  }, [reloadKey]);

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((f) => f !== id) : [...current, id]
    );
  }

  // All unique types, for the dropdown
  const allTypes = useMemo(
    () => [...new Set(pokemon.flatMap((p) => p.types))].sort(),
    [pokemon]
  );

  // Apply search + type filter + favorites filter
  const visible = pokemon.filter((p) => {
    const matchesSearch = p.name.includes(search.trim().toLowerCase());
    const matchesType = typeFilter === "all" || p.types.includes(typeFilter);
    const matchesFavorite = !favoritesOnly || favorites.includes(p.id);
    return matchesSearch && matchesType && matchesFavorite;
  });

  return (
    <div className="app">
      <header>
        <h1>Pokédex</h1>
        <p className="subtitle">Data from PokéAPI · first 151 Pokémon</p>
      </header>

      <Controls
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        types={allTypes}
        favoritesOnly={favoritesOnly}
        onFavoritesOnlyChange={setFavoritesOnly}
        favoriteCount={favorites.length}
      />

      {loading && <p className="message">Loading Pokémon...</p>}

      {error && (
        <div className="message error">
          <p>Something went wrong: {error}</p>
          <button onClick={() => setReloadKey((k) => k + 1)}>Try again</button>
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <p className="message">No Pokémon match your filters.</p>
      )}

      {!loading && !error && (
        <main className="grid">
          {visible.map((p) => (
            <PokemonCard
              key={p.id}
              pokemon={p}
              isFavorite={favorites.includes(p.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </main>
      )}
    </div>
  );
}

export default App;
