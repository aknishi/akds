import type React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../../lib/motion';
import { PageContainer } from '../../layout/PageContainer';
import './Section.css';

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  contained?: boolean;
}

export function Section({ children, className, contained = true }: SectionProps) {
  const content = contained ? <PageContainer>{children}</PageContainer> : children;

  return (
    <motion.section
      className={`marketing-section${className ? ` ${className}` : ''}`}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {content}
    </motion.section>
  );
}
