import { Avatar } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const avatar: ComponentEntry = {
  slug: 'avatar',
  name: 'Avatar',
  category: 'Data Display & Content',
  summary: 'A user avatar rendered from an image, derived initials, or an icon fallback.',
  sourcePath: 'packages/reactkit/src/components/Avatar',
  examples: [
    {
      title: 'Initials & sizes',
      render: () => (
        <>
          <Avatar name="Ada Lovelace" size="sm" />
          <Avatar name="Grace Hopper" size="md" />
          <Avatar name="Alan Turing" size="lg" />
          <Avatar name="Katherine Johnson" size="xl" />
        </>
      ),
      code: `<Avatar name="Ada Lovelace" size="sm" />
<Avatar name="Grace Hopper" size="md" />
<Avatar name="Alan Turing" size="lg" />
<Avatar name="Katherine Johnson" size="xl" />`,
    },
    {
      title: 'Fallback icon',
      render: () => <Avatar size="lg" />,
      code: `<Avatar size="lg" />`,
    },
  ],
  accessibilityNotes: [
    'When src is provided, always pass alt describing the person — Avatar forwards it to the underlying <img>.',
    'Initials and icon fallback variants render as decorative by default since the surrounding context (e.g. a name label) usually provides the accessible identification.',
  ],
  props: [
    { name: 'src', type: 'string', description: 'Image URL. Takes priority over name and icon.' },
    { name: 'alt', type: 'string', description: 'Alt text for the image. Should be provided when src is set.' },
    { name: 'name', type: 'string', description: 'Name used to derive initials and a deterministic color.' },
    { name: 'icon', type: 'React.ReactNode', description: 'Icon rendered when neither src nor name is provided. Falls back to PersonIcon.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the avatar.' },
    { name: 'color', type: "'blue' | 'green' | 'purple' | 'orange' | 'red'", description: 'Overrides the auto-derived color for the initials variant.' },
  ],
  doDont: [
    { do: 'Let color auto-derive from name for consistent per-person coloring.', dont: "Don't rely on Avatar color alone to convey status — pair with a Tag or label." },
  ],
  related: ['tag'],
};
