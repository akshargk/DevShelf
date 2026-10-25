import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Plus } from 'lucide-react';

const EmptyState = ({
  message = 'No snippets found.',
  actionText = 'Create your first snippet →',
  to = '/snippets/new',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-warm-border dark:border-darkWarm-border bg-warm-surface dark:bg-darkWarm-surface">
      <div className="h-10 w-10 rounded-md bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised border border-warm-border dark:border-darkWarm-border flex items-center justify-center mb-3 text-warm-accent dark:text-darkWarm-accent">
        <Code2 className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-warm-text dark:text-darkWarm-text mb-1 font-mono">
        {message}
      </h3>
      <p className="text-xs text-warm-muted dark:text-darkWarm-muted max-w-sm mb-4">
        Save, organize, and quickly retrieve your reusable code snippets in one place.
      </p>
      {to && (
        <Link
          to={to}
          className="inline-flex items-center gap-1.5 bg-warm-accent hover:bg-warm-accentHover text-white dark:bg-darkWarm-accent dark:hover:bg-darkWarm-accentHover dark:text-[#18191D] font-medium px-4 py-2 rounded-md text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
