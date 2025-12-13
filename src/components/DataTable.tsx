import React, { useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Box, Typography, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSort, setHealthFilter, markViewed, markUnviewed, clearViewed } from "../store/tableSlice";
import useCharacters from '../hooks/useCharacters';
import DataTableToolbar from './DataTableToolbar';
import DataTableFooter from './DataTableFooter';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HealthFilterHeader from "./HealthFilterHeader";
import { Character } from '../types';

export default function DataTable() {
  // controls for client-side operations
  const dispatch = useAppDispatch();
  const tableState = useAppSelector(s => s.table);
  const { rows, setRows, loading } = useCharacters(tableState.viewedIds);
  const sortField = tableState.sortField;
  const sortOrder = tableState.sortOrder;
  const [search, setSearch] = useState("");
  const healthFilter = tableState.healthFilter;
  const [selection, setSelection] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
  const selectionCount = useMemo(() => (selection?.ids ? selection.ids.size : 0), [selection]);
  const [density, setDensity] = useState<'comfortable'|'standard'|'compact'>('comfortable');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // `useCharacters` already maps the `viewed` attribute based on Redux's `viewedIds` and reloads on changes.

  const columns: GridColDef[] = useMemo(() => ([
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "location", headerName: "Location", width: 140 },
    {
      field: "health",
      headerName: "Health",
      width: 160,
      headerAlign: "left",
            renderHeader: () => <HealthFilterHeader value={healthFilter} onChange={(s) => { dispatch(setHealthFilter(s)); }} />
    },
    { field: "power", headerName: "Power", width: 140, type: 'number', sortable: true,
      renderHeader: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>Power</Typography>
        <IconButton aria-label="toggle power sort" size="small" onClick={() => {
          // toggle sort order or set field (via Redux)
          if (sortField === 'power') dispatch(setSort({ field: 'power', order: sortOrder === 'asc' ? 'desc' : 'asc' }));
          else { dispatch(setSort({ field: 'power', order: 'desc' })); }
        }}>
          {sortField === 'power' ? (sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />) : <ArrowDropDownIcon />}
        </IconButton>
      </Box>
    ) }
  ] as GridColDef[]).map(c => ({ ...c, hide: isMobile && (c.field === 'location' || c.field === 'health') })), [isMobile, sortField, sortOrder, healthFilter]);



  const displayedRows = useMemo(() => {
    // compute displayed rows: filter, search, sort (client-side)
    let out = rows.slice();
    if (healthFilter.length) out = out.filter(r => healthFilter.includes(r.health));
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(r => r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q));
    }
    if (sortField) {
      out.sort((a,b) => {
        const fa = (a as any)[sortField];
        const fb = (b as any)[sortField];
        if (fa == null && fb == null) return 0;
        if (fa == null) return -1;
        if (fb == null) return 1;
        if (typeof fa === 'number' && typeof fb === 'number') return sortOrder === 'asc' ? fa - fb : fb - fa;
        return sortOrder === 'asc' ? String(fa).localeCompare(String(fb)) : String(fb).localeCompare(String(fa));
      });
    }
    return out;
  }, [rows, healthFilter, search, sortField, sortOrder]);

  const FOOTER_HEIGHT = 56;
  const handleMark = (viewed: boolean) => {
    const allIds = selection?.ids ? Array.from(selection.ids).map(String) : [];
    const visibleIds = allIds.filter(id => displayedRows.some(r => r.id === id));
    console.log(viewed ? 'markViewed' : 'markUnviewed', { allIds, visibleIds });
    // update local rows (affect all selected ids regardless of filters)
    setRows(prev => prev.map(r => allIds.includes(r.id) ? { ...r, viewed } : r));
    if (viewed) dispatch(markViewed(allIds));
    else dispatch(markUnviewed(allIds));
  };
  const resetPagination = () => setPaginationModel({ page: 0, pageSize: 25 });
  const resetDensity = () => setDensity('comfortable');
  const clearSelection = () => setSelection({ type: 'include', ids: new Set() });
  return (
    <Box sx={{ height: '100%', width: "100%", display: 'grid', gridTemplateRows: 'auto 1fr auto', position: 'relative', minHeight: 0 }}>
      <div>
        <DataTableToolbar
          search={search}
          setSearch={setSearch}
          healthFilter={healthFilter}
          setHealthFilter={(s) => dispatch(setHealthFilter(s))}
          sortField={sortField}
          sortOrder={sortOrder}
          setSort={(p) => dispatch(setSort(p))}
          selectionCount={selectionCount}
          onMarkViewed={() => handleMark(true)}
          onMarkUnviewed={() => handleMark(false)}
          clearViewed={() => dispatch(clearViewed())}
          resetPagination={() => resetPagination()}
          resetDensity={() => resetDensity()}
          clearSelection={() => clearSelection()}
          density={density}
          setDensity={(d) => setDensity(d)}
        />

      </div>
      <div style={{ minHeight: 0 }} data-density={density} data-page={paginationModel.page}>
        <motion.div animate={{ boxShadow: selectionCount > 0 ? '0 12px 36px rgba(99,102,241,0.12)' : 'transparent', scale: selectionCount > 0 ? 1.003 : 1 }} transition={{ type: 'spring', duration: 0.25 }} style={{ height: '100%', minHeight: 0 }}>
      <DataGrid
        rows={displayedRows}
        columns={columns}
          style={{ height: '100%' }}
        density={density}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={(p) => setPaginationModel(p)}
        checkboxSelection
        onRowSelectionModelChange={(newSel: GridRowSelectionModel) => setSelection(newSel)}
        rowSelectionModel={selection}
        density="comfortable"
        aria-label="Characters table"
        loading={loading}
        getRowClassName={(params) => {
          const classes: string[] = [];
          if (params.row?.viewed) classes.push('dg-row-viewed');
          return classes.join(' ');
        }}
        sx={{
          border: 'none',
          background: theme.palette.background.paper,
            '& .MuiDataGrid-columnHeaders': { backgroundColor: theme.palette.action.hover, color: theme.palette.text.primary, fontWeight: 700, position: 'sticky', top: 0, zIndex: 1 },
            '& .MuiDataGrid-virtualScroller': { paddingBottom: `${FOOTER_HEIGHT}px` },
          '& .dg-row-viewed': { opacity: 0.65, textDecoration: 'line-through', color: theme.palette.text.secondary },
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
        }}
      />
        </motion.div>
      </div>

      {/* Sticky footer */}
      <div>
        <DataTableFooter results={displayedRows.length} selected={selectionCount} height={FOOTER_HEIGHT} />
      </div>
    </Box>
  );
}
