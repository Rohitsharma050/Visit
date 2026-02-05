const FilterPanel = ({ difficulty, setDifficulty, selectedTag, setSelectedTag, availableTags }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Filters</h3>
      
      {/* Difficulty Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Difficulty
        </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="input"
        >
          <option value="all">All Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Tag Filter */}
      {availableTags && availableTags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="input"
          >
            <option value="">All Tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Clear Filters */}
      {(difficulty !== 'all' || selectedTag) && (
        <button
          onClick={() => {
            setDifficulty('all');
            setSelectedTag('');
          }}
          className="btn btn-outline w-full mt-4"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterPanel;
