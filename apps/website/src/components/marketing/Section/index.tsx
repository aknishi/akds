import type React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../../lib/motion';
import { PageContainer } from '../../layout/PageContainer';
import './Section.css';

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  contained?: boolean;
  /**
   * Reveals the section with a scroll-triggered fade instead of rendering it
   * immediately. Reserve this for the one or two moments on a page that earn
   * a reveal — applying it to every section flattens hierarchy instead of
   * creating it. Defaults to false.
   */
  animated?: boolean;
}

export function Section({ children, className, contained = true, animated = false }: SectionProps) {
  const content = contained ? <PageContainer>{children}</PageContainer> : children;
  const sectionClassName = `marketing-section${className ? ` ${className}` : ''}`;

  if (!animated) {
    return <section className={sectionClassName}>{content}</section>;
  }

  return (
    <motion.section
      className={sectionClassName}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {content}
    </motion.section>
  );
}
