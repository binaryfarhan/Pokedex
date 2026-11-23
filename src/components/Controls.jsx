function Controls({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  types,
  favoritesOnly,
  onFavoritesOnlyChange,
  favoriteCount,
}) {
  return (
    <div className="controls">
      <input
        type="search"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select value={typeFilter} onChange={(e) => onTypeChange(e.target.value)}>
        <option value="all">All types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button
        className={`toggle ${favoritesOnly ? "active" : ""}`}
        onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
      >
        ★ Favorites ({favoriteCount})
      </button>
    </div>
  );
}

export default Controls;
