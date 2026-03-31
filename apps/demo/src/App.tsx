import React from 'react';
import { Button } from '@akds/reactkit';
import type { ButtonAppearance, ButtonSentiment, ButtonSize } from '@akds/reactkit';

const appearances: ButtonAppearance[] = ['solid', 'transparent', 'bordered'];
const sentiments: ButtonSentiment[] = ['accented', 'neutral', 'success', 'destructive'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

const sectionStyle: React.CSSProperties = {
  marginBottom: '48px',
};

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--akds-font-family-sans)',
  fontSize: 'var(--akds-font-size-xs)',
  fontWeight: 'var(--akds-font-weight-semibold)' as React.CSSProperties['fontWeight'],
  letterSpacing: 'var(--akds-font-letter-spacing-wider)',
  textTransform: 'uppercase',
  color: 'var(--akds-color-text-secondary-default)',
  marginBottom: '16px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--akds-font-family-sans)',
  fontSize: 'var(--akds-font-size-xs)',
  color: 'var(--akds-color-text-secondary-default)',
  width: '96px',
  flexShrink: 0,
};

const dividerStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--akds-color-border-default-default)',
  margin: '40px 0',
};

export default function App() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--akds-color-surface-default)',
        color: 'var(--akds-color-text-primary-default)',
        fontFamily: 'var(--akds-font-family-sans)',
        padding: '48px',
        boxSizing: 'border-box',
        transition: 'background 200ms ease, color 200ms ease',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--akds-font-size-3xl)', fontWeight: 'var(--akds-font-weight-bold)' as React.CSSProperties['fontWeight'], margin: 0 }}>
            akds
          </h1>
          <p style={{ fontSize: 'var(--akds-font-size-md)', color: 'var(--akds-color-text-secondary-default)', margin: '4px 0 0' }}>
            Component Showcase
          </p>
        </div>
        <Button
          appearance="bordered"
          sentiment="neutral"
          size="sm"
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </Button>
      </div>

      <hr style={dividerStyle} />

      {/* Button section */}
      <section style={sectionStyle}>
        <h2 style={{ fontSize: 'var(--akds-font-size-xl)', fontWeight: 'var(--akds-font-weight-semibold)' as React.CSSProperties['fontWeight'], marginBottom: '24px' }}>
          Button
        </h2>

        {/* By appearance × sentiment */}
        {appearances.map(appearance => (
          <div key={appearance} style={sectionStyle}>
            <p style={headingStyle}>{appearance}</p>
            {sentiments.map(sentiment => (
              <div key={sentiment} style={rowStyle}>
                <span style={labelStyle}>{sentiment}</span>
                {sizes.map(size => (
                  <Button key={size} appearance={appearance} sentiment={sentiment} size={size}>
                    Button
                  </Button>
                ))}
              </div>
            ))}
          </div>
        ))}

        <hr style={dividerStyle} />

        {/* States */}
        <p style={headingStyle}>States</p>
        <div style={rowStyle}>
          <span style={labelStyle}>default</span>
          <Button appearance="solid" sentiment="accented">Button</Button>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>disabled</span>
          <Button appearance="solid" sentiment="accented" disabled>Button</Button>
          <Button appearance="bordered" sentiment="neutral" disabled>Button</Button>
          <Button appearance="transparent" sentiment="destructive" disabled>Button</Button>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>loading</span>
          <Button appearance="solid" sentiment="accented" loading>Saving</Button>
          <Button appearance="bordered" sentiment="neutral" loading>Loading</Button>
          <Button appearance="solid" sentiment="success" loading>Processing</Button>
        </div>
      </section>
    </div>
  );
}
