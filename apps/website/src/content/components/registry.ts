import type { ComponentEntry } from './types';

// Actions
import { button } from './button';
import { iconButton } from './icon-button';
import { likeButton } from './like-button';

// Inputs
import { checkbox } from './checkbox';
import { combobox } from './combobox';
import { dropdownMenu } from './dropdown-menu';
import { radio } from './radio';
import { switchEntry } from './switch';
import { textInput } from './text-input';

// Layout
import { card } from './card';
import { divider } from './divider';
import { flexbox } from './flexbox';

// Navigation & Disclosure
import { accordion } from './accordion';
import { menu } from './menu';
import { progressTracker } from './progress-tracker';
import { tabs } from './tabs';

// Feedback & Overlay
import { dialog } from './dialog';
import { drawer } from './drawer';
import { spinner } from './spinner';
import { tooltip } from './tooltip';

// Data Display & Content
import { avatar } from './avatar';
import { carousel } from './carousel';
import { tag } from './tag';
import { text } from './text';

// System
import { themeProvider } from './theme-provider';

// Primitives
import { particleBurst } from './particle-burst';
import { rippleBase } from './ripple-base';

export const componentRegistry: ComponentEntry[] = [
  button,
  iconButton,
  likeButton,
  checkbox,
  combobox,
  dropdownMenu,
  radio,
  switchEntry,
  textInput,
  card,
  divider,
  flexbox,
  accordion,
  menu,
  progressTracker,
  tabs,
  dialog,
  drawer,
  spinner,
  tooltip,
  avatar,
  carousel,
  tag,
  text,
  themeProvider,
  particleBurst,
  rippleBase,
];

export function getComponentBySlug(slug: string): ComponentEntry | undefined {
  return componentRegistry.find((entry) => entry.slug === slug);
}
