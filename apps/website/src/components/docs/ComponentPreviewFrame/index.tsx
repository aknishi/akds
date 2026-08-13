import type React from 'react';
import { Card } from '@aknishi/akds-reactkit';
import './ComponentPreviewFrame.css';

export function ComponentPreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <Card className="component-preview-frame">
      <div className="component-preview-frame__inner">{children}</div>
    </Card>
  );
}
