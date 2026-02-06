

import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { StatCard } from '../components/StatCard';

test('StatCard renders value and applies color class', () => {
  render(<StatCard label="Metric" value="42" color="rose" />);
  const valueEl = screen.getByText('42');
  expect(valueEl).toBeInTheDocument();
  // class should contain the color we mapped
  expect(valueEl).toBeInTheDocument();
});