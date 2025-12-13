import React, { useMemo, useState } from 'react';
import './App.css';

import { Container, CssBaseline, Box, Typography, IconButton, Switch } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "./theme";
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import DataTable from "./components/DataTable";

function App() {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => getTheme(mode), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 2, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Dashboard — DataGrid</Typography>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')} sx={{ mr: 1 }} aria-label="toggle color mode">
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
            <Switch checked={mode === 'dark'} onChange={() => setMode(prev => prev === 'light' ? 'dark' : 'light')} inputProps={{ 'aria-label': 'toggle dark mode' }} />
          </Box>
        </Box>
        <Box sx={{ minHeight: 0, mb: 6, flex: 1 }}>
          <DataTable />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App
