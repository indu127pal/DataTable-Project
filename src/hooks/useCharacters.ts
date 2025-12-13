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
    axios.get<Character[]>('http://localhost:4000/characters')
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

 
