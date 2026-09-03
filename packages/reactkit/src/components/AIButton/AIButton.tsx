import React from 'react';
import clsx from 'clsx';
import './AIButton.css';
import type { AIButtonProps } from './AIButton.types';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-ai-button');

export const AIButton = React.forwardRef<HTMLButtonElement, AIButtonProps>(
  function AIButton(
    {
      loading,
      loadingLabel = 'Generating',
      disabled = false,
      focusableWhenDisabled = false,
      className,
      children,
      onClick,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const isLoadingControlled = loading !== undefined;
    const [uncontrolledLoading, setUncontrolledLoading] = React.useState(false);
    const isLoading = isLoadingControlled ? loading : uncontrolledLoading;

    const isDisabled = disabled || isLoading;
    const useAriaDisabled = isDisabled && focusableWhenDisabled;
    const rippleRef = React.useRef<RippleBaseHandle>(null);

    // Gate the label-swap animation to actual loading transitions so it
    // doesn't replay just because the button renders already-loading on mount.
    const prevLoadingRef = React.useRef(isLoading);
    const justStartedLoading = isLoading && !prevLoadingRef.current;
    React.useEffect(() => {
      prevLoadingRef.current = isLoading;
    }, [isLoading]);

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      rippleRef.current?.trigger(e);
      onPointerDown?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (useAriaDisabled) {
        e.preventDefault();
        return;
      }
      const result = onClick?.(e) as unknown;
      // Uncontrolled mode
      if (!isLoadingControlled) {
        setUncontrolledLoading(true);
      }
    };

    return (
      <div className={withBaseName.el('wrapper')}>
        <button
          ref={ref}
          type="button"
          disabled={useAriaDisabled ? undefined : isDisabled || undefined}
          aria-disabled={isDisabled || undefined}
          aria-busy={isLoading || undefined}
          className={clsx(
            withBaseName(),
            { [withBaseName('disabled')]: disabled },
            { [withBaseName('loading')]: isLoading },
            { [withBaseName('loading') + '--enter']: justStartedLoading },
            className,
          )}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          {...rest}
        >
          <svg className={withBaseName.el('start-icon')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            ></path>
          </svg>

          <div className={withBaseName.el('text-wrapper')}>
            <div className={withBaseName.el('default-text')}>
              {typeof children === 'string'
                ? Array.from(children).map((char, index) => (
                    <span
                      key={index}
                      className={withBaseName.el('letter')}
                      style={{ '--letter-index': index } as React.CSSProperties}
                    >
                      {char}
                    </span>
                  ))
                : children}
            </div>
            <div className={withBaseName.el('loading-text')}>
              {typeof loadingLabel === 'string'
                ? Array.from(loadingLabel).map((char, index) => (
                    <span
                      key={index}
                      className={withBaseName.el('letter')}
                      style={{ '--letter-index': index } as React.CSSProperties}
                    >
                      {char}
                    </span>
                  ))
                : loadingLabel}
            </div>
          </div>
        </button>
      </div>
    );
  },
);

AIButton.displayName = 'AIButton';
