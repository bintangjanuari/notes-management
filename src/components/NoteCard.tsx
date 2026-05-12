import { useState } from 'react';
import { Pin, PinOff, Trash2, CreditCard as Edit3, Check, X } from 'lucide-react';
import { Note } from '../lib/supabase';

const NOTE_COLORS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Yellow', value: '#fef9c3' },
  { label: 'Green', value: '#dcfce7' },
  { label: 'Blue', value: '#dbeafe' },
  { label: 'Pink', value: '#fce7f3' },
  { label: 'Orange', value: '#ffedd5' },
  { label: 'Gray', value: '#f3f4f6' },
];

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Pick<Note, 'title' | 'content' | 'color' | 'pinned'>>) => Promise<Note>;
  onDelete: (id: string) => Promise<void>;
}

export function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saving, setSaving] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(note.id, { title, content });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setEditing(false);
  };

  const handlePin = async () => {
    await onUpdate(note.id, { pinned: !note.pinned });
  };

  const handleDelete = async () => {
    if (confirm('Delete this note?')) {
      await onDelete(note.id);
    }
  };

  const handleColorChange = async (color: string) => {
    await onUpdate(note.id, { color });
    setShowColorPicker(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div
      className="group relative rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
      style={{ backgroundColor: note.color }}
    >
      {note.pinned && (
        <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1 shadow-sm">
          <Pin size={10} className="text-white" fill="white" />
        </div>
      )}

      <div className="p-4 flex-1">
        {editing ? (
          <div className="flex flex-col gap-2">
            <input
              className="w-full bg-transparent font-semibold text-gray-800 placeholder-gray-400 outline-none border-b border-gray-300 pb-1 text-sm"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Judul..."
              autoFocus
            />
            <textarea
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none resize-none text-sm leading-relaxed min-h-[80px]"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Tulis catatan..."
              rows={4}
            />
          </div>
        ) : (
          <>
            {note.title && (
              <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{note.title}</h3>
            )}
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap line-clamp-6">
              {note.content || <span className="text-gray-400 italic">Catatan kosong...</span>}
            </p>
          </>
        )}
      </div>

      <div className="px-4 pb-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">{formatDate(note.updated_at)}</span>

        {editing ? (
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-1.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Check size={13} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(v => !v)}
                className="p-1.5 rounded-lg hover:bg-black/10 transition-colors"
                title="Ubah warna"
              >
                <div className="w-3 h-3 rounded-full border border-gray-400" style={{ backgroundColor: note.color }} />
              </button>
              {showColorPicker && (
                <div className="absolute bottom-8 right-0 bg-white rounded-xl shadow-lg border border-gray-200 p-2 flex gap-1.5 z-10">
                  {NOTE_COLORS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => handleColorChange(c.value)}
                      className="w-5 h-5 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handlePin}
              className="p-1.5 rounded-lg hover:bg-black/10 transition-colors text-gray-500"
              title={note.pinned ? 'Lepas pin' : 'Sematkan'}
            >
              {note.pinned ? <PinOff size={13} /> : <Pin size={13} />}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg hover:bg-black/10 transition-colors text-gray-500"
              title="Edit"
            >
              <Edit3 size={13} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg hover:bg-red-100 hover:text-red-500 transition-colors text-gray-500"
              title="Hapus"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
