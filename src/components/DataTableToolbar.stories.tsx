import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import DataTableToolbar from './DataTableToolbar';

export default {
  title: 'Components/DataTableToolbar',
  component: DataTableToolbar,
  argTypes: {
    selectionCount: { control: { type: 'number', min: 0 } },
  }
} as Meta<typeof DataTableToolbar>;

type Story = StoryObj<typeof DataTableToolbar>;

export const Default: Story = {
  args: {
    search: '',
    setSearch: (s: string) => console.log('setSearch', s),
    healthFilter: [],
    setHealthFilter: (s: string[]) => console.log('setHealthFilter', s),
    sortField: 'power',
    sortOrder: 'desc',
    setSort: (p) => console.log('setSort', p),
    selectionCount: 0,
    onMarkViewed: () => console.log('onMarkViewed'),
    onMarkUnviewed: () => console.log('onMarkUnviewed'),
  }
};
