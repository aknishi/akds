import React from 'react';
import {
  Button,
  TextInput,
  Checkbox,
  Radio,
  RadioGroup,
  Menu,
  MenuItem,
  Option,
  DropdownMenu,
  Dialog,
  Drawer,
  ProgressTracker,
  ProgressTrackerStep,
  ThemeProvider,
  useTheme,
  Switch,
  Tag,
  Divider,
  Avatar,
} from '@aknishi/akds-reactkit';
import type { ButtonAppearance, ButtonEmphasis, ButtonSize, Theme } from '@aknishi/akds-reactkit';
import './App.css';
import AccessibleCarousel from './AccessibleCarousel';

const appearances: ButtonAppearance[] = ['solid', 'transparent', 'bordered'];
const emphases: ButtonEmphasis[] = ['accented', 'neutral', 'success', 'destructive'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

export default function App() {
  const [theme, setTheme] = React.useState<Theme>('light');

  return (
    <ThemeProvider theme={theme} onThemeChange={setTheme}>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme, setTheme } = useTheme();

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
          emphasis="neutral"
          size="sm"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </Button>
      </div>

      <hr className="demo-divider" />

      <AccessibleCarousel />

      {/* Button section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Button</h2>

        {/* By appearance × emphasis */}
        {appearances.map(appearance => (
          <div key={appearance} className="demo-section">
            <p className="demo-label-heading">{appearance}</p>
            {emphases.map(emphasis => (
              <div key={emphasis} className="demo-row">
                <span className="demo-row__label">{emphasis}</span>
                {sizes.map(size => (
                  <Button key={size} appearance={appearance} emphasis={emphasis} size={size}>
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
          <Button appearance="solid" emphasis="accented">Button</Button>
        </div>
        <div className="demo-row">
          <span className="demo-row__label">disabled</span>
          <Button appearance="solid" emphasis="accented" disabled>Button</Button>
          <Button appearance="bordered" emphasis="neutral" disabled>Button</Button>
          <Button appearance="transparent" emphasis="destructive" disabled>Button</Button>
        </div>
        <div className="demo-row">
          <span className="demo-row__label">loading</span>
          <Button appearance="solid" emphasis="accented" loading>Saving</Button>
          <Button appearance="bordered" emphasis="neutral" loading>Loading</Button>
          <Button appearance="solid" emphasis="success" loading>Processing</Button>
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

      <hr className="demo-divider" />

      {/* Checkbox section */}
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

      {/* Radio / RadioGroup section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Radio / RadioGroup</h2>

        <p className="demo-label-heading">Vertical (default)</p>
        <div className="demo-row">
          <RadioGroup name="demo-fruit" legend="Pick a fruit">
            <Radio value="apple" label="Apple" />
            <Radio value="banana" label="Banana" />
            <Radio value="cherry" label="Cherry" />
          </RadioGroup>
        </div>

        <p className="demo-label-heading">Horizontal</p>
        <div className="demo-row">
          <RadioGroup name="demo-size" legend="Size" orientation="horizontal">
            <Radio value="sm" label="Small" />
            <Radio value="md" label="Medium" />
            <Radio value="lg" label="Large" />
          </RadioGroup>
        </div>

        <p className="demo-label-heading">Disabled</p>
        <div className="demo-row">
          <RadioGroup name="demo-disabled" disabled>
            <Radio value="a" label="Option A" />
            <Radio value="b" label="Option B" />
          </RadioGroup>
        </div>
      </section>

      <hr className="demo-divider" />

      {/* Menu section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Menu</h2>
        <MenuDemo />
      </section>

      <hr className="demo-divider" />

      {/* DropdownMenu section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">DropdownMenu</h2>
        <DropdownSingleDemo />
        <DropdownMultiDemo />

        <p className="demo-label-heading">Disabled</p>
        <div className="demo-row">
          <DropdownMenu label="Country" disabled>
            <Option value="au">Australia</Option>
            <Option value="jp">Japan</Option>
          </DropdownMenu>
        </div>
      </section>

      <hr className="demo-divider" />

      {/* Dialog section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Dialog</h2>
        <DialogDemo />
      </section>

      <hr className="demo-divider" />

      {/* Drawer section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Drawer</h2>
        <DrawerDemo />
      </section>

      {/* ProgressTracker section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">ProgressTracker</h2>
        <ProgressTrackerDemo />
      </section>

      <hr className="demo-divider" />

      {/* Switch section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Switch</h2>

        <p className="demo-label-heading">Sizes</p>
        <div className="demo-row">
          <span className="demo-row__label">sm</span>
          <Switch label="Small" size="sm" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">md</span>
          <Switch label="Medium" size="md" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">lg</span>
          <Switch label="Large" size="lg" />
        </div>

        <p className="demo-label-heading">States</p>
        <div className="demo-row">
          <span className="demo-row__label">off</span>
          <Switch label="Dark mode" />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">on</span>
          <Switch label="Dark mode" defaultChecked />
        </div>
        <div className="demo-row">
          <span className="demo-row__label">disabled</span>
          <Switch label="Disabled off" disabled />
          <Switch label="Disabled on" disabled defaultChecked />
        </div>
      </section>

      <hr className="demo-divider" />

      {/* Tag section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Tag</h2>

        <p className="demo-label-heading">Variants</p>
        <div className="demo-row">
          <Tag variant="default">Default</Tag>
          <Tag variant="info">Info</Tag>
          <Tag variant="success">Success</Tag>
          <Tag variant="warning">Warning</Tag>
          <Tag variant="error">Error</Tag>
        </div>

        <p className="demo-label-heading">Sizes</p>
        <div className="demo-row" style={{ alignItems: 'center' }}>
          <span className="demo-row__label">sizes</span>
          <Tag size="sm">Small</Tag>
          <Tag size="md">Medium</Tag>
          <Tag size="lg">Large</Tag>
        </div>

        <p className="demo-label-heading">Dismissible</p>
        <div className="demo-row">
          <span className="demo-row__label">removable</span>
          <TagDismissDemo />
        </div>
      </section>

      <hr className="demo-divider" />

      {/* Avatar section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Avatar</h2>

        <p className="demo-label-heading">Image</p>
        <div className="demo-row">
          <Avatar src="https://i.pravatar.cc/150?img=3" alt="Jane Smith" />
          <Avatar src="https://i.pravatar.cc/150?img=12" alt="Carlos Rivera" />
        </div>

        <p className="demo-label-heading">Initials</p>
        <div className="demo-row">
          <Avatar name="Adrian Kawanishi" />
          <Avatar name="Jane Smith" />
          <Avatar name="Carlos Rivera" />
          <Avatar name="Mary Jane Watson" />
          <Avatar name="Priya Patel" />
        </div>

        <p className="demo-label-heading">Icon fallback</p>
        <div className="demo-row">
          <Avatar />
        </div>

        <p className="demo-label-heading">Sizes</p>
        <div className="demo-row" style={{ alignItems: 'center' }}>
          <Avatar name="Adrian Kawanishi" size="sm" />
          <Avatar name="Adrian Kawanishi" size="md" />
          <Avatar name="Adrian Kawanishi" size="lg" />
          <Avatar name="Adrian Kawanishi" size="xl" />
        </div>

        <p className="demo-label-heading">Color override</p>
        <div className="demo-row">
          <Avatar name="X" color="blue" />
          <Avatar name="X" color="green" />
          <Avatar name="X" color="purple" />
          <Avatar name="X" color="orange" />
          <Avatar name="X" color="red" />
        </div>
      </section>

      <hr className="demo-divider" />

      {/* Divider section */}
      <section className="demo-section">
        <h2 className="demo-section__heading">Divider</h2>

        <p className="demo-label-heading">Variants</p>
        <Divider variant="solid" />
        <Divider variant="dashed" />
        <Divider variant="dotted" />

        <p className="demo-label-heading">Labeled</p>
        <Divider label="or" />
        <Divider label="Section" variant="dashed" />

        <p className="demo-label-heading">Vertical</p>
        <div className="demo-row" style={{ alignItems: 'center', height: '32px' }}>
          <span>Left</span>
          <Divider orientation="vertical" />
          <span>Right</span>
          <Divider orientation="vertical" variant="dashed" />
          <span>End</span>
        </div>
      </section>
    </div>
  );
}

function DialogDemo() {
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
            emphasis="neutral"
            onClick={() => { setSize(s); setOpen(true); }}
          >
            Open {s}
          </Button>
        ))}
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} title="Dialog title" size={size}>
        <p>This is the dialog body. Press Escape or click outside to close.</p>
        <div style={{ marginTop: 16 }}>
          <Button appearance="solid" emphasis="accented" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </>
  );
}

function MenuDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <p className="demo-label-heading">Controlled</p>
      <div className="demo-row">
        <Button appearance="bordered" emphasis="neutral" size="sm" onClick={() => setOpen(true)}>
          Open Menu
        </Button>
        <Menu open={open} onOpenChange={setOpen}>
          <MenuItem trailingElement={<span>⌘X</span>} onClick={() => setOpen(false)}>Cut</MenuItem>
          <MenuItem trailingElement={<span>⌘C</span>} onClick={() => setOpen(false)}>Copy</MenuItem>
          <MenuItem trailingElement={<span>⌘V</span>} onClick={() => setOpen(false)}>Paste</MenuItem>
          <MenuItem disabled>Delete</MenuItem>
        </Menu>
      </div>
    </>
  );
}

function DropdownSingleDemo() {
  const [fruit, setFruit] = React.useState<string | undefined>(undefined);
  return (
    <>
      <p className="demo-label-heading">Single select</p>
      <div className="demo-row">
        <DropdownMenu label="Fruit" selected={fruit} onChange={v => setFruit(v as string)}>
          <Option value="apple">Apple</Option>
          <Option value="banana">Banana</Option>
          <Option value="cherry">Cherry</Option>
          <Option value="durian" disabled>Durian</Option>
        </DropdownMenu>
      </div>
    </>
  );
}

function DropdownMultiDemo() {
  const [toppings, setToppings] = React.useState<string[]>([]);
  return (
    <>
      <p className="demo-label-heading">Multi select</p>
      <div className="demo-row">
        <DropdownMenu label="Toppings" multiple selected={toppings} onChange={v => setToppings(v as string[])}>
          <Option value="cheese">Cheese</Option>
          <Option value="tomato">Tomato</Option>
          <Option value="basil">Basil</Option>
          <Option value="anchovies">Anchovies</Option>
        </DropdownMenu>
      </div>
    </>
  );
}

function DrawerDemo() {
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
            emphasis="neutral"
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

function TagDismissDemo() {
  const [tags, setTags] = React.useState(['React', 'TypeScript', 'Design system']);
  return (
    <>
      {tags.map(tag => (
        <Tag
          key={tag}
          onDismiss={() => setTags(prev => prev.filter(t => t !== tag))}
          dismissLabel={`Remove ${tag}`}
        >
          {tag}
        </Tag>
      ))}
    </>
  );
}

function ProgressTrackerDemo() {
  const [step, setStep] = React.useState(2);
  return (
    <>
      <p className="demo-label-heading">Interactive</p>
      <div className="demo-row">
        <Button
          appearance="bordered"
          emphasis="neutral"
          size="sm"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step <= 1}
        >
          Back
        </Button>
        <Button
          appearance="solid"
          emphasis="accented"
          size="sm"
          onClick={() => setStep(s => Math.min(3, s + 1))}
          disabled={step >= 3}
        >
          Next
        </Button>
      </div>
      <ProgressTracker currentStep={step}>
        <ProgressTrackerStep
          status={step > 1 ? 'complete' : 'inactive'}
          label="Select workspace"
        />
        <ProgressTrackerStep
          status={step > 2 ? 'complete' : 'inactive'}
          label="Select teams"
        />
        <ProgressTrackerStep label="Map users" />
      </ProgressTracker>

      <p className="demo-label-heading">Statuses</p>
      <ProgressTracker currentStep={-1}>
        <ProgressTrackerStep status="complete" label="Complete" />
        <ProgressTrackerStep status="inactive" label="Inactive" />
        <ProgressTrackerStep status="error" label="Error" />
        <ProgressTrackerStep status="warning" label="Warning" />
      </ProgressTracker>

    </>
  );
}
