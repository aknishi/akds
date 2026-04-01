import React from 'react';
import { Button, TextInput } from '@akds/reactkit';
import type { ButtonAppearance, ButtonSentiment, ButtonSize } from '@akds/reactkit';
import './App.css';

const appearances: ButtonAppearance[] = ['solid', 'transparent', 'bordered'];
const sentiments: ButtonSentiment[] = ['accented', 'neutral', 'success', 'destructive'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

export default function App() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="demo-page">
      {/* Header */}
      <div className="demo-header">
        <div>
          <h1 className="demo-header__title">akds</h1>
          <p className="demo-header__subtitle">Component Showcase</p>
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

      <hr className="demo-divider" />

      {/* Button section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Button</h2>

        {/* By appearance × sentiment */}
        {appearances.map(appearance => (
          <div key={appearance} className="demo-section">
            <p className="demo-label-heading">{appearance}</p>
            {sentiments.map(sentiment => (
              <div key={sentiment} className="demo-row">
                <span className="demo-row__label">{sentiment}</span>
                {sizes.map(size => (
                  <Button key={size} appearance={appearance} sentiment={sentiment} size={size}>
                    Button
                  </Button>
                ))}
              </div>
            ))}
          </div>
        ))}

        <hr className="demo-divider" />

        {/* States */}
        <p className="demo-label-heading">States</p>
        <div className="demo-row">
          <span className="demo-row__label">default</span>
          <Button appearance="solid" sentiment="accented">Button</Button>
        </div>
        <div className="demo-row">
          <span className="demo-row__label">disabled</span>
          <Button appearance="solid" sentiment="accented" disabled>Button</Button>
          <Button appearance="bordered" sentiment="neutral" disabled>Button</Button>
          <Button appearance="transparent" sentiment="destructive" disabled>Button</Button>
        </div>
        <div className="demo-row">
          <span className="demo-row__label">loading</span>
          <Button appearance="solid" sentiment="accented" loading>Saving</Button>
          <Button appearance="bordered" sentiment="neutral" loading>Loading</Button>
          <Button appearance="solid" sentiment="success" loading>Processing</Button>
        </div>
      </section>

      <hr className="demo-divider" />

      {/* TextInput section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">TextInput</h2>

        <p className="demo-label-heading">States</p>
        <div className="demo-row">
          <span className="demo-row__label">default</span>
          <TextInput label="Email address" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">with adornment</span>
          <TextInput label="Amount" startAdornment={<span>$</span>} />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">with helper text</span>
          <TextInput label="Username" helperText="Must be at least 3 characters" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">disabled</span>
          <TextInput label="Read only" disabled />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">pre-filled value</span>
          <TextInput
            label="Full name"
            value="Adrian Kawanishi"
            onChange={() => {}}
          />
        </div>
      </section>
    </div>
  );
}
