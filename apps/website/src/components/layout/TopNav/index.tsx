import React from 'react';
import { NavLink } from 'react-router';
import { IconButton, ToggleButton, ToggleGroup, useTheme } from '@aknishi/akds-reactkit';
import { DarkModeFilledIcon, DarkModeIcon, MenuIcon, OpenInNewIcon, SunnyFilledIcon, SunnyIcon } from '@aknishi/akds-icons';
import { STORYBOOK_URL } from '../../../content/storybook';
import './TopNav.css';

export interface TopNavProps {
  onMenuClick: () => void;
  hasSidebar: boolean;
  mobileNavOpen: boolean;
}

const TOP_LINKS = [
  { label: 'Components', to: '/components' },
  { label: 'Tokens', to: '/tokens' },
  { label: 'Guidelines', to: '/guidelines/design' },
  { label: 'Packages', to: '/packages' },
];

export function TopNav({ onMenuClick, hasSidebar, mobileNavOpen }: TopNavProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`top-nav${scrolled ? ' top-nav--scrolled' : ''}`}>
      <div className="top-nav__inner">
        <IconButton
          appearance="transparent"
          emphasis="neutral"
          className={`top-nav__menu-button${hasSidebar ? ' top-nav__menu-button--has-sidebar' : ''}${mobileNavOpen ? ' top-nav__menu-button--nav-open' : ''}`}
          aria-label="Open navigation menu"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>

        <NavLink to="/" className="top-nav__brand">
          <img
            src={isDark ? '/AKLogo-dark.svg' : '/AKLogo.svg'}
            alt=""
            className="top-nav__brand-logo"
          />
          <span className="top-nav__brand-text">
            <span className="top-nav__brand-tagline">design system</span>
          </span>
        </NavLink>

        <nav className="top-nav__links" aria-label="Primary navigation">
          {TOP_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `top-nav__link${isActive ? ' top-nav__link--active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          <a href={STORYBOOK_URL} target="_blank" rel="noreferrer" className="top-nav__link top-nav__link--external">
            Storybook <OpenInNewIcon size="sm" />
          </a>
        </nav>

        <div className="top-nav__actions">
          <ToggleGroup
            size="sm"
            value={isDark ? 'dark' : 'light'}
            onChange={(value) => setTheme(value === 'dark' ? 'dark' : 'light')}
          >
            <ToggleButton value="light" aria-label="Light mode">
              {isDark ? <SunnyIcon /> : <SunnyFilledIcon />}
              <span className="top-nav__toggle-label">Light</span>
            </ToggleButton>
            <ToggleButton value="dark" aria-label="Dark mode">
              {isDark ? <DarkModeFilledIcon /> : <DarkModeIcon />}
              <span className="top-nav__toggle-label">Dark</span>
            </ToggleButton>
          </ToggleGroup>
        </div>
      </div>
    </header>
  );
}
