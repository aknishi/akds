import type React from 'react';
import { NavLink } from 'react-router';
import { motion } from 'framer-motion';
import { Card, CardContent, Text } from '@aknishi/akds-reactkit';
import './ComponentCard.css';

export interface ComponentCardProps {
  slug: string;
  name: string;
  description?: string;
  preview: React.ReactNode;
  /** Reduces the preview area's padding — for a preview whose content (e.g. Progress tracker's steps) needs the extra width more than the card's usual breathing room. */
  compactPreview?: boolean;
}

// Renders the preview as a visual only — inert removes it from the tab order and
// accessibility tree and blocks pointer/keyboard interaction, so a live component
// (a button, a checkbox, a tooltip trigger) can't hijack the card's own click-to-navigate.
function inertRef(node: HTMLDivElement | null) {
  if (node) node.inert = true;
}

export function ComponentCard({ slug, name, description, preview, compactPreview }: ComponentCardProps) {
  return (
    <NavLink to={`/components/${slug}`} className="component-card-link">
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.15 }}>
        <Card className="component-card">
          <div
            className={`component-card__preview${compactPreview ? ' component-card__preview--compact' : ''}`}
            ref={inertRef}
          >
            {preview}
          </div>
          <CardContent>
            <Text as="h3" styleAs="label">
              {name}
            </Text>
            {description && (
              <Text styleAs="caption" className="component-card__description">
                {description}
              </Text>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </NavLink>
  );
}
