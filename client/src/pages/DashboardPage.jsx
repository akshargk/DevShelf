import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useSnippets,
  useLanguagesAndTags,
  useToggleFavorite,
  useDeleteSnippet,
} from '../hooks/useSnippets';
import SnippetWorkbench from '../components/SnippetWorkbench';
import SnippetCard from '../components/SnippetCard';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import {
  Plus,
  Loader2,
  AlertCircle,
  LayoutGrid,
  Columns,
} from 'lucide-react';

const DashboardPage = () => {
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('all');
  const [tag, setTag] = useState('all');
  const [favorite, setFavorite] = useState(false);
  const [viewMode, setViewMode] = useState('workbench'); // 'workbench' | 'feed'
  const [selectedSnippetId, setSelectedSnippetId] = useState(null);

  // Filters passed directly to TanStack Query
  const filters = {
    search: search.trim() || undefined,
    language: language !== 'all' ? language : undefined,
    tag: tag !== 'all' ? tag : undefined,
    favorite: favorite ? 'true' : undefined,
  };

  const { data: snippets = [], isLoading, isError, error } = useSnippets(filters);
  const { data: meta } = useLanguagesAndTags();
  const toggleFavorite = useToggleFavorite();
  const deleteSnippet = useDeleteSnippet();

  // Derive active snippet ID cleanly from state and loaded snippets
  const activeSnippetId =
    selectedSnippetId && snippets.some((s) => s.id === selectedSnippetId)
      ? selectedSnippetId
      : snippets[0]?.id || null;

  const handleReset = () => {
    setSearch('');
    setLanguage('all');
    setTag('all');
    setFavorite(false);
  };

  const handleToggleFavorite = (id) => {
    toggleFavorite.mutate(id);
  };

  const handleDeleteSnippet = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteSnippet.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      {/* Dashboard Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-warm-text dark:text-darkWarm-text font-mono">
              Snippet Library
            </h1>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised text-warm-muted dark:text-darkWarm-muted border border-warm-border dark:border-darkWarm-border">
              {snippets.length} {snippets.length === 1 ? 'snippet' : 'snippets'}
            </span>
          </div>
          <p className="text-xs text-warm-muted dark:text-darkWarm-muted mt-0.5 font-sans">
            Personal developer repository for reusable algorithms, configurations, and utilities
          </p>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Toggle: Workbench vs Feed */}
          <div className="hidden md:flex items-center p-0.5 rounded-md bg-warm-surface dark:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border text-xs font-mono shadow-2xs">
            <button
              onClick={() => setViewMode('workbench')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'workbench'
                  ? 'bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised text-warm-accent dark:text-darkWarm-accent font-semibold shadow-2xs'
                  : 'text-warm-muted dark:text-darkWarm-muted hover:text-warm-text dark:hover:text-darkWarm-text'
              }`}
              title="Split Workbench View"
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Workbench</span>
            </button>
            <button
              onClick={() => setViewMode('feed')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'feed'
                  ? 'bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised text-warm-accent dark:text-darkWarm-accent font-semibold shadow-2xs'
                  : 'text-warm-muted dark:text-darkWarm-muted hover:text-warm-text dark:hover:text-darkWarm-text'
              }`}
              title="Full-Width Feed View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Feed</span>
            </button>
          </div>

          <Link
            to="/snippets/new"
            className="inline-flex items-center gap-1.5 bg-warm-accent hover:bg-warm-accentHover text-white dark:bg-darkWarm-accent dark:hover:bg-darkWarm-accentHover dark:text-[#18191D] font-semibold px-3.5 py-1.5 rounded-md text-xs transition-all shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>New Snippet</span>
          </Link>
        </div>
      </div>

      {/* Developer Quick Filter Toolbar */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        language={language}
        setLanguage={setLanguage}
        tag={tag}
        setTag={setTag}
        favorite={favorite}
        setFavorite={setFavorite}
        availableLanguages={meta?.languages || []}
        availableTags={meta?.tags || []}
        onReset={handleReset}
        totalCount={snippets.length}
      />

      {/* Main Workspace Stage */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-warm-muted dark:text-darkWarm-muted bg-warm-surface dark:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border rounded-lg shadow-2xs">
          <Loader2 className="h-5 w-5 animate-spin text-warm-accent dark:text-darkWarm-accent mb-2.5" />
          <p className="text-xs font-mono">Loading snippets from PostgreSQL database...</p>
        </div>
      ) : isError ? (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-700 dark:text-rose-400 text-xs font-mono">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Failed to query snippets</p>
            <p className="opacity-80 font-sans">{error?.message || 'Server error occurred'}</p>
          </div>
        </div>
      ) : snippets.length === 0 ? (
        <EmptyState
          message={
            search || language !== 'all' || tag !== 'all' || favorite
              ? 'No snippets match your filter parameters.'
              : 'No snippets saved yet.'
          }
          actionText={
            search || language !== 'all' || tag !== 'all' || favorite
              ? 'Reset filters'
              : 'Create your first snippet →'
          }
          to={
            search || language !== 'all' || tag !== 'all' || favorite ? undefined : '/snippets/new'
          }
        />
      ) : viewMode === 'workbench' ? (
        <SnippetWorkbench
          snippets={snippets}
          selectedSnippetId={activeSnippetId}
          onSelectSnippet={setSelectedSnippetId}
          onToggleFavorite={handleToggleFavorite}
          onDeleteSnippet={handleDeleteSnippet}
          isTogglingFavorite={toggleFavorite.isPending}
          isDeleting={deleteSnippet.isPending}
        />
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {snippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
