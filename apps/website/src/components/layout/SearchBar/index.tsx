import React from 'react';
import { useNavigate } from 'react-router';
import { TextInput } from '@aknishi/akds-reactkit';
import { SearchIcon } from '@aknishi/akds-icons';
import { searchSite } from '../../../content/searchIndex';
import type { SearchItem } from '../../../content/searchIndex';
import './SearchBar.css';

const LISTBOX_ID = 'site-search-listbox';

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
      {showListbox && (
        <ul id={LISTBOX_ID} role="listbox" className="site-search__listbox" aria-label="Search results">
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
        </ul>
      )}
    </div>
  );
}
