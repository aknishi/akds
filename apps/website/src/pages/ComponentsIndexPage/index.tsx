import { motion } from 'framer-motion';
import { Flexbox, Text } from '@aknishi/akds-reactkit';
import { ComponentCard } from '../../components/docs/ComponentCard';
import { componentRegistry } from '../../content/components/registry';
import { CATEGORY_ORDER } from '../../content/components/types';
import { staggerContainer, staggerItem } from '../../lib/motion';
import './ComponentsIndexPage.css';

export function ComponentsIndexPage() {
  const categorized = CATEGORY_ORDER.map((category) => ({
    category,
    items: componentRegistry.filter((entry) => entry.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <Flexbox direction="column" gap="xl" className="components-index-page">
      <Flexbox direction="column" gap="sm">
        <Text as="h1" styleAs="h1">
          Components
        </Text>
        <Text styleAs="body" className="components-index-page__lede">
          {componentRegistry.length} components across {categorized.length} categories, every one built on the same
          token system and accessibility baseline.
        </Text>
      </Flexbox>

      {categorized.map(({ category, items }) => (
        <Flexbox direction="column" as="section" gap={1} key={category}>
          <Text as="h2" styleAs="h4" className="components-index-page__category-title">
            {category}
          </Text>
          <motion.div
            className="components-index-page__grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {items.map((entry) => (
              <motion.div key={entry.slug} className="components-index-page__grid-item" variants={staggerItem}>
                <ComponentCard
                  slug={entry.slug}
                  name={entry.name}
                  description={entry.summary}
                  preview={<Text styleAs="label">{entry.name}</Text>}
                />
              </motion.div>
            ))}
          </motion.div>
        </Flexbox>
      ))}
    </Flexbox>
  );
}
