import React from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import HealthFilterHeader from './HealthFilterHeader';
import { Character } from '../types';

type Props = {
  search: string;
  setSearch: (s: string) => void;
  healthFilter: string[];
  setHealthFilter: (s: string[]) => void;
  sortField: keyof Character | null;
  sortOrder: 'asc' | 'desc';
  setSort: (p: { field: keyof Character | null; order: 'asc' | 'desc' }) => void;
  selectionCount: number;
  onMarkViewed: () => void;
  onMarkUnviewed: () => void;
  clearViewed: () => void;
  resetPagination: () => void;
  clearSelection: () => void;
};

export default function DataTableToolbar({ search, setSearch, healthFilter, setHealthFilter, sortField, sortOrder, setSort, selectionCount, onMarkViewed, onMarkUnviewed, clearViewed, resetPagination, clearSelection }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Box component="div" role="toolbar" aria-label="table toolbar" sx={{ position: 'sticky', top: 0, zIndex: 2, display: "flex", justifyContent: "space-between", mb: 1, gap: 2, p: 1.5, background: 'transparent', borderRadius: 2, alignItems: 'center' }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField id="table-search" size="small" placeholder="Search name or location" value={search} onChange={(e) => setSearch(e.target.value)} inputProps={{ 'aria-label': 'search characters by name or location' }} />
          <Button variant="outlined" onClick={() => { setSearch(''); setHealthFilter([]); setSort({ field: 'power', order: 'desc' }); clearViewed(); resetPagination(); clearSelection(); }}>Clear Filters</Button>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-field-label">Sort</InputLabel>
            <Select labelId="sort-field-label" label="Sort" value={`${String(sortField)}:${sortOrder}`} onChange={(e) => {
              const [f, o] = String(e.target.value).split(':');
              setSort({ field: f as any as keyof Character, order: o as 'asc'|'desc' });
            }}>
              <MenuItem value="power:desc">Power (High → Low)</MenuItem>
              <MenuItem value="power:asc">Power (Low → High)</MenuItem>
              <MenuItem value="name:asc">Name (A → Z)</MenuItem>
              <MenuItem value="name:desc">Name (Z → A)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" alignItems="center">
          <Button component={motion.button} aria-label="mark viewed" whileTap={{ scale: 0.97 }} variant="contained" onClick={onMarkViewed} disabled={selectionCount === 0} sx={{ mr: 1 }}>Mark viewed</Button>
          <Button component={motion.button} aria-label="mark unviewed" whileTap={{ scale: 0.97 }} variant="outlined" onClick={onMarkUnviewed} disabled={selectionCount === 0}>Mark unviewed</Button>
        </Box>
      </Box>
    </motion.div>
  );
}
