import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Edit3, Trash2, Calendar, Eye, Tag as TagIcon } from 'lucide-react';
import CodeBlock from './CodeBlock';
import { useToggleFavorite, useDeleteSnippet } from '../hooks/useSnippets';

const LANGUAGE_BADGES = {
  javascript: 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800/50',
  typescript: 'bg-sky-100 dark:bg-sky-950/50 text-sky-900 dark:text-sky-300 border-sky-300 dark:border-sky-800/50',
  python: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/50',
  java: 'bg-orange-100 dark:bg-orange-950/50 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800/50',
  sql: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800/50',
  html: 'bg-rose-100 dark:bg-rose-950/50 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-800/50',
  css: 'bg-blue-100 dark:bg-blue-950/50 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-800/50',
  cpp: 'bg-teal-100 dark:bg-teal-950/50 text-teal-900 dark:text-teal-300 border-teal-300 dark:border-teal-800/50',
};

const SnippetCard = ({ snippet }) => {
  const navigate = useNavigate();
  const toggleFavorite = useToggleFavorite();
  const deleteSnippet = useDeleteSnippet();

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    toggleFavorite.mutate(snippet.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${snippet.title}"?`)) {
      deleteSnippet.mutate(snippet.id);
    }
  };

  const langBadgeClass =
    LANGUAGE_BADGES[(snippet.language || '').toLowerCase()] ||
    'bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised text-warm-muted dark:text-darkWarm-muted border-warm-border dark:border-darkWarm-border';

  const formattedDate = new Date(snippet.updatedAt || snippet.createdAt).toLocaleDateString(
    'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <div
      onClick={() => navigate(`/snippets/${snippet.id}`)}
      className="bg-warm-surface dark:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border rounded-lg p-5 shadow-2xs hover:border-warm-borderHover dark:hover:border-darkWarm-borderHover transition-all cursor-pointer text-left"
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 rounded font-mono font-semibold text-[10px] uppercase border ${langBadgeClass}`}
            >
              {snippet.language}
            </span>
            <span className="text-xs font-mono text-warm-muted dark:text-darkWarm-muted flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-warm-text dark:text-darkWarm-text hover:text-warm-accent dark:hover:text-darkWarm-accent transition-colors truncate font-mono">
            {snippet.title}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleFavoriteToggle}
            disabled={toggleFavorite.isPending}
            className={`p-2 rounded-md border text-xs transition-colors cursor-pointer flex items-center justify-center ${
              snippet.isFavorite
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                : 'border-warm-border dark:border-darkWarm-border bg-warm-surface hover:bg-warm-surfaceRaised dark:bg-darkWarm-surface dark:hover:bg-darkWarm-surfaceRaised text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text'
            }`}
            title={snippet.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
          >
            <Star
              className={`h-3.5 w-3.5 ${
                snippet.isFavorite ? 'fill-amber-500 text-amber-500' : ''
              }`}
            />
          </button>

          <Link
            to={`/snippets/${snippet.id}/edit`}
            className="p-2 rounded-md border border-warm-border dark:border-darkWarm-border bg-warm-surface hover:bg-warm-surfaceRaised dark:bg-darkWarm-surface dark:hover:bg-darkWarm-surfaceRaised text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text transition-colors"
            title="Edit snippet"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleteSnippet.isPending}
            className="p-2 rounded-md border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
            title="Delete snippet"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Description */}
      {snippet.description && (
        <p className="text-xs sm:text-sm text-warm-muted dark:text-darkWarm-muted leading-relaxed mb-3 font-sans">
          {snippet.description}
        </p>
      )}

      {/* Code Box with generous width */}
      <div className="mb-3.5" onClick={(e) => e.stopPropagation()}>
        <CodeBlock
          code={snippet.code}
          language={snippet.language}
          maxHeight="max-h-56"
          showCopy={true}
          showLineNumbers={true}
        />
      </div>

      {/* Tags & View Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-warm-border/60 dark:border-darkWarm-border/60">
        <div className="flex flex-wrap gap-1.5">
          {snippet.tags && snippet.tags.length > 0 ? (
            snippet.tags.map((tag) => (
              <span
                key={tag.id || tag.name}
                className="inline-flex items-center text-[11px] font-mono text-warm-muted dark:text-darkWarm-muted bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised px-2 py-0.5 rounded border border-warm-border/60 dark:border-darkWarm-border/60"
              >
                <TagIcon className="h-2.5 w-2.5 mr-1 opacity-70" />
                {tag.name}
              </span>
            ))
          ) : (
            <span className="text-[11px] font-mono text-warm-dim dark:text-darkWarm-dim italic">
              No tags
            </span>
          )}
        </div>

        <Link
          to={`/snippets/${snippet.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-warm-accent dark:text-darkWarm-accent hover:underline"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Full Details →</span>
        </Link>
      </div>
    </div>
  );
};

export default SnippetCard;
