import React, { useState } from 'react';
import { useSnippetRevisions } from '../hooks/useSnippets';
import CodeBlock from './CodeBlock';
import { History, ChevronDown, ChevronUp, Database, Calendar } from 'lucide-react';

const RevisionHistory = ({ snippetId }) => {
  const { data: revisions = [], isLoading, isError } = useSnippetRevisions(snippetId);
  const [expandedVersion, setExpandedVersion] = useState(null);

  const toggleExpand = (ver) => {
    setExpandedVersion(expandedVersion === ver ? null : ver);
  };

  if (isLoading) {
    return (
      <div className="p-4 rounded-lg bg-warm-surface dark:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border text-center text-xs font-mono text-warm-muted dark:text-darkWarm-muted">
        Loading revision history from MongoDB...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-mono">
        Failed to load revision history from MongoDB.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-warm-surface dark:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border p-4 sm:p-5 shadow-2xs transition-colors">
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-warm-border/60 dark:border-darkWarm-border/60">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-warm-accent dark:text-darkWarm-accent" />
          <h4 className="text-xs font-bold font-mono text-warm-text dark:text-darkWarm-text uppercase tracking-wide">
            Revision History
          </h4>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised text-warm-muted dark:text-darkWarm-muted border border-warm-border dark:border-darkWarm-border">
            {revisions.length} {revisions.length === 1 ? 'version' : 'versions'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-warm-dim dark:text-darkWarm-dim font-mono">
          <Database className="h-3 w-3 text-warm-accent dark:text-darkWarm-accent inline" />
          <span className="hidden sm:inline">MongoDB: snippet_revisions</span>
        </div>
      </div>

      {revisions.length === 0 ? (
        <p className="text-xs text-warm-muted dark:text-darkWarm-muted italic py-1 font-sans">
          No revisions archived yet. When you edit this snippet, snapshots will automatically be stored in MongoDB.
        </p>
      ) : (
        <div className="space-y-2.5">
          {revisions.map((rev) => {
            const isExpanded = expandedVersion === rev.version;
            const formattedDate = new Date(rev.changedAt || rev.createdAt).toLocaleString(
              'en-US',
              {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }
            );

            return (
              <div
                key={rev._id || rev.version}
                className="rounded-md border border-warm-border dark:border-darkWarm-border bg-warm-bg dark:bg-darkWarm-bg overflow-hidden transition-colors"
              >
                <div
                  onClick={() => toggleExpand(rev.version)}
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-warm-surfaceRaised/50 dark:hover:bg-darkWarm-surfaceRaised/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised text-warm-text dark:text-darkWarm-text border border-warm-border dark:border-darkWarm-border">
                      v{rev.version}
                    </span>
                    <div>
                      <span className="text-xs font-medium text-warm-text dark:text-darkWarm-text block">
                        {rev.changeNote || 'Snippet revision snapshot'}
                      </span>
                      <span className="text-[10px] text-warm-dim dark:text-darkWarm-dim flex items-center gap-1 font-mono mt-0.5">
                        <Calendar className="h-2.5 w-2.5" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-warm-muted dark:text-darkWarm-muted font-mono">
                    <span className="uppercase text-[10px]">{rev.language}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </div>
                </div>

                {/* Expanded revision code snapshot */}
                {isExpanded && (
                  <div className="p-3.5 border-t border-warm-border dark:border-darkWarm-border bg-warm-surface dark:bg-darkWarm-surface">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-warm-text dark:text-darkWarm-text font-mono">
                        {rev.title}
                      </span>
                      {rev.description && (
                        <p className="text-xs text-warm-muted dark:text-darkWarm-muted mt-0.5">
                          {rev.description}
                        </p>
                      )}
                    </div>
                    <CodeBlock
                      code={rev.code}
                      language={rev.language}
                      maxHeight="max-h-60"
                      showCopy={true}
                      showLineNumbers={true}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RevisionHistory;
