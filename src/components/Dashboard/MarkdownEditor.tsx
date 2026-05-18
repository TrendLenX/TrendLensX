import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, EyeOff, Bold, Italic, Heading2, Link, List, Quote, Code } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

function ToolbarButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
    >
      {children}
    </button>
  );
}

export default function MarkdownEditor({ value, onChange, height = 480 }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const insert = useCallback(
    (before: string, after: string = '', placeholder: string = '') => {
      const ta = document.getElementById('md-editor-textarea') as HTMLTextAreaElement | null;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = value.slice(start, end) || placeholder;
      const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
      onChange(newValue);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start + before.length, start + before.length + selected.length);
      }, 0);
    },
    [value, onChange]
  );

  const insertLine = useCallback(
    (prefix: string) => {
      const ta = document.getElementById('md-editor-textarea') as HTMLTextAreaElement | null;
      if (!ta) return;
      const start = ta.selectionStart;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart);
      onChange(newValue);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start + prefix.length, start + prefix.length);
      }, 0);
    },
    [value, onChange]
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-3 py-2">
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => insert('**', '**', 'bold text')} title="Bold">
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => insert('*', '*', 'italic text')} title="Italic">
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <ToolbarButton onClick={() => insertLine('## ')} title="Heading">
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => insertLine('> ')} title="Blockquote">
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => insertLine('- ')} title="List">
            <List className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <ToolbarButton onClick={() => insert('`', '`', 'code')} title="Inline code">
            <Code className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => insert('[', '](url)', 'link text')}
            title="Link"
          >
            <Link className="w-4 h-4" />
          </ToolbarButton>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(p => !p)}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-sm rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {showPreview ? (
        <div
          className="p-5 overflow-y-auto prose prose-gray max-w-none"
          style={{ minHeight: height }}
        >
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <textarea
          id="md-editor-textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Write your post in Markdown...

## Getting Started

Use the toolbar above to format your text, or type Markdown directly.

### Tips
- **Bold** with **text**
- *Italic* with *text*
- Add headings with ##
- Create lists with -"
          className="w-full p-4 font-mono text-sm text-gray-900 bg-white focus:outline-none resize-none leading-relaxed"
          style={{ minHeight: height }}
        />
      )}
    </div>
  );
}
