import { useState, useEffect, useCallback } from 'react';
import { supabase, Note } from '../lib/supabase';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('pinned', { ascending: false })
      .order('updated_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setNotes(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (title: string, content: string, color: string) => {
    const { data, error } = await supabase
      .from('notes')
      .insert({ title, content, color })
      .select()
      .single();

    if (error) throw error;
    setNotes(prev => [data, ...prev]);
    return data as Note;
  };

  const updateNote = async (id: string, updates: Partial<Pick<Note, 'title' | 'content' | 'color' | 'pinned'>>) => {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setNotes(prev => {
      const updated = prev.map(n => n.id === id ? data as Note : n);
      return updated.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
    });
    return data as Note;
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return { notes, loading, error, createNote, updateNote, deleteNote, refetch: fetchNotes };
}
