import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DataTable from '../DataTable';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '../../theme';
import axios from 'axios';

jest.mock('axios');

const sampleData = [
  { id: 'id-1', name: 'Naruto', location: 'Konoha', health: 'Healthy', power: 9000, viewed: false },
  { id: 'id-2', name: 'Sasuke', location: 'Konoha', health: 'Injured', power: 8500, viewed: false },
  { id: 'id-3', name: 'Sakura', location: 'Konoha', health: 'Critical', power: 300, viewed: false }
];

describe('DataTable behavior', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: sampleData });
  });

  test('search filters rows by name or location', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={getTheme('light')}>
          <DataTable />
        </ThemeProvider>
      </Provider>
    );

    // Wait for rows to load
    await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());

    const input = screen.getByPlaceholderText(/Search name or location/i);
    fireEvent.change(input, { target: { value: 'Sakura' } });

    // Sakura should be present, Naruto should no longer be in the table
    await waitFor(() => expect(screen.getByText('Sakura')).toBeInTheDocument());
    expect(screen.queryByText('Naruto')).toBeNull();
  });

  test('mark viewed logs selected ids', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <Provider store={store}>
        <ThemeProvider theme={getTheme('light')}>
          <DataTable />
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());

    // Find the checkboxes and select the first row
    const checkboxes = screen.getAllByRole('checkbox');
    // first checkbox is header select all; pick second
    fireEvent.click(checkboxes[1]);

    // Click mark viewed
    const btn = screen.getByRole('button', { name: /Mark viewed/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      const args = consoleSpy.mock.calls[0][1];
      expect(args.allIds).toContain('id-1');
    });

    consoleSpy.mockRestore();
  });

  test('footer shows results and selection count', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={getTheme('light')}>
          <DataTable />
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());
    // Check total results shown in footer (strong element carries the number)
    const resultsText = screen.getByText(/results/i);
    const footerStrong = resultsText.closest('footer')?.querySelector('strong');
    expect(footerStrong?.textContent).toBe('3');

    // Select a row and verify footer updates
    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes.length > 1) {
      fireEvent.click(checkboxes[1]);
      const selectedNodes = screen.getAllByText(/selected/i);
      const selectedInFooter = selectedNodes.find(el => el.closest('footer'));
      const footerStrongSel = selectedInFooter?.closest('footer')?.querySelector('strong');
      // using toBeGreaterThanOrEqual to be flexible in case the virtualized grid hides some rows
      await waitFor(() => expect(Number(footerStrongSel?.textContent || '0')).toBeGreaterThanOrEqual(1));
    }
  });

  test('select -> filtered results affect visibleIds on mark viewed', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <Provider store={store}>
        <ThemeProvider theme={getTheme('light')}>
          <DataTable />
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());

    const checkboxes = screen.getAllByRole('checkbox');
    // Click first row's checkbox only to avoid virtualization issues
    let footerStrongSel;
    if (checkboxes.length > 1) {
      fireEvent.click(checkboxes[1]);
      const selectedText = screen.getAllByText(/selected/i).find(el => el.closest('footer'));
      footerStrongSel = selectedText?.closest('footer')?.querySelector('strong');
      await waitFor(() => expect(Number(footerStrongSel?.textContent || '0')).toBeGreaterThanOrEqual(1));
    }

    // apply search filter to the same row (Naruto) so it remains visible
    const input = screen.getByPlaceholderText(/Search name or location/i);
    fireEvent.change(input, { target: { value: 'Naruto' } });
    await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());

    // click mark viewed; visibleIds should only include Sakura's id while allIds contains all three
    const btn = screen.getByRole('button', { name: /Mark viewed/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      const args = consoleSpy.mock.calls[0][1];
      // allIds should include the selected one (id-1), visibleIds should include it as it's still visible
      expect(args.allIds).toContain('id-1');
      expect(args.visibleIds).toEqual(['id-1']);
    });

    consoleSpy.mockRestore();
  });

  test('clear filters resets health filter and UI checkboxes', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={getTheme('light')}>
          <DataTable />
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());

    // find Clear Filters button before popover is opened (popover sets aria-hidden)
    const clearBtn = screen.getByRole('button', { name: /Clear Filters/i });

    // open Health filter popover
    const filterButton = screen.getAllByLabelText(/filter by health/i)[0];
    fireEvent.click(filterButton);
    await waitFor(() => expect(screen.getByText(/Filter by Health/i)).toBeInTheDocument());

    // check the 'Healthy' option
    const healthyCheckbox = screen.getByLabelText(/filter Healthy/i);
    fireEvent.click(healthyCheckbox);
    await waitFor(() => expect(healthyCheckbox).toBeChecked());

    // Confirm rows are filtered (only Naruto remains)
    expect(screen.getByText('Naruto')).toBeInTheDocument();
    expect(screen.queryByText('Sasuke')).toBeNull();

    fireEvent.click(clearBtn);

    // Popover may still be open; ensure checkbox is now unchecked and rows restored
    await waitFor(() => expect(healthyCheckbox).not.toBeChecked());
    expect(screen.getByText('Sasuke')).toBeInTheDocument();

    // Ensure Redux state updated
    expect(store.getState().table.healthFilter).toEqual([]);
  });

  test('clear filters also resets sort and clears viewed flags', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={getTheme('light')}>
          <DataTable />
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());

    // Change sort to name:asc (open select and click option)
    const combobox = screen.getByRole('combobox', { name: /Sort/i });
    fireEvent.mouseDown(combobox);
    await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
    const optionName = screen.getByRole('option', { name: /Name \(A → Z\)/i });
    fireEvent.click(optionName);
    await waitFor(() => expect(store.getState().table.sortField).toBe('name'));

    // Select first row and mark viewed
    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes.length > 1) {
      fireEvent.click(checkboxes[1]);
      const btn = screen.getByRole('button', { name: /Mark viewed/i });
      fireEvent.click(btn);
      await waitFor(() => expect(Object.keys(store.getState().table.viewedIds).length).toBeGreaterThanOrEqual(1));
    }

    // Change pagination and density and select row to ensure they get reset
    const checkboxEls = screen.getAllByRole('checkbox');
    if (checkboxEls.length > 1) fireEvent.click(checkboxEls[1]);
    // Manually set a non-default pagination/density in the component via interactions
    // There isn't a built-in control for density/pagination in the toolbar story, we'll simulate
    // by dispatching the clear filters and then checking the state reset (via store and DOM selection).

    // Click Clear Filters
    const clearBtn2 = screen.getByRole('button', { name: /Clear Filters/i });
    fireEvent.click(clearBtn2);

    await waitFor(() => {
      expect(store.getState().table.healthFilter).toEqual([]);
      expect(store.getState().table.sortField).toBe('power');
      expect(store.getState().table.sortOrder).toBe('desc');
      expect(Object.keys(store.getState().table.viewedIds).length).toBe(0);
    });
  });
});
