import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from './CodeBlock';
import RevisionHistory from './RevisionHistory';
import {
  Star,
  Edit3,
  Trash2,
  Calendar,
  Tag as TagIcon,
  ExternalLink,
  Code2,
  Check,
  Copy,
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

const SnippetWorkbench = ({
  snippets = [],
  selectedSnippetId,
  onSelectSnippet,
  onToggleFavorite,
  onDeleteSnippet,
  isTogglingFavorite = false,
  isDeleting = false,
}) => {
  const [copiedActive, setCopiedActive] = useState(false);

  // Find active snippet or fallback to first
  const activeSnippet =
    snippets.find((s) => s.id === selectedSnippetId) || snippets[0] || null;

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedActive(true);
      setTimeout(() => setCopiedActive(false), 1800);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const getLanguageBadgeClass = (lang) => {
    const l = (lang || '').toLowerCase();
    return (
      LANGUAGE_BADGES[l] ||
      'bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised text-warm-muted dark:text-darkWarm-muted border-warm-border dark:border-darkWarm-border'
    );
  };

  if (!snippets || snippets.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* LEFT COLUMN: Master Snippet Explorer (5 cols on lg) */}
      <div className="lg:col-span-5 flex flex-col bg-warm-surface dark:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border rounded-lg overflow-hidden shadow-2xs">
        {/* Pane Title Bar */}
        <div className="px-4 py-3 border-b border-warm-border dark:border-darkWarm-border bg-warm-surfaceRaised/60 dark:bg-darkWarm-surfaceRaised/40 flex items-center justify-between text-xs font-mono">
          <span className="font-semibold text-warm-text dark:text-darkWarm-text flex items-center gap-2">
            <Code2 className="h-4 w-4 text-warm-accent dark:text-darkWarm-accent" />
            Snippet Explorer
          </span>
          <span className="text-[11px] text-warm-muted dark:text-darkWarm-muted px-2 py-0.5 rounded bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border">
            {snippets.length} {snippets.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Scrollable List */}
        <div className="divide-y divide-warm-border/60 dark:divide-darkWarm-border/60 max-h-[calc(100vh-14rem)] overflow-y-auto">
          {snippets.map((snippet) => {
            const isSelected = activeSnippet && activeSnippet.id === snippet.id;
            const createdDate = new Date(snippet.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={snippet.id}
                onClick={() => onSelectSnippet(snippet.id)}
                className={`p-3.5 cursor-pointer transition-colors text-left relative ${
                  isSelected
                    ? 'bg-warm-accentSubtle/80 dark:bg-darkWarm-accentSubtle border-l-4 border-warm-accent dark:border-darkWarm-accent'
                    : 'hover:bg-warm-surfaceRaised/50 dark:hover:bg-darkWarm-surfaceRaised/30 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      isSelected
                        ? 'text-warm-accent dark:text-darkWarm-accent'
                        : 'text-warm-text dark:text-darkWarm-text'
                    }`}
                  >
                    {snippet.title}
                  </h3>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(snippet.id);
                    }}
                    disabled={isTogglingFavorite}
                    title={snippet.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    className="shrink-0 p-0.5 text-warm-dim hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${
                        snippet.isFavorite
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-warm-dim dark:text-darkWarm-dim hover:text-amber-500'
                      }`}
                    />
                  </button>
                </div>

                {snippet.description && (
                  <p className="text-xs text-warm-muted dark:text-darkWarm-muted line-clamp-1 mb-2">
                    {snippet.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] font-mono">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border ${getLanguageBadgeClass(
                      snippet.language
                    )}`}
                  >
                    {snippet.language}
                  </span>

                  <span className="text-warm-dim dark:text-darkWarm-dim text-[11px]">
                    {createdDate}
                  </span>

                  {snippet.tags && snippet.tags.length > 0 && (
                    <div className="flex items-center gap-1 ml-auto overflow-hidden">
                      {snippet.tags.slice(0, 2).map((t) => (
                        <span
                          key={t.id || t.name}
                          className="text-[10px] text-warm-muted dark:text-darkWarm-muted bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised px-1.5 py-0.5 rounded border border-warm-border/60 dark:border-darkWarm-border/60"
                        >
                          #{t.name}
                        </span>
                      ))}
                      {snippet.tags.length > 2 && (
                        <span className="text-[10px] text-warm-dim dark:text-darkWarm-dim">
                          +{snippet.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Active Snippet Workbench Inspector (7 cols on lg) */}
      <div className="lg:col-span-7 bg-warm-surface dark:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border rounded-lg overflow-hidden shadow-2xs">
        {activeSnippet ? (
          <div>
            {/* Workbench Header */}
            <div className="p-5 border-b border-warm-border dark:border-darkWarm-border bg-warm-surfaceRaised/30 dark:bg-darkWarm-surfaceRaised/20">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-semibold text-[11px] uppercase border ${getLanguageBadgeClass(
                      activeSnippet.language
                    )}`}
                  >
                    {activeSnippet.language}
                  </span>
                  <span className="text-xs font-mono text-warm-muted dark:text-darkWarm-muted flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(activeSnippet.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Toolbar Actions */}
                <div className="flex items-center gap-1.5">
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyCode(activeSnippet.code)}
                    className="h-8 px-2.5 inline-flex items-center gap-1 text-xs font-mono font-medium rounded-md border border-warm-border dark:border-darkWarm-border bg-warm-surface hover:bg-warm-surfaceRaised dark:bg-darkWarm-surface dark:hover:bg-darkWarm-surfaceRaised text-warm-text dark:text-darkWarm-text transition-colors cursor-pointer"
                    title="Copy snippet code"
                  >
                    {copiedActive ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {/* Favorite Toggle */}
                  <button
                    onClick={() => onToggleFavorite(activeSnippet.id)}
                    disabled={isTogglingFavorite}
                    className={`h-8 px-2.5 rounded-md border text-xs transition-colors cursor-pointer flex items-center justify-center ${
                      activeSnippet.isFavorite
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                        : 'border-warm-border dark:border-darkWarm-border bg-warm-surface hover:bg-warm-surfaceRaised dark:bg-darkWarm-surface dark:hover:bg-darkWarm-surfaceRaised text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text'
                    }`}
                    title={activeSnippet.isFavorite ? 'Favorited' : 'Add to favorites'}
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${
                        activeSnippet.isFavorite ? 'fill-amber-500 text-amber-500' : ''
                      }`}
                    />
                  </button>

                  {/* Edit */}
                  <Link
                    to={`/snippets/${activeSnippet.id}/edit`}
                    className="h-8 px-2.5 inline-flex items-center justify-center rounded-md border border-warm-border dark:border-darkWarm-border bg-warm-surface hover:bg-warm-surfaceRaised dark:bg-darkWarm-surface dark:hover:bg-darkWarm-surfaceRaised text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text transition-colors"
                    title="Edit snippet"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteSnippet(activeSnippet.id, activeSnippet.title)}
                    disabled={isDeleting}
                    className="h-8 px-2.5 inline-flex items-center justify-center rounded-md border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
                    title="Delete snippet"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  {/* Full Page Link */}
                  <Link
                    to={`/snippets/${activeSnippet.id}`}
                    className="h-8 px-2.5 inline-flex items-center justify-center rounded-md border border-warm-border dark:border-darkWarm-border bg-warm-surface hover:bg-warm-surfaceRaised dark:bg-darkWarm-surface dark:hover:bg-darkWarm-surfaceRaised text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text transition-colors"
                    title="Open dedicated view"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-warm-text dark:text-darkWarm-text tracking-tight mb-2">
                {activeSnippet.title}
              </h2>

              {/* Description */}
              {activeSnippet.description && (
                <p className="text-xs sm:text-sm text-warm-muted dark:text-darkWarm-muted leading-relaxed mb-3">
                  {activeSnippet.description}
                </p>
              )}

              {/* Tags */}
              {activeSnippet.tags && activeSnippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-warm-border/60 dark:border-darkWarm-border/60">
                  {activeSnippet.tags.map((tag) => (
                    <span
                      key={tag.id || tag.name}
                      className="inline-flex items-center text-[11px] font-mono text-warm-muted dark:text-darkWarm-muted bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised px-2 py-0.5 rounded border border-warm-border/60 dark:border-darkWarm-border/60"
                    >
                      <TagIcon className="h-2.5 w-2.5 mr-1 opacity-70" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Code Block Canvas */}
            <div className="p-5">
              <div className="mb-4">
                <CodeBlock
                  code={activeSnippet.code}
                  language={activeSnippet.language}
                  maxHeight="max-h-[460px]"
                  showCopy={true}
                  showLineNumbers={true}
                />
              </div>

              {/* Embedded Module 3 MongoDB Revision History */}
              <div className="pt-2">
                <RevisionHistory snippetId={activeSnippet.id} />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-warm-muted dark:text-darkWarm-muted">
            <Code2 className="h-8 w-8 mx-auto mb-2 text-warm-dim dark:text-darkWarm-dim" />
            <p className="text-xs font-mono">Select a snippet from the explorer to view code</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnippetWorkbench;
