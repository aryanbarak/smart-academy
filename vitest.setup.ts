import { afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Basic localStorage mock for tests that access it early.
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
})();

beforeAll(() => {
  // Attach mocks to global scope
  // @ts-expect-error happy-dom global typing
  global.localStorage = localStorageMock;

  // Mock matchMedia to avoid runtime errors in tests
  // @ts-expect-error happy-dom global typing
  global.matchMedia =
    global.matchMedia ||
    (() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
});

afterEach(() => {
  cleanup();
  localStorageMock.clear();
});
