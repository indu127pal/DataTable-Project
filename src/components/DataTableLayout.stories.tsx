import React, { useState } from 'react';
import { StoryObj, Meta } from '@storybook/react';
import DataTableToolbar from './DataTableToolbar';
import DataTableFooter from './DataTableFooter';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { Character } from '../types';

const sampleRows: Character[] = Array.from({ length: 80 }).map((_, i) => ({ id: String(i+1), name: `Character ${i+1}`, location: `Town ${i%8}`, health: ['Healthy','Injured','Critical'][i%3] as Character['health'], power: Math.floor(Math.random()*300)+50, viewed: false }));

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'location', headerName: 'Location', width: 140 },
  { field: 'health', headerName: 'Health', width: 140 },
  { field: 'power', headerName: 'Power', width: 120, type: 'number' },
];

export default {
  title: 'Layout/DataTableShell',
  component: DataGrid,
} as Meta<typeof DataGrid>;

type Story = StoryObj<typeof DataGrid>;

export const Shell: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    const [healthFilter, setHealthFilter] = useState<string[]>([]);
    const [selectionCount, setSelectionCount] = useState(0);
    return (
      <Box sx={{ height: 600, display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: 1 }}>
        <DataTableToolbar
          search={search}
          setSearch={setSearch}
          healthFilter={healthFilter}
          setHealthFilter={setHealthFilter}
          sortField={'power'}
          sortOrder={'desc'}
          setSort={() => {}}
          selectionCount={selectionCount}
          onMarkViewed={() => {}}
          onMarkUnviewed={() => {}}
          clearViewed={() => {}}
          resetPagination={() => {}}
          clearSelection={() => {}}
        />
        <Box sx={{ height: '100%' }}>
          <DataGrid rows={sampleRows} columns={columns} checkboxSelection onRowSelectionModelChange={(s: any) => setSelectionCount((s?.ids?.size ?? s?.length ?? 0))} />
        </Box>
        <DataTableFooter results={sampleRows.length} selected={selectionCount} height={56} />
      </Box>
    );
  }
}
