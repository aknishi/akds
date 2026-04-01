import React from 'react';
import { Button } from '../src/components/Button/Button';
import { Spinner } from '../src/components/Spinner/Spinner';
import { TextInput } from '../src/components/TextInput/TextInput';
import type { ButtonAppearance, ButtonSentiment, ButtonSize } from '../src/components/Button/Button.types';
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
          <h1 className="demo-header__title">reactkit</h1>
          <p className="demo-header__subtitle">dev playground</p>
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

      {/* Spinner */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Spinner</h2>
        <div className="demo-row">
          <span className="demo-row__label">sm</span>
          <Spinner size="sm" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">md</span>
          <Spinner size="md" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">lg</span>
          <Spinner size="lg" />
        </div>
      </section>

      <hr className="demo-divider" />

      {/* Button */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Button</h2>

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

        <p className="demo-label-heading">States</p>
        <div className="demo-row">
          <span className="demo-row__label">default</span>
          <Button>Button</Button>
        </div>
        <div className="demo-row">
          <span className="demo-row__label">disabled</span>
          <Button disabled>Button</Button>
          <Button appearance="bordered" sentiment="neutral" disabled>Button</Button>
          <Button appearance="transparent" sentiment="destructive" disabled>Button</Button>
        </div>
        <div className="demo-row">
          <span className="demo-row__label">focusable</span>
          <Button disabled focusableWhenDisabled>Button</Button>
        </div>
        <div className="demo-row">
          <span className="demo-row__label">loading</span>
          <Button loading>Saving</Button>
          <Button appearance="bordered" sentiment="neutral" loading>Loading</Button>
          <Button appearance="solid" sentiment="success" loading>Processing</Button>
        </div>
      </section>

      <hr className="demo-divider" />

      {/* TextInput */}
      <section className="demo-section">
        <h2 className="demo-section__heading">TextInput</h2>

        <p className="demo-label-heading">States</p>
        <div className="demo-row">
          <span className="demo-row__label">default</span>
          <TextInput label="Label" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">with value</span>
          <TextInput label="Label" defaultValue="Hello world" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">helper text</span>
          <TextInput label="Email" helperText="We'll never share your email." />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">start adornment</span>
          <TextInput label="Amount" startAdornment={"$"} />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">disabled</span>
          <TextInput label="Label" disabled defaultValue="Can't touch this" />
        </div>
      </section>
    </div>
  );
}
