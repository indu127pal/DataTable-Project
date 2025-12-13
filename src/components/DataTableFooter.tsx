 
import React from 'react';
import { Box, Typography } from '@mui/material';

type Props = { results: number; selected: number; height?: number };

export default function DataTableFooter({ results, selected, height = 56 }: Props) {
  return (
    <Box component="footer" role="status" aria-live="polite" sx={{ position: 'sticky', bottom: 0, zIndex: 2, background: 'transparent', borderTop: `1px solid rgba(0,0,0,0.04)`, height, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
      <Typography variant="body2"><strong>{results}</strong> results</Typography>
      <Typography variant="body2"><strong>{selected}</strong> selected</Typography>
    </Box>
  );
}
