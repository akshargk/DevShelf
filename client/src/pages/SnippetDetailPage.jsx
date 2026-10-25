import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSnippet, useToggleFavorite, useDeleteSnippet } from '../hooks/useSnippets';
import CodeBlock from '../components/CodeBlock';
import RevisionHistory from '../components/RevisionHistory';
import {
  ArrowLeft,
  Star,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Tag as TagIcon,
  Loader2,
  AlertCircle,
  Terminal,
} from 'lucide-react';

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

const SnippetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: snippet, isLoading, isError, error } = useSnippet(id);
  const toggleFavorite = useToggleFavorite();
  const deleteSnippet = useDeleteSnippet();

  const handleFavoriteToggle = () => {
    if (snippet) {
      toggleFavorite.mutate(snippet.id);
    }
  };

  const handleDelete = () => {
    if (!snippet) return;
    if (window.confirm(`Are you sure you want to delete "${snippet.title}"?`)) {
      deleteSnippet.mutate(snippet.id, {
        onSuccess: () => {
          navigate('/dashboard');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-warm-muted dark:text-darkWarm-muted">
        <Loader2 className="h-5 w-5 animate-spin text-warm-accent dark:text-darkWarm-accent mb-2.5" />
        <p className="text-xs font-mono">Loading snippet details...</p>
      </div>
    );
  }

  if (isError || !snippet) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center gap-3 text-xs font-mono">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <div>
            <h3 className="font-semibold text-sm">Snippet Not Found</h3>
            <p className="opacity-80 font-sans">{error?.message || 'The requested snippet does not exist or has been removed.'}</p>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 mt-4 text-xs font-mono text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Snippet Library</span>
        </Link>
      </div>
    );
  }

  const createdDate = new Date(snippet.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const updatedDate = new Date(snippet.updatedAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const langBadgeClass =
    LANGUAGE_BADGES[(snippet.language || '').toLowerCase()] ||
    'bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised text-warm-muted dark:text-darkWarm-muted border-warm-border dark:border-darkWarm-border';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Snippet Library</span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Favorite Toggle */}
          <button
            onClick={handleFavoriteToggle}
            disabled={toggleFavorite.isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-colors cursor-pointer ${
              snippet.isFavorite
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 font-semibold'
                : 'text-warm-muted dark:text-darkWarm-muted border-warm-border dark:border-darkWarm-border bg-warm-surface hover:bg-warm-surfaceRaised dark:bg-darkWarm-surface dark:hover:bg-darkWarm-surfaceRaised hover:text-warm-text dark:hover:text-darkWarm-text'
            }`}
          >
            <Star
              className={`h-3.5 w-3.5 ${
                snippet.isFavorite ? 'fill-amber-500 text-amber-500' : ''
              }`}
            />
            <span>{snippet.isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          {/* Edit */}
          <Link
            to={`/snippets/${snippet.id}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-warm-border dark:border-darkWarm-border bg-warm-surface hover:bg-warm-surfaceRaised dark:bg-darkWarm-surface dark:hover:bg-darkWarm-surfaceRaised text-warm-text dark:text-darkWarm-text text-xs font-mono transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Link>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleteSnippet.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-mono transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Snippet Header Panel */}
      <div className="bg-warm-surface dark:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border rounded-lg p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 mb-2.5">
          <span
            className={`px-2 py-0.5 rounded font-mono font-semibold text-[11px] uppercase border ${langBadgeClass}`}
          >
            {snippet.language}
          </span>
          <span className="text-xs font-mono text-warm-muted dark:text-darkWarm-muted flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 opacity-75" />
            Created {createdDate}
          </span>
          <span className="text-xs font-mono text-warm-muted dark:text-darkWarm-muted flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 opacity-75" />
            Updated {updatedDate}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-warm-text dark:text-darkWarm-text tracking-tight mb-2 font-mono">
          {snippet.title}
        </h1>

        {snippet.description && (
          <p className="text-xs sm:text-sm text-warm-muted dark:text-darkWarm-muted leading-relaxed max-w-3xl mb-4 font-sans">
            {snippet.description}
          </p>
        )}

        {/* Tags */}
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-warm-border/60 dark:border-darkWarm-border/60">
            {snippet.tags.map((tag) => (
              <span
                key={tag.id || tag.name}
                className="inline-flex items-center text-xs text-warm-muted dark:text-darkWarm-muted bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised px-2 py-0.5 rounded border border-warm-border/60 dark:border-darkWarm-border/60 font-mono"
              >
                <TagIcon className="h-2.5 w-2.5 mr-1 opacity-70" />
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Code Display Canvas */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-mono font-semibold text-warm-muted dark:text-darkWarm-muted tracking-wide uppercase flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-warm-accent dark:text-darkWarm-accent" />
            Snippet Code · PostgreSQL
          </span>
        </div>
        <CodeBlock
          code={snippet.code}
          language={snippet.language}
          maxHeight="max-h-[550px]"
          showCopy={true}
          showLineNumbers={true}
        />
      </div>

      {/* Module 3 MongoDB Revision History Section */}
      <RevisionHistory snippetId={snippet.id} />
    </div>
  );
};

export default SnippetDetailPage;
