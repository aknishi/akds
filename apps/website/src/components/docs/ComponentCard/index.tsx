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
}

export function ComponentCard({ slug, name, description, preview }: ComponentCardProps) {
  return (
    <NavLink to={`/components/${slug}`} className="component-card-link">
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.15 }}>
        <Card className="component-card">
          <div className="component-card__preview">{preview}</div>
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
