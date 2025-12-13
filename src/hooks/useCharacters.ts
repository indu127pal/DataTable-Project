import { useState, useEffect } from 'react';
import axios from 'axios';
import { Character } from '../types'

interface UseCharactersResult {
  rows: Character[];
  setRows: (fn: (r: Character[]) => Character[]) => void;
  loading: boolean;
}

export default function useCharacters(viewedIds: Record<string, boolean> | undefined): UseCharactersResult {
  const [rows, setRows] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const rawAPI = (import.meta.env.VITE_API_URL as string) || '/api';
    const API_BASE = rawAPI.replace(/\/$/, '');
    const API_CHARACTERS = API_BASE.endsWith('/characters') ? API_BASE : `${API_BASE}/characters`;
    axios.get<Character[]>(API_CHARACTERS)
      .then(res => {
        if (!mounted) return;
        setRows((res.data || []).map(r => ({ ...r, viewed: !!viewedIds?.[r.id] })));
      })
      .catch(() => setRows([]))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setRows(prev => prev.map(r => ({ ...r, viewed: !!viewedIds?.[r.id] })));
  }, [viewedIds]);

  return { rows, setRows, loading };
}

 
