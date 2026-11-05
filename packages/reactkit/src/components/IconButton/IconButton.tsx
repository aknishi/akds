import React from 'react';
import clsx from 'clsx';
import './IconButton.css';
import type { IconButtonLinkProps, IconButtonProps } from './IconButton.types';
import { Spinner } from '../Spinner';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-icon-button');

/**
 * Two call signatures, so each form gets the right props and ref type:
 * without `href` it's exactly the button it has always been
 * (HTMLButtonElement ref); with `href` it's a link (HTMLAnchorElement ref).
 * The button signature is last, so `React.ComponentProps<typeof IconButton>`
 * still resolves to the button props.
 */
interface IconButtonComponent {
  (props: IconButtonLinkProps & React.RefAttributes<HTMLAnchorElement>): React.ReactElement | null;
  (props: IconButtonProps & React.RefAttributes<HTMLButtonElement>): React.ReactElement | null;
  displayName?: string;
}

const isLinkProps = (props: IconButtonProps | IconButtonLinkProps): props is IconButtonLinkProps =>
  typeof (props as IconButtonLinkProps).href === 'string';

export const IconButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps | IconButtonLinkProps>(
  function IconButton(props, ref) {
    const rippleRef = React.useRef<RippleBaseHandle>(null);
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isLinkProps(props)) {
      const {
        appearance = 'solid',
        emphasis = 'neutral',
        target,
        rel,
        className,
        children,
        onPointerDown,
        ...rest
      } = props;

      const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
        rippleRef.current?.trigger(e);
        onPointerDown?.(e);
      };

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          target={target}
          // A new tab shouldn't get access to this page through window.opener.
          rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
          className={clsx(
            withBaseName(),
            withBaseName(appearance),
            withBaseName(emphasis),
            className,
          )}
          onPointerDown={handlePointerDown}
          {...rest}
        >
          {children}
          {!prefersReducedMotion && (
            <RippleBase ref={rippleRef} onDark={appearance === 'solid' && emphasis !== 'neutral'} />
          )}
        </a>
      );
    }

    const {
      appearance = 'solid',
      emphasis = 'neutral',
      loading = false,
      disabled = false,
      focusableWhenDisabled = false,
      className,
      children,
      onClick,
      onPointerDown,
      ...rest
    } = props;
    const isDisabled = disabled || loading;
    // While loading, use aria-disabled (not native disabled) so the button
    // that was just activated keeps keyboard focus.
    const useAriaDisabled = isDisabled && (focusableWhenDisabled || !disabled);

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      rippleRef.current?.trigger(e);
      onPointerDown?.(e);
    };

    const handleClick = useAriaDisabled
      ? (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()
      : onClick;

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={useAriaDisabled ? undefined : isDisabled || undefined}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        className={clsx(
          withBaseName(),
          withBaseName(appearance),
          withBaseName(emphasis),
          { [withBaseName('disabled')]: isDisabled },
          className,
        )}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        {loading ? <Spinner /> : children}
        {!prefersReducedMotion && (
          <RippleBase ref={rippleRef} disabled={isDisabled} onDark={appearance === 'solid' && emphasis !== 'neutral'} />
        )}
      </button>
    );
  },
) as IconButtonComponent;

IconButton.displayName = 'IconButton';
