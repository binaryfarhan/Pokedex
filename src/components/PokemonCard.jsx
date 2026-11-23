function PokemonCard({ pokemon, isFavorite, onToggleFavorite }) {
  return (
    <article className="card">
      <button
        className={`fav-btn ${isFavorite ? "active" : ""}`}
        onClick={() => onToggleFavorite(pokemon.id)}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "★" : "☆"}
      </button>

      <img src={pokemon.image} alt={pokemon.name} loading="lazy" />

      <p className="number">#{String(pokemon.id).padStart(3, "0")}</p>
      <h2 className="name">{pokemon.name}</h2>

      <div className="types">
        {pokemon.types.map((type) => (
          <span key={type} className={`type type-${type}`}>
            {type}
          </span>
        ))}
      </div>

      <p className="stats">
        {pokemon.height} m · {pokemon.weight} kg
      </p>
    </article>
  );
}

export default PokemonCard;
