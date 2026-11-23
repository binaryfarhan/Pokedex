const BASE_URL = "https://pokeapi.co/api/v2";

// Fetches the first `limit` Pokémon.
// Step 1: the list endpoint only gives { name, url } for each Pokémon.
// Step 2: we fetch every `url` to get the details (image, types, size).
export async function fetchPokemon(limit = 151, signal) {
  const listRes = await fetch(`${BASE_URL}/pokemon?limit=${limit}`, { signal });
  if (!listRes.ok) {
    throw new Error(`Could not load the Pokémon list (status ${listRes.status})`);
  }
  const list = await listRes.json();

  // Promise.all runs all the detail requests at the same time
  const details = await Promise.all(
    list.results.map(async (item) => {
      const res = await fetch(item.url, { signal });
      if (!res.ok) {
        throw new Error(`Could not load ${item.name} (status ${res.status})`);
      }
      return res.json();
    })
  );

  // Keep only the fields our UI needs
  return details.map((p) => ({
    id: p.id,
    name: p.name,
    image:
      p.sprites.other?.["official-artwork"]?.front_default ||
      p.sprites.front_default,
    types: p.types.map((t) => t.type.name),
    height: p.height / 10, // API gives decimetres -> metres
    weight: p.weight / 10, // API gives hectograms -> kg
  }));
}
