import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeProvider } from '../../../components/ThemeProvider/ThemeProvider';
import { useTheme } from '../../../components/ThemeProvider/useTheme';
import { ThemeContext } from '../../../components/ThemeProvider/ThemeContext';

expect.extend(toHaveNoViolations);

// Helper component that reads from context and exposes controls
const ThemeConsumer = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme('dark')}>Set dark</button>
      <button onClick={() => setTheme('light')}>Set light</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  let originalDocumentElementAttribute: string | null;

  beforeEach(() => {
    originalDocumentElementAttribute = document.documentElement.getAttribute('data-theme');
  });

  afterEach(() => {
    if (originalDocumentElementAttribute === null) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', originalDocumentElementAttribute);
    }
  });

  it('renders children', () => {
    render(
      <ThemeProvider>
        <span>child content</span>
      </ThemeProvider>,
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('provides default light theme via context', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('respects defaultTheme prop', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('sets data-theme on document.documentElement by default', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <span />
      </ThemeProvider>,
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('sets data-theme on a custom target element', () => {
    const target = document.createElement('div');
    document.body.appendChild(target);

    render(
      <ThemeProvider defaultTheme="dark" target={target}>
        <span />
      </ThemeProvider>,
    );

    expect(target).toHaveAttribute('data-theme', 'dark');
    document.body.removeChild(target);
  });

  it('does not set data-theme when target is null', () => {
    document.documentElement.removeAttribute('data-theme');
    render(
      <ThemeProvider target={null}>
        <span />
      </ThemeProvider>,
    );
    expect(document.documentElement).not.toHaveAttribute('data-theme');
  });

  it('updates data-theme when theme changes in uncontrolled mode', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    await userEvent.click(screen.getByRole('button', { name: 'Set dark' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('updates context theme when setTheme is called in uncontrolled mode', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    await userEvent.click(screen.getByRole('button', { name: 'Set dark' }));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('calls onThemeChange when setTheme is called in uncontrolled mode', async () => {
    const onThemeChange = vi.fn();
    render(
      <ThemeProvider defaultTheme="light" onThemeChange={onThemeChange}>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Set dark' }));
    expect(onThemeChange).toHaveBeenCalledOnce();
    expect(onThemeChange).toHaveBeenCalledWith('dark');
  });

  describe('controlled mode', () => {
    it('uses the controlled theme prop', () => {
      render(
        <ThemeProvider theme="dark">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('does not change internal theme when setTheme is called', async () => {
      render(
        <ThemeProvider theme="light">
          <ThemeConsumer />
        </ThemeProvider>,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Set dark' }));
      // Still light because controlled — internal state does not change
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('calls onThemeChange when setTheme is called in controlled mode', async () => {
      const onThemeChange = vi.fn();
      render(
        <ThemeProvider theme="light" onThemeChange={onThemeChange}>
          <ThemeConsumer />
        </ThemeProvider>,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Set dark' }));
      expect(onThemeChange).toHaveBeenCalledOnce();
      expect(onThemeChange).toHaveBeenCalledWith('dark');
    });

    it('reflects theme changes when controlled prop changes', () => {
      const { rerender } = render(
        <ThemeProvider theme="light">
          <ThemeConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      rerender(
        <ThemeProvider theme="dark">
          <ThemeConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });
  });

  describe('useTheme', () => {
    it('returns default context values when used outside ThemeProvider', () => {
      const Consumer = () => {
        const { theme } = useTheme();
        return <span data-testid="theme">{theme}</span>;
      };
      render(<Consumer />);
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('no-op setTheme outside provider does not throw', () => {
      const Consumer = () => {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme('dark')}>Set dark</button>;
      };
      render(<Consumer />);
      expect(() => userEvent.click(screen.getByRole('button'))).not.toThrow();
    });
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(
        <ThemeProvider>
          <p>Content</p>
        </ThemeProvider>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with dark theme', async () => {
      const { container } = render(
        <ThemeProvider defaultTheme="dark">
          <p>Content</p>
        </ThemeProvider>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
