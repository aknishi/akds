import React, { useState } from 'react';
import clsx from 'clsx';
import './LikeButton.css';
import type { LikeButtonProps } from './LikeButton.types';
import { ParticleBurst } from '../ParticleBurst';
import type { ParticleBurstHandle } from '../ParticleBurst';
import { makePrefixer } from '../../utils';
import { FavoriteFilledIcon, FavoriteIcon } from '@aknishi/akds-icons';

const withBaseName = makePrefixer('akds-like-button');

export const LikeButton = React.forwardRef<HTMLButtonElement, LikeButtonProps>(
  function LikeButton(
    {
      liked,
      disabled = false,
      focusableWhenDisabled = false,
      className,
      onClick,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const [isLiked, setIsLiked] = useState(false);
    const particleBurstRef = React.useRef<ParticleBurstHandle>(null);
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const likedState = liked === undefined ? isLiked : liked;

    React.useEffect(() => {
      setIsLiked(likedState);
    }, [likedState]);

    const isDisabled = disabled;
    const useAriaDisabled = isDisabled && focusableWhenDisabled;
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if(useAriaDisabled) {
        e.preventDefault()
        return
      }
      const nextLiked = !likedState;
      setIsLiked(nextLiked)
      if (nextLiked) {
        particleBurstRef.current?.trigger();
      }
      onClick?.(e);
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={useAriaDisabled ? undefined : isDisabled || undefined}
        aria-disabled={isDisabled || undefined}
        className={clsx(
          withBaseName(),
          { [withBaseName('disabled')]: isDisabled },
          className,
        )}
        onClick={handleClick}
        {...rest}
      >
        {likedState ? <FavoriteFilledIcon color="error"/>: <FavoriteIcon />}
        {!prefersReducedMotion && (
          <ParticleBurst
            ref={particleBurstRef}
            color="red"
            spacingFromCenter="var(--akds-spacing-50)"
          />
        )}
      </button>
    );
  },
);

LikeButton.displayName = 'LikeButton';
