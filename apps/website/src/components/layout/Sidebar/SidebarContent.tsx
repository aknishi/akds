import React from 'react';
import { NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, OpenInNewIcon } from '@aknishi/akds-icons';
import { navConfig } from '../../../content/navConfig';
import { componentRegistry } from '../../../content/components/registry';
import { CATEGORY_ORDER } from '../../../content/components/types';
import { STORYBOOK_URL } from '../../../content/storybook';
import './Sidebar.css';

export function SidebarContent() {
  const location = useLocation();
  const [openCategories, setOpenCategories] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const match = componentRegistry.find((entry) => `/components/${entry.slug}` === location.pathname);
    if (match) {
      setOpenCategories((prev) => new Set(prev).add(match.category));
    }
  }, [location.pathname]);

  const categorized = CATEGORY_ORDER.map((category) => ({
    category,
    items: componentRegistry.filter((entry) => entry.category === category),
  })).filter((group) => group.items.length > 0);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  return (
    <nav className="sidebar-content" aria-label="Site navigation">
      {/* Only visible below the 1024px breakpoint where TopNav's own links are hidden —
          without these, the components index and Storybook are unreachable on mobile. */}
      <div className="sidebar-content__mobile-primary">
        <SidebarLink to="/components" label="All components" />
        <a
          href={STORYBOOK_URL}
          target="_blank"
          rel="noreferrer"
          className="sidebar-content__link sidebar-content__link--external"
        >
          Storybook <OpenInNewIcon size="sm" />
        </a>
      </div>

      {navConfig.map((group) => (
        <div className="sidebar-content__group" key={group.label}>
          <div className="sidebar-content__group-label">{group.label}</div>
          {group.items.map((item) => (
            <SidebarLink key={item.to} to={item.to} label={item.label} />
          ))}
        </div>
      ))}

      <div className="sidebar-content__group">
        <div className="sidebar-content__group-label">Components</div>
        {categorized.map(({ category, items }) => {
          const isOpen = openCategories.has(category);
          return (
            <div key={category}>
              <button
                type="button"
                className="sidebar-content__category-toggle"
                aria-expanded={isOpen}
                onClick={() => toggleCategory(category)}
              >
                <span>{category}</span>
                <motion.span
                  className="sidebar-content__chevron"
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                  aria-hidden="true"
                >
                  <ChevronRightIcon size="sm" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {items.map((item) => (
                      <SidebarLink key={item.slug} to={`/components/${item.slug}`} label={item.name} indent />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

function SidebarLink({ to, label, indent }: { to: string; label: string; indent?: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-content__link${indent ? ' sidebar-content__link--indent' : ''}${isActive ? ' sidebar-content__link--active' : ''}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-pill"
              className="sidebar-content__active-pill"
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            />
          )}
          <span className="sidebar-content__link-label">{label}</span>
        </>
      )}
    </NavLink>
  );
}
