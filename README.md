# Pokédex (Vite + React)

A small web app that fetches the first 151 Pokémon from [PokéAPI](https://pokeapi.co/)
and lets you search, filter by type, and save favorites.

## Features

- Vite + React project
- Data fetched from PokéAPI with `fetch`
- Pokémon displayed with React components (`App`, `Controls`, `PokemonCard`)
- Loading message, error message (with a "Try again" button), and an empty-results message
- Search by name, filter by type, and a favorites-only toggle
- Favorites saved in `localStorage` (still there after a refresh)

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## How the project was created

```bash
npm create vite@latest pokedex -- --template react
cd pokedex
npm install
npm run dev
```

## Project structure

```
src/
  main.jsx               entry point, mounts <App /> into #root
  App.jsx                state, data fetching, filtering
  api.js                 fetchPokemon(): list request + detail requests
  useLocalStorage.js     custom hook: useState that persists to localStorage
  components/
    Controls.jsx         search box, type dropdown, favorites toggle
    PokemonCard.jsx      one Pokémon card with the favorite star
  index.css              styles
```

## How it works

1. `App` starts with `loading = true`. `useEffect` runs once and calls `fetchPokemon`.
2. `fetchPokemon` calls `/pokemon?limit=151` (names and URLs only), then fetches
   every URL with `Promise.all` to get image, types, height and weight.
3. On success we store the data with `setPokemon`; on failure we store the message
   with `setError`; either way `loading` becomes `false`.
4. `App` filters the array by search text, type and favorites, then `.map()`s the
   result into `<PokemonCard />` components.
5. Favorites are an array of Pokémon ids. `useLocalStorage` reads it on startup
   and writes it again whenever it changes.

## Possible questions tomorrow

- **What does `useEffect(..., [])` do?** Runs the code after the first render. The
  dependency array decides when it runs again. Here it re-runs only when
  `reloadKey` changes (the retry button).
- **Why `AbortController`?** To cancel in-flight requests if the component goes
  away, and to avoid state updates on something that no longer exists.
- **Why `key={p.id}` in the list?** React uses it to tell list items apart when
  the list changes.
- **Why is `visible` not in state?** It can be computed from `pokemon`, `search`,
  `typeFilter` and `favorites`. Storing it separately would risk going out of sync.
- **Why `Promise.all`?** It runs the 151 requests in parallel and gives one result
  when all finish (or one error if any fail).
- **Why `setFavorites(current => ...)`?** The new value depends on the old one, so
  we use the function form to always get the latest value.
- **What is `JSON.stringify` for in localStorage?** localStorage only stores
  strings, so arrays must be converted to JSON text and parsed back.

## Upload to GitHub

```bash
git init
git add .
git commit -m "Pokédex app with Vite + React"
git branch -M main
git remote add origin https://github.com/<your-username>/pokedex.git
git push -u origin main
```

Create the repository on GitHub first and set it to **Public**.
