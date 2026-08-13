import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, Button, Card, CardContent, Switch, Tag } from '@aknishi/akds-reactkit';
import { usePrefersReducedMotion } from '../../../lib/usePrefersReducedMotion';
import './ShowcaseMarquee.css';

function MarqueeItems() {
  return (
    <>
      <Card className="showcase-marquee__card">
        <CardContent>
          <Button appearance="solid" emphasis="accented">
            Button
          </Button>
        </CardContent>
      </Card>
      <Card className="showcase-marquee__card">
        <CardContent>
          <Switch label="Switch" defaultChecked />
        </CardContent>
      </Card>
      <Card className="showcase-marquee__card">
        <CardContent>
          <Tag variant="success">Tag</Tag>
        </CardContent>
      </Card>
      <Card className="showcase-marquee__card">
        <CardContent>
          <Avatar name="Ada Lovelace" />
        </CardContent>
      </Card>
      <Card className="showcase-marquee__card">
        <CardContent>
          <Button appearance="bordered" emphasis="neutral">
            Bordered
          </Button>
        </CardContent>
      </Card>
      <Card className="showcase-marquee__card">
        <CardContent>
          <Tag variant="warning">Warning</Tag>
        </CardContent>
      </Card>
    </>
  );
}

export function ShowcaseMarquee() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [paused, setPaused] = React.useState(false);

  const animated = !prefersReducedMotion && !paused;

  return (
    <div
      className="showcase-marquee"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="presentation"
    >
      <motion.div
        className="showcase-marquee__track"
        animate={animated ? { x: ['0%', '-50%'] } : undefined}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        <MarqueeItems />
        <MarqueeItems />
      </motion.div>
    </div>
  );
}
