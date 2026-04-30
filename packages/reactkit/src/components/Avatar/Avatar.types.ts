import React from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarColor = 'blue' | 'green' | 'purple' | 'orange' | 'red';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Takes priority over name and icon. */
  src?: string;
  /** Alt text for the image. Should be provided when src is set. */
  alt?: string;
  /** Name used to derive initials and deterministically assign a color. */
  name?: string;
  /** Icon rendered when neither src nor name is provided. Falls back to PersonIcon. */
  icon?: React.ReactNode;
  /** Size of the avatar. */
  size?: AvatarSize;
  /** Overrides the auto-derived color for the initials variant. */
  color?: AvatarColor;
}
