import React from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { TextInput } from '@aknishi/akds-reactkit';
import { SearchIcon } from '@aknishi/akds-icons';
import { searchSite } from '../../../content/searchIndex';
import type { SearchItem } from '../../../content/searchIndex';
import './SearchBar.css';

const LISTBOX_ID = 'site-search-listbox';
const IS_APPLE = typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform ?? navigator.userAgent);

export function SearchBar() {
  const navigate = useNavigate();
  const labelId = React.useId();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const results = React.useMemo(() => searchSite(query), [query]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  // Cmd/Ctrl+K focuses search from anywhere on the site, matching the
  // accelerator power users expect from a dev-tool docs site.
  React.useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        containerRef.current?.querySelector('input')?.focus();
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  const selectItem = (item: SearchItem) => {
    navigate(item.path);
    setQuery('');
    setOpen(false);
    setActiveIndex(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) {
      if (event.key === 'ArrowDown' && results.length > 0) {
        setOpen(true);
      }
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = results[activeIndex];
      if (item) selectItem(item);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const showListbox = open && query.trim().length > 0;

  return (
    <div className="site-search" ref={containerRef}>
      <span id={labelId} className="site-search__visually-hidden">
        Search components and pages
      </span>
      <TextInput
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim()) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        startAdornment={<SearchIcon size="sm" aria-hidden="true" />}
        placeholder="Search"
        aria-labelledby={labelId}
        role="combobox"
        aria-expanded={showListbox}
        aria-controls={LISTBOX_ID}
        aria-autocomplete="list"
        aria-activedescendant={showListbox && results[activeIndex] ? `${LISTBOX_ID}-${results[activeIndex].id}` : undefined}
        autoComplete="off"
        wrapperClassName="site-search__input site-search__input--pill"
      />
      {!query && (
        <span className="site-search__shortcut-hint" aria-hidden="true">
          {IS_APPLE ? '⌘K' : 'Ctrl K'}
        </span>
      )}
      <AnimatePresence>
        {showListbox && (
          <motion.ul
            id={LISTBOX_ID}
            role="listbox"
            className="site-search__listbox"
            aria-label="Search results"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            style={{ transformOrigin: 'top center' }}
          >
            {results.length === 0 ? (
              <li className="site-search__empty">No results for &ldquo;{query.trim()}&rdquo;</li>
            ) : (
              results.map((item, index) => (
                <li
                  key={item.id}
                  id={`${LISTBOX_ID}-${item.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`site-search__option${index === activeIndex ? ' site-search__option--active' : ''}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectItem(item)}
                >
                  <span className="site-search__option-label">{item.label}</span>
                  <span className="site-search__option-group">{item.group}</span>
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
