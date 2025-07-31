// File Path: app/components/analysis/DiffHighlight.tsx
"use client";

import { diff_match_patch, DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL } from 'diff-match-patch';

interface DiffHighlightProps {
  originalText: string;
  suggestedText: string;
}

export default function DiffHighlight({ originalText, suggestedText }: DiffHighlightProps) {
  const dmp = new diff_match_patch();
  const safeOriginal = originalText || '';
  const safeSuggested = suggestedText || '';

  const diffs = dmp.diff_main(safeOriginal, safeSuggested);
  dmp.diff_cleanupSemantic(diffs);

  return (
    <span className="leading-relaxed">
      {diffs.map(([type, text], index) => {
        switch (type) {
          case DIFF_INSERT:
            return <span key={index} className="bg-green-100 text-green-800 font-medium rounded px-1.5 py-0.5">{text}</span>;
          case DIFF_DELETE:
            return <del key={index} className="bg-red-100 text-red-800 rounded px-1.5 py-0.5">{text}</del>;
          case DIFF_EQUAL:
            return <span key={index}>{text}</span>;
          default:
            return null;
        }
      })}
    </span>
  );
}