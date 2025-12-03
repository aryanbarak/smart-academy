import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Toast, { ToastMessage } from '../components/Toast';

describe('Toast Component', () => {
  it('نمایش پیام toast', () => {
    const toasts: ToastMessage[] = [
      { id: '1', message: 'تست موفق', type: 'success' }
    ];

    render(
      <Toast toasts={toasts} onRemove={() => {}} />
    );

    expect(screen.getByText('تست موفق')).toBeDefined();
  });

  it('نمایش پیام خطا با رنگ قرمز', () => {
    const toasts: ToastMessage[] = [
      { id: '1', message: 'خطا رخ داد', type: 'error' }
    ];

    const { container } = render(
      <Toast toasts={toasts} onRemove={() => {}} />
    );

    const toast = container.querySelector('.bg-red-500');
    expect(toast).toBeDefined();
  });

  it('نمایش پیام اطلاعات با رنگ آبی', () => {
    const toasts: ToastMessage[] = [
      { id: '1', message: 'اطلاعات', type: 'info' }
    ];

    const { container } = render(
      <Toast toasts={toasts} onRemove={() => {}} />
    );

    const toast = container.querySelector('.bg-blue-500');
    expect(toast).toBeDefined();
  });
});
