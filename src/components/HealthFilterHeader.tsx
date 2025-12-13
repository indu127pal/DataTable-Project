import React, { useState } from "react";
import { Box, IconButton, Popover, Checkbox, FormControlLabel, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const OPTIONS = ["Healthy", "Injured", "Critical"] as const;

export default function HealthFilterHeader({ value, onChange }: { value: string[]; onChange: (vals: string[]) => void; }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);
  const id = open ? 'health-filter-popover' : undefined;

  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="body2" sx={{ mr: 1, fontWeight: 600 }}>Health</Typography>
      <IconButton aria-label="filter by health" size="small" aria-controls={id} aria-expanded={open ? 'true' : undefined} aria-haspopup="menu" onClick={(e) => setAnchor(e.currentTarget)}>
        <FilterListIcon />
      </IconButton>
      <Popover id={id} open={open} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} aria-labelledby="health-filter-title">
        <Box p={2}>
          <Typography id="health-filter-title" variant="subtitle2">Filter by Health</Typography>
          <Box>
            {OPTIONS.map(opt => (
              <FormControlLabel key={opt} control={<Checkbox checked={value.includes(opt)} onChange={() => toggle(opt)} inputProps={{ "aria-label": `filter ${opt}` }} />} label={opt} />
            ))}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
