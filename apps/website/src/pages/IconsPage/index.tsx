import React from 'react';
import * as Icons from '@aknishi/akds-icons';
import type { IconColor, IconSize } from '@aknishi/akds-icons';
import { Divider, Flexbox, Text, TextInput } from '@aknishi/akds-reactkit';
import { CodeBlock } from '../../components/docs/CodeBlock';
import './IconsPage.css';

type IconComponent = React.ComponentType<{ size?: IconSize; color?: IconColor }>;

const SIZES: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const COLORS: IconColor[] = ['default', 'info', 'success', 'warning', 'error'];

const ICON_ENTRIES = Object.entries(Icons)
  .filter((entry): entry is [string, IconComponent] => entry[0].endsWith('Icon') && typeof entry[1] === 'object')
  .sort(([a], [b]) => a.localeCompare(b));

export function IconsPage() {
  const [query, setQuery] = React.useState('');
  const filtered = ICON_ENTRIES.filter(([name]) => name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Flexbox direction="column" gap="xl" className="icons-page">
      <Flexbox direction="column" gap="sm">
        <Text as="h1" styleAs="h1">
          Icons
        </Text>
        <Text styleAs="body" className="icons-page__lede">
          {ICON_ENTRIES.length} SVG icons from <code>@aknishi/akds-icons</code>, generated from Material Symbols
          (Rounded). Every icon accepts the same <code>size</code> and <code>color</code> props.
        </Text>
      </Flexbox>

      <Flexbox as="section" direction="column" gap={1}>
        <Text as="h2" styleAs="h3">
          Usage
        </Text>
        <Flexbox direction="column" gap="sm">
          <CodeBlock
            language="tsx"
            code={"import { HomeIcon } from '@aknishi/akds-icons';\n\n<HomeIcon size=\"md\" color=\"default\" />"}
          />
        </Flexbox>
      </Flexbox>

      <Divider />

      <Flexbox as="section" direction="column" gap={1}>
        <Text as="h2" styleAs="h3">
          Sizes
        </Text>
        <Text styleAs="body" className="icons-page__section-lede">
          Five token-based sizes, from <code>xs</code> (12px) to <code>xl</code> (32px).
        </Text>
        <Flexbox align="center" gap="lg">
          {SIZES.map((size) => (
            <Flexbox key={size} direction="column" align="center" gap="xs">
              <Icons.HomeIcon size={size} />
              <Text styleAs="caption" className="icons-page__swatch-label">
                {size}
              </Text>
            </Flexbox>
          ))}
        </Flexbox>
      </Flexbox>

      <Divider />

      <Flexbox as="section" direction="column" gap={1}>
        <Text as="h2" styleAs="h3">
          Colors
        </Text>
        <Text styleAs="body" className="icons-page__section-lede">
          Semantic color tokens keep icons theme-aware without hardcoded hex values.
        </Text>
        <Flexbox align="center" gap="lg">
          {COLORS.map((color) => (
            <Flexbox key={color} direction="column" align="center" gap="xs">
              <Icons.InfoFilledIcon size="lg" color={color} />
              <Text styleAs="caption" className="icons-page__swatch-label">
                {color}
              </Text>
            </Flexbox>
          ))}
        </Flexbox>
      </Flexbox>

      <Divider />

      <Flexbox as="section" direction="column" gap={1}>
        <Text as="h2" styleAs="h3">
          Custom colors
        </Text>
        <Text styleAs="body" className="icons-page__section-lede">
          Beyond the semantic keywords, <code>color</code> also accepts any CSS color value — a hex code,{' '}
          <code>rgb()</code>, or a CSS variable.
        </Text>
        <Flexbox align="center" gap="lg">
          <Flexbox direction="column" align="center" gap="xs">
            <Icons.InfoFilledIcon size="lg" color="#ec4899" />
            <Text styleAs="caption" className="icons-page__swatch-label">
              #ec4899
            </Text>
          </Flexbox>
          <Flexbox direction="column" align="center" gap="xs">
            <Icons.InfoFilledIcon size="lg" color="rgb(37, 99, 235)" />
            <Text styleAs="caption" className="icons-page__swatch-label">
              rgb(37, 99, 235)
            </Text>
          </Flexbox>
          <Flexbox direction="column" align="center" gap="xs">
            <Icons.InfoFilledIcon size="lg" color="var(--akds-color-icon-warning-default)" />
            <Text styleAs="caption" className="icons-page__swatch-label">
              var(--akds-color-icon-warning-default)
            </Text>
          </Flexbox>
        </Flexbox>
        <Flexbox direction="column" gap="sm">
          <CodeBlock language="tsx" code={'<InfoFilledIcon color="#ec4899" />'} />
        </Flexbox>
      </Flexbox>

      <Divider />

      <Flexbox as="section" direction="column" gap={1}>
        <Text as="h2" styleAs="h3">
          All icons
        </Text>
        <Text styleAs="body" className="icons-page__section-lede">
          Search by name to find the icon you need.
        </Text>
        <TextInput
          startAdornment={<Icons.SearchIcon />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          label="Search icons"
          helperText={`${filtered.length} of ${ICON_ENTRIES.length} icons`}
          wrapperClassName="icons-page__search"
        />
        {filtered.length === 0 ? (
          <Text styleAs="body" className="icons-page__empty">
            No icons match "{query}"
          </Text>
        ) : (
          <div className="icons-page__grid">
            {filtered.map(([name, Icon]) => (
              <div key={name} className="icons-page__cell">
                <Icon size="lg" />
                <Text styleAs="caption" className="icons-page__cell-label">
                  {name.replace(/Icon$/, '')}
                </Text>
              </div>
            ))}
          </div>
        )}
      </Flexbox>
    </Flexbox>
  );
}
