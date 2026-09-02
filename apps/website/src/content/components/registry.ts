import type { ComponentEntry } from './types';

// Actions
import { aiButton } from './ai-button';
import { button } from './button';
import { iconButton } from './icon-button';
import { likeButton } from './like-button';
import { toggleButton } from './toggle-button';

// Inputs
import { checkbox } from './checkbox';
import { combobox } from './combobox';
import { dropdownMenu } from './dropdown-menu';
import { radio } from './radio';
import { switchEntry } from './switch';
import { textInput } from './text-input';
import { toggleGroup } from './toggle-group';

// Layout
import { card } from './card';
import { divider } from './divider';
import { flexbox } from './flexbox';

// Navigation & Disclosure
import { accordion } from './accordion';
import { menu } from './menu';
import { progressTracker } from './progress-tracker';
import { tabs } from './tabs';

// Feedback
import { spinner } from './spinner';
import { toast } from './toast';

// Overlay
import { dialog } from './dialog';
import { drawer } from './drawer';
import { tooltip } from './tooltip';

// Data Display & Content
import { avatar } from './avatar';
import { carousel } from './carousel';
import { tag } from './tag';
import { text } from './text';

// System
import { themeProvider } from './theme-provider';

export const componentRegistry: ComponentEntry[] = [
  aiButton,
  button,
  iconButton,
  likeButton,
  toggleButton,
  checkbox,
  combobox,
  dropdownMenu,
  radio,
  switchEntry,
  textInput,
  toggleGroup,
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
  toast,
  tooltip,
  avatar,
  carousel,
  tag,
  text,
  themeProvider,
];

export function getComponentBySlug(slug: string): ComponentEntry | undefined {
  return componentRegistry.find((entry) => entry.slug === slug);
}
