import React, { useState, useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Load language definitions
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

import { Copy, Check, Terminal } from 'lucide-react';

const CodeBlock = ({
  code = '',
  language = 'javascript',
  maxHeight = 'max-h-80',
  showCopy = true,
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const getGrammarLang = (lang) => {
    const l = (lang || '').toLowerCase();
    if (l === 'js' || l === 'react') return 'javascript';
    if (l === 'ts') return 'typescript';
    if (l === 'py') return 'python';
    if (l === 'c++') return 'cpp';
    if (l === 'c#') return 'csharp';
    if (l === 'html' || l === 'xml') return 'markup';
    if (l === 'sh' || l === 'shell') return 'bash';
    return l || 'javascript';
  };

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const prismLang = getGrammarLang(language);
  const lines = (code || '').split('\n');
  const lineCount = lines.length;

  return (
    <div className="rounded-md border border-warm-border dark:border-darkWarm-border bg-warm-codeBg dark:bg-darkWarm-codeBg overflow-hidden transition-colors shadow-2xs">
      {/* Code Header Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-warm-border dark:border-darkWarm-border bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-warm-text dark:text-darkWarm-text uppercase tracking-wide">
            <Terminal className="h-3.5 w-3.5 text-warm-accent dark:text-darkWarm-accent" />
            {language}
          </span>
          <span className="text-[11px] font-mono text-warm-dim dark:text-darkWarm-dim">
            · {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </span>
        </div>

        {showCopy && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono text-warm-muted dark:text-darkWarm-muted hover:text-warm-text dark:hover:text-darkWarm-text bg-warm-surface/60 hover:bg-warm-surface dark:bg-darkWarm-surface/60 dark:hover:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border transition-colors cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Code Body with Line Numbers */}
      <div className={`overflow-x-auto overflow-y-auto ${maxHeight} text-[12px] font-mono leading-relaxed`}>
        <div className="flex min-w-full">
          {showLineNumbers && (
            <div className="select-none py-3 px-2.5 text-right font-mono text-warm-dim dark:text-darkWarm-dim border-r border-warm-border/50 dark:border-darkWarm-border/50 bg-warm-surfaceRaised/30 dark:bg-darkWarm-surfaceRaised/30 shrink-0 text-[11px] leading-relaxed">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}

          <pre className="p-3 m-0 flex-1 overflow-x-auto font-mono text-[12px] leading-relaxed">
            <code ref={codeRef} className={`language-${prismLang} font-mono`}>
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
