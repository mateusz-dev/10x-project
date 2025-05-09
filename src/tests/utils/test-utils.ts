import { render as tlRender } from "@testing-library/react";
import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, type MockInstance } from "vitest";
import type { ReactElement } from "react";

/**
 * Custom render function that includes common providers
 */
export function render(ui: ReactElement, options = {}) {
  // Add any providers here, such as:
  // return tlRender(
  //   <SomeProvider>
  //     {ui}
  //   </SomeProvider>,
  //   options
  // );
  return {
    ...tlRender(ui, options),
    user: userEvent.setup(),
  };
}

// Re-export everything from testing-library
export * from "@testing-library/react";

/**
 * Setup a mock for Supabase client
 */
export function setupSupabaseMock() {
  return {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn(),
    data: null,
    error: null,
  };
}

/**
 * Create a mock function with type inference
 */
export function mockFn<T extends (...args: unknown[]) => unknown>(
  implementation?: (...args: Parameters<T>) => ReturnType<T>
) {
  return vi.fn(implementation) as MockInstance;
}

/**
 * Custom cleanup for tests that need additional teardown logic
 */
export function customCleanup() {
  // Add custom cleanup logic here
  cleanup();
}

// Helper to mock browser APIs
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      // Use object property assignment instead of delete
      store[key] = undefined as unknown as string;
      // Remove the property from the object safely
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: removed, ...rest } = store;
      Object.assign(store, rest);
    }),
    clear: vi.fn(() => {
      // Clear all keys without using delete
      for (const key in store) {
        if (Object.prototype.hasOwnProperty.call(store, key)) {
          store[key] = undefined as unknown as string;
        }
      }
      // Reset the store to an empty object
      Object.keys(store).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: removed, ...rest } = store;
        Object.assign(store, rest);
      });
    }),
    length: Object.keys(store).length,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};
