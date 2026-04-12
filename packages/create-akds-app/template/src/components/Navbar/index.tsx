import React from 'react';
import { NavLink } from 'react-router';
import { Button, useTheme } from '@aknishi/akds-reactkit';
import './Navbar.css';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar__brand">
        my-app
      </NavLink>

      <nav className="navbar__links" aria-label="Main navigation">
        <NavLink to="/" end className="navbar__link">
          Home
        </NavLink>
        <NavLink to="/about" className="navbar__link">
          About
        </NavLink>
      </nav>

      <Button
        appearance="bordered"
        emphasis="neutral"
        size="sm"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
      >
        {isDark ? '☀ Light' : '☾ Dark'}
      </Button>
    </header>
  );
}
