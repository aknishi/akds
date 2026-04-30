import React from 'react';
import clsx from 'clsx';
import './Avatar.css';
import type { AvatarProps, AvatarColor, AvatarSize } from './Avatar.types';
import { PersonIcon } from '@aknishi/akds-icons';
import type { IconSize } from '@aknishi/akds-icons';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-avatar');

const AVATAR_COLORS: AvatarColor[] = ['blue', 'green', 'purple', 'orange', 'red'];

const ICON_SIZE_MAP: Record<AvatarSize, IconSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'lg',
};

function colorFromName(name: string): AvatarColor {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] as AvatarColor;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return (parts[0]?.[0] ?? '').toUpperCase();
  if (parts.length === 2) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  function Avatar(
    {
      src,
      alt = '',
      name,
      icon,
      size = 'md',
      color,
      className,
      ...rest
    },
    ref,
  ) {
    const resolvedColor = color ?? (name ? colorFromName(name) : undefined);

    const ariaLabel = (rest['aria-label'] as string | undefined) ?? name ?? (alt || undefined);

    return (
      <span
        ref={ref}
        role="img"
        aria-label={ariaLabel}
        className={clsx(
          withBaseName(),
          withBaseName(size),
          resolvedColor && withBaseName(resolvedColor),
          className,
        )}
        {...rest}
      >
        {src ? (
          <img src={src} alt="" className="akds-avatar__image" />
        ) : name ? (
          <span className="akds-avatar__initials" aria-hidden="true">
            {getInitials(name)}
          </span>
        ) : icon ? (
          <span className="akds-avatar__icon" aria-hidden="true">{icon}</span>
        ) : (
          <PersonIcon size={ICON_SIZE_MAP[size]} aria-hidden="true" className="akds-avatar__icon" />
        )}
      </span>
    );
  },
);

Avatar.displayName = 'Avatar';
