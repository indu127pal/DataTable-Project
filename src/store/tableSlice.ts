import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character } from '../types';

export type TableState = {
  sortField: keyof Character | null;
  sortOrder: 'asc' | 'desc';
  healthFilter: string[];
  viewedIds: Record<string, boolean>;
};

const initialState: TableState = {
  sortField: 'power',
  sortOrder: 'desc',
  healthFilter: [],
  viewedIds: {}
};

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setSort(state, action: PayloadAction<{ field: keyof Character | null; order: 'asc' | 'desc' }>) {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
    },
    setHealthFilter(state, action: PayloadAction<string[]>) {
      state.healthFilter = action.payload;
    },
    markViewed(state, action: PayloadAction<string[]>) {
      action.payload.forEach(id => { state.viewedIds[id] = true; });
    },
    markUnviewed(state, action: PayloadAction<string[]>) {
      action.payload.forEach(id => { delete state.viewedIds[id]; });
    }
    ,
    clearViewed(state) {
      state.viewedIds = {};
    }
  }
});

export const { setSort, setHealthFilter, markViewed, markUnviewed, clearViewed } = tableSlice.actions;
export default tableSlice.reducer;
