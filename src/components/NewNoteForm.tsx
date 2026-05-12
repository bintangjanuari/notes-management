import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

const NOTE_COLORS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Yellow', value: '#fef9c3' },
  { label: 'Green', value: '#dcfce7' },
  { label: 'Blue', value: '#dbeafe' },
  { label: 'Pink', value: '#fce7f3' },
  { label: 'Orange', value: '#ffedd5' },
  { label: 'Gray', value: '#f3f4f6' },
];

interface NewNoteFormProps {
  onCreate: (title: string, content: string, color: string) => Promise<void>;
}

export function NewNoteForm({ onCreate }: NewNoteFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [saving, setSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (title.trim() || content.trim()) {
          handleSave();
        } else {
          setExpanded(false);
        }
      }
    };
    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded, title, content]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      setExpanded(false);
      return;
    }
    setSaving(true);
    try {
      await onCreate(title.trim(), content.trim(), color);
      setTitle('');
      setContent('');
      setColor('#ffffff');
      setExpanded(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setTitle('');
    setContent('');
    setColor('#ffffff');
    setExpanded(false);
  };

  return (
  <div ref={containerRef} className="w-full max-w-lg mx-auto px-2 sm:px-0">
    {!expanded ? (
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center gap-3 px-5 py-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 text-gray-400 hover:text-gray-600"
      >
        <Plus size={18} />
        <span className="text-sm">Buat catatan baru...</span>
      </button>
    ) : (
      <div
        className="rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-200"
        style={{ backgroundColor: color }}
      >
        {/* Content */}
        <div className="p-4 flex flex-col gap-3">
          <input
            className="w-full bg-transparent font-semibold text-gray-800 placeholder-gray-400 outline-none border-b border-gray-200 pb-2 text-sm sm:text-base"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Judul"
            autoFocus
          />

          <textarea
            className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none resize-none text-sm sm:text-base leading-relaxed"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Tulis catatan..."
            rows={4}
          />
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Color Picker */}
          <div className="flex flex-wrap gap-2">
            {NOTE_COLORS.map(c => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  color === c.value
                    ? 'border-gray-600 scale-110'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex w-full sm:w-auto gap-2">
            <button
              onClick={handleDiscard}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm text-gray-600 hover:bg-black/10 transition-colors"
            >
              <X size={14} />
              Batal
            </button>

            <button
              onClick={handleSave}
              disabled={saving || (!title.trim() && !content.trim())}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors disabled:opacity-40"
            >
              <Plus size={14} />
              Simpan
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}
