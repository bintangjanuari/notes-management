import { useState, useMemo } from 'react';
import { StickyNote, Search, Pin, LayoutGrid, List } from 'lucide-react';
import { useNotes } from './hooks/useNotes';
import { NoteCard } from './components/NoteCard';
import { NewNoteForm } from './components/NewNoteForm';

export default function App() {
  const { notes, loading, error, createNote, updateNote, deleteNote } = useNotes();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter(n =>
      n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  const pinned = filtered.filter(n => n.pinned);
  const unpinned = filtered.filter(n => !n.pinned);

  const noteGrid = view === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'
    : 'flex flex-col gap-3 max-w-2xl';

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="bg-amber-400 rounded-lg p-1.5">
              <StickyNote size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-base tracking-tight">Notes</span>
          </div>

          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari catatan..."
                className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:bg-gray-200 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
              title="Grid"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
              title="List"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <NewNoteForm onCreate={createNote} />
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-400">Memuat catatan...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="bg-gray-100 rounded-2xl p-5">
              <StickyNote size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">
              {search ? 'Tidak ada catatan yang cocok' : 'Belum ada catatan. Buat yang pertama!'}
            </p>
          </div>
        ) : (
          <>
            {pinned.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Pin size={12} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Disematkan</span>
                </div>
                <div className={noteGrid}>
                  {pinned.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onUpdate={updateNote}
                      onDelete={deleteNote}
                    />
                  ))}
                </div>
              </section>
            )}

            {unpinned.length > 0 && (
              <section>
                {pinned.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lainnya</span>
                  </div>
                )}
                <div className={noteGrid}>
                  {unpinned.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onUpdate={updateNote}
                      onDelete={deleteNote}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
