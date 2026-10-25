import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSnippet, useUpdateSnippet } from '../hooks/useSnippets';
import SnippetForm from '../components/SnippetForm';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const SnippetEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: snippet, isLoading, isError, error } = useSnippet(id);
  const updateSnippet = useUpdateSnippet();

  const handleUpdate = (updatedData) => {
    updateSnippet.mutate(
      { id: parseInt(id, 10), ...updatedData },
      {
        onSuccess: () => {
          navigate(`/snippets/${id}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-warm-muted dark:text-darkWarm-muted">
        <Loader2 className="h-5 w-5 animate-spin text-warm-accent dark:text-darkWarm-accent mb-2.5" />
        <p className="text-xs font-mono">Loading snippet...</p>
      </div>
    );
  }

  if (isError || !snippet) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center gap-2.5 text-xs font-mono">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error?.message || 'Snippet not found'}</span>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 mt-4 text-xs font-mono text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Snippet Library</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/snippets/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text transition-colors mb-2.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Snippet</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-warm-text dark:text-darkWarm-text tracking-tight font-mono">
          Edit Snippet
        </h1>
        <p className="text-xs text-warm-muted dark:text-darkWarm-muted mt-1 font-sans">
          Changes will update PostgreSQL and automatically archive the previous version in MongoDB revision history.
        </p>
      </div>

      <SnippetForm
        initialData={snippet}
        onSubmit={handleUpdate}
        isSubmitting={updateSnippet.isPending}
        isEdit={true}
      />
    </div>
  );
};

export default SnippetEditPage;
