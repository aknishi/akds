import { Routes, Route } from 'react-router';
import { SiteShell } from './components/layout/SiteShell';
import { LandingPage } from './pages/LandingPage';
import { GettingStartedPage } from './pages/GettingStartedPage';
import { ComponentsIndexPage } from './pages/ComponentsIndexPage';
import { ComponentDocPage } from './pages/ComponentDocPage';
import { TokensPage } from './pages/TokensPage';
import { IconsPage } from './pages/IconsPage';
import { PackagesPage } from './pages/PackagesPage';
import { GuidelinesDesignPage } from './pages/GuidelinesDesignPage';
import { GuidelinesAccessibilityPage } from './pages/GuidelinesAccessibilityPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<SiteShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/getting-started" element={<GettingStartedPage />} />
        <Route path="/components" element={<ComponentsIndexPage />} />
        <Route path="/components/:slug" element={<ComponentDocPage />} />
        <Route path="/tokens" element={<TokensPage />} />
        <Route path="/icons" element={<IconsPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/guidelines/design" element={<GuidelinesDesignPage />} />
        <Route path="/guidelines/accessibility" element={<GuidelinesAccessibilityPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
