import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

describe('App Component', () => {
  it('رندر کامپوننت App بدون خطا', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
  });

  it('نمایش عنوان Smart Academy در header', () => {
    render(<App />);
    const header = document.querySelector('h1');
    expect(header?.textContent).toContain('Smart Academy');
  });

  it('نمایش بخش لکسیون‌ها', () => {
    render(<App />);
    const matches = screen.getAllByText(/Lektionen/);
    expect(matches.length).toBeGreaterThan(0);
  });
});
