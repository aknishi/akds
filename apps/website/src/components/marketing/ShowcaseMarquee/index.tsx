import { Avatar, Button, Card, CardContent, Switch, Tag } from '@aknishi/akds-reactkit';
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

// A CSS animation (see ShowcaseMarquee.css), not a framer-motion `animate` prop:
// pausing on hover by toggling `animate` between a keyframes array and undefined
// always restarted the scroll from its first keyframe on mouse-leave, since Motion
// has no way to know "resume from the current visual position" for a keyframes
// animation — it was a visible snap back to the start on every hover-out.
// `animation-play-state: paused` doesn't have that problem: the browser tracks the
// animation's current progress and resumes it exactly where it paused.
export function ShowcaseMarquee() {
  return (
    <div className="showcase-marquee" role="presentation">
      <div className="showcase-marquee__track">
        <MarqueeItems />
        <MarqueeItems />
      </div>
    </div>
  );
}
