import { componentRegistry } from './components/registry';
import { navConfig, isNavParentItem } from './navConfig';

export interface SearchItem {
  id: string;
  label: string;
  description?: string;
  path: string;
  group: 'Component' | 'Page';
  keywords: string[];
}

/**
 * Extra search terms per component slug, so a visitor searching for a term
 * from a different design system (or a plain-language description) still
 * lands on the matching AKDS component — e.g. "modal" finds Dialog.
 */
const COMPONENT_KEYWORDS: Record<string, string[]> = {
  dialog: ['modal', 'popup', 'lightbox'],
  toast: ['snackbar', 'notification'],
  button: ['cta', 'action', 'submit'],
  'ai-button': ['ai action', 'generate button'],
  'icon-button': ['icon action'],
  'like-button': ['favorite', 'heart', 'upvote'],
  'toggle-button': ['toggle'],
  'toggle-group': ['segmented control', 'button group'],
  checkbox: ['check box'],
  combobox: ['autocomplete', 'typeahead', 'searchable select'],
  'dropdown-menu': ['select', 'picker', 'dropdown'],
  radio: ['radio button', 'radio group'],
  switch: ['toggle switch'],
  'text-area': ['textarea', 'multiline input'],
  'text-input': ['input', 'text field', 'form field'],
  card: ['panel', 'tile'],
  divider: ['separator', 'hr', 'rule'],
  flexbox: ['layout', 'flex', 'stack'],
  accordion: ['collapse', 'expander', 'disclosure'],
  menu: ['context menu', 'action menu'],
  'progress-tracker': ['stepper', 'steps', 'wizard'],
  tabs: ['tab bar', 'tabbed navigation'],
  alert: ['banner', 'callout', 'message box'],
  spinner: ['loading', 'loader'],
  avatar: ['profile picture', 'user icon', 'headshot'],
  carousel: ['slider', 'slideshow', 'gallery'],
  table: ['data table', 'grid'],
  tag: ['chip', 'pill', 'badge', 'label'],
  text: ['typography', 'heading', 'paragraph'],
  'theme-provider': ['theming', 'dark mode', 'light mode'],
  drawer: ['side panel', 'sidenav', 'off-canvas'],
  tooltip: ['hint', 'popover', 'hover text'],
};

function flattenNavConfig(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const group of navConfig) {
    for (const item of group.items) {
      if (isNavParentItem(item)) {
        for (const child of item.children) {
          items.push({
            id: `page-${child.to}`,
            label: child.label,
            path: child.to,
            group: 'Page',
            keywords: [group.label, item.label],
          });
        }
      } else {
        items.push({
          id: `page-${item.to}`,
          label: item.label,
          path: item.to,
          group: 'Page',
          keywords: [group.label],
        });
      }
    }
  }
  return items;
}

function buildComponentItems(): SearchItem[] {
  return componentRegistry.map((entry) => ({
    id: `component-${entry.slug}`,
    label: entry.name,
    description: entry.summary,
    path: `/components/${entry.slug}`,
    group: 'Component' as const,
    keywords: [entry.slug, entry.category, ...(COMPONENT_KEYWORDS[entry.slug] ?? [])],
  }));
}

export const searchIndex: SearchItem[] = [
  { id: 'page-home', label: 'Home', path: '/', group: 'Page', keywords: ['landing', 'overview', 'home page'] },
  {
    id: 'page-components',
    label: 'Components',
    description: 'Browse all components',
    path: '/components',
    group: 'Page',
    keywords: ['all components', 'browse', 'component index'],
  },
  ...buildComponentItems(),
  ...flattenNavConfig(),
];

function matchScore(item: SearchItem, query: string): number {
  const label = item.label.toLowerCase();
  if (label === query) return 100;
  if (label.startsWith(query)) return 80;
  if (item.keywords.some((keyword) => keyword.toLowerCase() === query)) return 70;
  if (label.includes(query)) return 60;
  if (item.keywords.some((keyword) => keyword.toLowerCase().startsWith(query))) return 50;
  if (item.keywords.some((keyword) => keyword.toLowerCase().includes(query))) return 40;
  if (item.description?.toLowerCase().includes(query)) return 20;
  return -1;
}

export function searchSite(query: string, limit = 8): SearchItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];
  return searchIndex
    .map((item) => ({ item, score: matchScore(item, trimmed) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}
