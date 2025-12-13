import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '../src/theme';
import { Provider } from 'react-redux';
import { store } from '../src/store';

export const decorators = [Story => (
  <Provider store={store}>
    <ThemeProvider theme={getTheme('light')}>
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    </ThemeProvider>
  </Provider>
)];

export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  controls: { expanded: true },
};
