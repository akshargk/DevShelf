import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, AlertCircle, Tag as TagIcon, FileText, Code2 } from 'lucide-react';

const LANGUAGE_OPTIONS = [
  'javascript',
  'typescript',
  'python',
  'java',
  'sql',
  'html',
  'css',
  'cpp',
  'csharp',
  'go',
  'rust',
  'bash',
  'json',
];

const SnippetForm = ({ initialData = {}, onSubmit, isSubmitting, isEdit = false }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData.title || '');
  const [language, setLanguage] = useState(initialData.language || 'javascript');
  const [code, setCode] = useState(initialData.code || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [tags, setTags] = useState(() => {
    if (Array.isArray(initialData.tags)) {
      return initialData.tags.map((t) => (typeof t === 'string' ? t : t.name)).join(', ');
    }
    return initialData.tags || '';
  });
  const [changeNote, setChangeNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!language.trim()) {
      setError('Programming language is required');
      return;
    }
    if (!code.trim()) {
      setError('Code content is required');
      return;
    }

    const payload = {
      title: title.trim(),
      language: language.trim().toLowerCase(),
      code: code.trim(),
      description: description.trim() || undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      changeNote: changeNote.trim() || undefined,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3.5 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-rose-700 dark:text-rose-400 text-xs font-mono">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary Details Panel */}
      <div className="bg-warm-surface dark:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border rounded-lg p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-warm-text dark:text-darkWarm-text mb-1.5 font-mono">
              Title <span className="text-warm-accent dark:text-darkWarm-accent">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quick Sort Algorithm, JWT Auth Filter"
              className="w-full bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border rounded-md px-3.5 py-2 text-xs sm:text-sm text-warm-text dark:text-darkWarm-text placeholder-warm-dim dark:placeholder-darkWarm-dim focus:outline-none focus:border-warm-accent dark:focus:border-darkWarm-accent transition-colors"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-semibold text-warm-text dark:text-darkWarm-text mb-1.5 font-mono">
              Language <span className="text-warm-accent dark:text-darkWarm-accent">*</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border rounded-md px-3 py-2 text-xs sm:text-sm text-warm-text dark:text-darkWarm-text font-mono focus:outline-none focus:border-warm-accent dark:focus:border-darkWarm-accent capitalize cursor-pointer transition-colors"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-warm-text dark:text-darkWarm-text mb-1.5 font-mono">
            Description <span className="text-warm-dim font-normal font-sans">(optional)</span>
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Document what this snippet does, usage requirements, or edge cases..."
            className="w-full bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border rounded-md p-3 text-xs sm:text-sm text-warm-text dark:text-darkWarm-text placeholder-warm-dim dark:placeholder-darkWarm-dim focus:outline-none focus:border-warm-accent dark:focus:border-darkWarm-accent transition-colors resize-y font-sans"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-warm-text dark:text-darkWarm-text mb-1.5 font-mono flex items-center gap-1.5">
            <TagIcon className="h-3 w-3 text-warm-dim" />
            <span>Tags (comma-separated)</span>
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="algorithm, sorting, array, performance"
            className="w-full bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border rounded-md px-3.5 py-2 text-xs sm:text-sm text-warm-text dark:text-darkWarm-text placeholder-warm-dim dark:placeholder-darkWarm-dim focus:outline-none focus:border-warm-accent dark:focus:border-darkWarm-accent transition-colors font-mono"
          />
        </div>

        {/* If editing: Revision Note */}
        {isEdit && (
          <div className="pt-3 border-t border-warm-border/60 dark:border-darkWarm-border/60">
            <label className="block text-xs font-semibold text-warm-text dark:text-darkWarm-text mb-1.5 font-mono flex items-center gap-1.5">
              <FileText className="h-3 w-3 text-warm-accent dark:text-darkWarm-accent" />
              <span>
                Revision Note <span className="text-warm-dim font-normal font-sans">(stored in MongoDB history)</span>
              </span>
            </label>
            <input
              type="text"
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              placeholder="e.g. Fixed edge case with empty array, modernized syntax"
              className="w-full bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border rounded-md px-3.5 py-2 text-xs text-warm-text dark:text-darkWarm-text placeholder-warm-dim dark:placeholder-darkWarm-dim focus:outline-none focus:border-warm-accent dark:focus:border-darkWarm-accent transition-colors font-sans"
            />
          </div>
        )}
      </div>

      {/* Code Editor Panel */}
      <div className="bg-warm-surface dark:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border rounded-lg p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-warm-text dark:text-darkWarm-text font-mono flex items-center gap-1.5">
            <Code2 className="h-3.5 w-3.5 text-warm-accent dark:text-darkWarm-accent" />
            <span>Code Content</span>
            <span className="text-warm-accent dark:text-darkWarm-accent">*</span>
          </label>
          <span className="text-[11px] font-mono text-warm-dim dark:text-darkWarm-dim">
            Monospace · Tab friendly
          </span>
        </div>
        <textarea
          required
          rows={14}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Paste or write snippet code here..."
          className="w-full bg-warm-codeBg dark:bg-darkWarm-codeBg border border-warm-border dark:border-darkWarm-border rounded-md p-3.5 text-xs sm:text-sm text-warm-text dark:text-darkWarm-text font-mono leading-relaxed focus:outline-none focus:border-warm-accent dark:focus:border-darkWarm-accent transition-colors resize-y"
          spellCheck={false}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-md border border-warm-border dark:border-darkWarm-border bg-warm-surface hover:bg-warm-surfaceRaised dark:bg-darkWarm-surface dark:hover:bg-darkWarm-surfaceRaised text-warm-text dark:text-darkWarm-text text-xs font-mono transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 bg-warm-accent hover:bg-warm-accentHover text-white dark:bg-darkWarm-accent dark:hover:bg-darkWarm-accentHover dark:text-[#18191D] font-semibold px-4.5 py-2 rounded-md text-xs font-mono transition-all shadow-xs active:scale-[0.98] cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              <span>{isEdit ? 'Update Snippet' : 'Save Snippet'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SnippetForm;
