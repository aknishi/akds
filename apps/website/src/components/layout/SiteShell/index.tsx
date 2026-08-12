import React from 'react';
import { useLocation, useOutlet } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { TopNav } from '../TopNav';
import { Sidebar } from '../Sidebar';
import { MobileNav } from '../MobileNav';
import { Footer } from '../Footer';
import { PageContainer } from '../PageContainer';

export function SiteShell() {
  const location = useLocation();
  const outlet = useOutlet();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const showSidebar = location.pathname !== '/';

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="site-shell">
      <TopNav onMenuClick={() => setMobileNavOpen(true)} />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className={`site-shell__body${showSidebar ? '' : ' site-shell__body--no-sidebar'}`}>
        {showSidebar && <Sidebar />}
        <main className={`site-shell__main${showSidebar ? ' site-shell__main--docs' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {showSidebar ? <PageContainer>{outlet}</PageContainer> : outlet}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer />
    </div>
  );
}
