import React from 'react';
import { useLocation } from 'react-router';
import { Drawer } from '@aknishi/akds-reactkit';
import { SidebarContent } from '../Sidebar/SidebarContent';

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const location = useLocation();

  const isFirstRender = React.useRef(true);
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onCloseRef.current();
    // Only re-run when the route actually changes — onClose's identity
    // changes on every SiteShell re-render (including the one that opens
    // this drawer), which would otherwise close it immediately after opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Drawer open={open} onClose={onClose} side="left" size="md" title="Navigation">
      <SidebarContent />
    </Drawer>
  );
}
