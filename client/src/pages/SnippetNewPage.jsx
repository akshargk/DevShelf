import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateSnippet } from '../hooks/useSnippets';
import SnippetForm from '../components/SnippetForm';
import { ArrowLeft } from 'lucide-react';

const SnippetNewPage = () => {
  const navigate = useNavigate();
  const createSnippet = useCreateSnippet();

  const handleCreate = (data) => {
    createSnippet.mutate(data, {
      onSuccess: (newSnippet) => {
        navigate(`/snippets/${newSnippet.id}`);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text transition-colors mb-2.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Snippet Library</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-warm-text dark:text-darkWarm-text tracking-tight font-mono">
          New Snippet
        </h1>
        <p className="text-xs text-warm-muted dark:text-darkWarm-muted mt-1 font-sans">
          Save a reusable code fragment with syntax highlighting and tags into PostgreSQL
        </p>
      </div>

      <SnippetForm
        onSubmit={handleCreate}
        isSubmitting={createSnippet.isPending}
        isEdit={false}
      />
    </div>
  );
};

export default SnippetNewPage;
