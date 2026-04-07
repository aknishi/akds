import React from 'react';
import { Button, Spinner, TextInput, Checkbox, Radio, RadioGroup, Menu, MenuItem, Option, DropdownMenu, Dialog, Drawer } from '@akds/reactkit';
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
          <h1 className="demo-header__title">reactkit</h1>
          <p className="demo-header__subtitle">playground</p>
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
          <TextInput label="Amount" type="number" startAdornment={"$"} />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">disabled</span>
          <TextInput label="Label" disabled defaultValue="Can't touch this" />
        </div>
      </section>

      <hr className="demo-divider" />

      {/* Checkbox */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Checkbox</h2>

        <p className="demo-label-heading">Sizes</p>
        <div className="demo-row">
          <span className="demo-row__label">sm</span>
          <Checkbox size="sm" label="Small" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">md</span>
          <Checkbox size="md" label="Medium" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">lg</span>
          <Checkbox size="lg" label="Large" />
        </div>

        <p className="demo-label-heading">States</p>
        <div className="demo-row">
          <span className="demo-row__label">unchecked</span>
          <Checkbox label="Unchecked" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">checked</span>
          <Checkbox defaultChecked label="Checked" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">indeterminate</span>
          <Checkbox indeterminate label="Indeterminate" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">disabled</span>
          <Checkbox disabled label="Disabled" />
          <Checkbox disabled defaultChecked label="Disabled checked" />
        </div>
      </section>

      <hr className="demo-divider" />

      {/* Radio / RadioGroup */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Radio / RadioGroup</h2>

        <p className="demo-label-heading">Vertical (default)</p>
        <div className="demo-row">
          <RadioGroup name="pg-fruit" legend="Pick a fruit">
            <Radio value="apple" label="Apple" />
            <Radio value="banana" label="Banana" />
            <Radio value="cherry" label="Cherry" />
          </RadioGroup>
        </div>

        <p className="demo-label-heading">Horizontal</p>
        <div className="demo-row">
          <RadioGroup name="pg-size" legend="Size" orientation="horizontal">
            <Radio value="sm" label="Small" />
            <Radio value="md" label="Medium" />
            <Radio value="lg" label="Large" />
          </RadioGroup>
        </div>

        <p className="demo-label-heading">Disabled</p>
        <div className="demo-row">
          <RadioGroup name="pg-disabled" disabled>
            <Radio value="a" label="Option A" />
            <Radio value="b" label="Option B" />
          </RadioGroup>
        </div>
      </section>

      <hr className="demo-divider" />

      {/* Menu */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Menu</h2>

        <p className="demo-label-heading">Controlled</p>
        <PlaygroundMenuDemo />
      </section>

      <hr className="demo-divider" />

      {/* DropdownMenu */}
      <section className="demo-section">
        <h2 className="demo-section__heading">DropdownMenu</h2>

        <p className="demo-label-heading">Single select</p>
        <PlaygroundDropdownSingleDemo />

        <p className="demo-label-heading">Multi select</p>
        <PlaygroundDropdownMultiDemo />

        <p className="demo-label-heading">Disabled</p>
        <div className="demo-row">
          <DropdownMenu label="Country" disabled>
            <Option value="au">Australia</Option>
            <Option value="jp">Japan</Option>
          </DropdownMenu>
        </div>
      </section>

      <hr className="demo-divider" />

      {/* Dialog */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Dialog</h2>
        <PlaygroundDialogDemo />
      </section>

      <hr className="demo-divider" />

      {/* Drawer */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Drawer</h2>
        <PlaygroundDrawerDemo />
      </section>
    </div>
  );
}

function PlaygroundMenuDemo() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <div className="demo-row">
      <Button size="sm" onClick={() => setMenuOpen(true)}>Open Menu</Button>
      <Menu open={menuOpen} onOpenChange={setMenuOpen}>
        <MenuItem trailingElement={<span>⌘X</span>} onClick={() => setMenuOpen(false)}>Cut</MenuItem>
        <MenuItem trailingElement={<span>⌘C</span>} onClick={() => setMenuOpen(false)}>Copy</MenuItem>
        <MenuItem trailingElement={<span>⌘V</span>} onClick={() => setMenuOpen(false)}>Paste</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>
    </div>
  );
}

function PlaygroundDropdownSingleDemo() {
  const [fruit, setFruit] = React.useState<string | undefined>(undefined);
  return (
    <div className="demo-row">
      <DropdownMenu label="Fruit" selected={fruit} onChange={v => setFruit(v as string)}>
        <Option value="apple">Apple</Option>
        <Option value="banana">Banana</Option>
        <Option value="cherry">Cherry</Option>
        <Option value="durian" disabled>Durian</Option>
      </DropdownMenu>
    </div>
  );
}

function PlaygroundDropdownMultiDemo() {
  const [toppings, setToppings] = React.useState<string[]>([]);
  return (
    <div className="demo-row">
      <DropdownMenu label="Toppings" multiple selected={toppings} onChange={v => setToppings(v as string[])}>
        <Option value="cheese">Cheese</Option>
        <Option value="tomato">Tomato</Option>
        <Option value="basil">Basil</Option>
      </DropdownMenu>
    </div>
  );
}

function PlaygroundDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  return (
    <>
      <p className="demo-label-heading">Sizes</p>
      <div className="demo-row">
        {(['sm', 'md', 'lg'] as const).map(s => (
          <Button
            key={s}
            appearance="bordered"
            sentiment="neutral"
            onClick={() => { setSize(s); setOpen(true); }}
          >
            Open {s}
          </Button>
        ))}
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} title="Dialog title" size={size}>
        <p>This is the dialog body. Press Escape or click outside to close.</p>
        <div style={{ marginTop: 16 }}>
          <Button appearance="solid" sentiment="accented" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </>
  );
}

function PlaygroundDrawerDemo() {
  const [side, setSide] = React.useState<'left' | 'right' | 'top' | 'bottom'>('right');
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <p className="demo-label-heading">Sides</p>
      <div className="demo-row">
        {(['left', 'right', 'top', 'bottom'] as const).map(s => (
          <Button
            key={s}
            appearance="bordered"
            sentiment="neutral"
            onClick={() => { setSide(s); setOpen(true); }}
          >
            {s}
          </Button>
        ))}
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} side={side} title="Drawer">
        <p>Slide-in from {side}. Press Escape or click outside to close.</p>
      </Drawer>
    </>
  );
}
