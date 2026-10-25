import React from 'react';
import { Search, Star, X, ChevronDown } from 'lucide-react';

const COMMON_LANGUAGES = ['all', 'javascript', 'typescript', 'python', 'java', 'sql', 'html', 'css', 'cpp'];

const FilterBar = ({
  search,
  setSearch,
  language,
  setLanguage,
  tag,
  setTag,
  favorite,
  setFavorite,
  availableLanguages = [],
  availableTags = [],
  onReset,
  _totalCount = 0,
}) => {
  const combinedLanguages = Array.from(
    new Set(['all', ...availableLanguages, ...COMMON_LANGUAGES])
  );

  const hasActiveFilters = search || (language && language !== 'all') || (tag && tag !== 'all') || favorite;

  return (
    <div className="bg-warm-surface dark:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border rounded-lg p-3 transition-colors shadow-2xs">
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-warm-muted dark:text-darkWarm-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search snippets by title, code, or description... (Ctrl+K)"
            className="w-full bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border rounded-md pl-9 pr-8 py-1.5 text-xs text-warm-text dark:text-darkWarm-text placeholder-warm-dim dark:placeholder-darkWarm-dim focus:outline-none focus:border-warm-accent dark:focus:border-darkWarm-accent transition-colors font-mono"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text p-0.5 cursor-pointer"
              title="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Language selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border rounded-md pl-2.5 pr-6 py-1.5 font-mono text-xs text-warm-text dark:text-darkWarm-text focus:outline-none focus:border-warm-accent dark:focus:border-darkWarm-accent cursor-pointer capitalize"
            >
              <option value="all">Lang: All</option>
              {combinedLanguages
                .filter((l) => l !== 'all')
                .map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-warm-muted dark:text-darkWarm-muted pointer-events-none" />
          </div>

          {/* Tag selector */}
          {availableTags && availableTags.length > 0 && (
            <div className="relative">
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="appearance-none bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border rounded-md pl-2.5 pr-6 py-1.5 font-mono text-xs text-warm-text dark:text-darkWarm-text focus:outline-none focus:border-warm-accent dark:focus:border-darkWarm-accent cursor-pointer"
              >
                <option value="all">Tag: All</option>
                {availableTags.map((t) => (
                  <option key={t} value={t}>
                    #{t}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-warm-muted dark:text-darkWarm-muted pointer-events-none" />
            </div>
          )}

          {/* Favorites toggle */}
          <button
            type="button"
            onClick={() => setFavorite(!favorite)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-mono transition-colors cursor-pointer ${
              favorite
                ? 'bg-warm-accentSubtle border-warm-accent/50 text-warm-accent dark:bg-darkWarm-accentSubtle dark:border-darkWarm-accent/50 dark:text-darkWarm-accent font-semibold'
                : 'bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border text-warm-muted dark:text-darkWarm-muted hover:text-warm-text dark:hover:text-darkWarm-text'
            }`}
          >
            <Star
              className={`h-3 w-3 ${
                favorite
                  ? 'fill-warm-accent text-warm-accent dark:fill-darkWarm-accent dark:text-darkWarm-accent'
                  : 'text-warm-muted dark:text-darkWarm-muted'
              }`}
            />
            <span>Favorites</span>
          </button>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xs text-warm-muted hover:text-rose-600 dark:text-darkWarm-muted dark:hover:text-rose-400 px-2 py-1 transition-colors flex items-center gap-1 font-mono cursor-pointer"
              title="Reset all filters"
            >
              <X className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
