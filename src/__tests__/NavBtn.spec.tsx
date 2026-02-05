/// <reference types="vitest" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import { NavBtn } from '../App';

test('NavBtn calls onClick when clicked', () => {
  const onClick = vi.fn();
  render(<NavBtn label="Click" onClick={onClick} icon={<span data-testid="ic" />} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalled();
});

test('NavBtn respects disabled', () => {
  const onClick = vi.fn();
  render(<NavBtn label="Disabled" onClick={onClick} disabled />);
  fireEvent.click(screen.getByRole('button'));
  expect(onClick).not.toHaveBeenCalled();
});