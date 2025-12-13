import { createTheme } from "@mui/material/styles";

export const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: { main: "#6C5CE7" },
    secondary: { main: "#00B894" },
    background: mode === 'light' ? { default: "#F6F7FB", paper: "#FFFFFF" } : { default: "#0b1220", paper: "#0f1724" }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiDataGrid: {
      styleOverrides: { root: { boxShadow: "0 8px 24px rgba(16,24,40,0.08)" } }
    },
    MuiButton: {
      styleOverrides: {
          background: mode === 'light' ? 'transparent' : '#071022'
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          fontFamily: 'Inter, Roboto, sans-serif',
          // '&:hover': mode === 'light' ? { backgroundColor: "antiquewhite" } : { backgroundColor: "white" },
          '&.Mui-selected, &.Mui-selected:hover': mode === 'light' ? { backgroundColor: 'antiquewhite' } :  { backgroundColor: '#1e293b' }
        },
        columnHeaders: {
          backgroundColor: "#F3F4F9",
          color: "#0f172a",
          fontWeight: 700
        },
        row: {
          '&:hover': mode === 'light' ? { backgroundColor: 'antiquewhite' } :  { backgroundColor: '#1e293b' },
          '&.Mui-selected, &.Mui-selected:hover': mode === 'light' ? { backgroundColor: 'antiquewhite' } :  { backgroundColor: '#1e293b' }
        }
      }
    }
  },
  typography: { fontFamily: ['Inter','Roboto','Helvetica','Arial','sans-serif'].join(","), h6: { fontWeight: 700 } }
});

export default getTheme;

