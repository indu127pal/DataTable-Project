import React, { useState } from 'react';
import HealthFilterHeader from './HealthFilterHeader';
import type { StoryObj, Meta } from '@storybook/react';

export default {
  title: 'Components/HealthFilterHeader',
  component: HealthFilterHeader,
} as Meta<typeof HealthFilterHeader>;

type Story = StoryObj<typeof HealthFilterHeader>;

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return <HealthFilterHeader value={value} onChange={setValue} />;
  }
};
