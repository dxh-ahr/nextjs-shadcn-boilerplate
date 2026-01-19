import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

/**
 * Custom render function that includes any providers or global setup
 * Use this instead of the default render from @testing-library/react
 *
 * @example
 * ```tsx
 * import { render, screen } from '@/test-utils';
 *
 * test('renders component', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeInTheDocument();
 * });
 * ```
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { ...options });

// Re-export everything from @testing-library/react
export * from "@testing-library/react";

// Override render method
export { customRender as render };
