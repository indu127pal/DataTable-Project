import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import DataTableFooter from './DataTableFooter';

export default {
  title: 'Components/DataTableFooter',
  component: DataTableFooter,
  argTypes: {
    results: { control: { type: 'number', min: 0 } },
    selected: { control: { type: 'number', min: 0 } },
  }
} as Meta<typeof DataTableFooter>;

type Story = StoryObj<typeof DataTableFooter>;

export const Default: Story = {
  args: {
    results: 1200,
    selected: 0,
    height: 56,
  }
};
