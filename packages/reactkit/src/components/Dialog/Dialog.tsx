import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import './Dialog.css';
import type { DialogProps } from './Dialog.types';
import { CloseIcon } from '@aknishi/akds-icons';
import { IconButton } from '../IconButton';
import { makePrefixer, useModalDialog } from '../../utils';

const withBaseName = makePrefixer('akds-dialog');

/**
 * A native modal `<dialog>` opened with `showModal()`. The browser provides
 * the top layer, `::backdrop`, inert page, focus containment, Escape handling
 * and focus return to the trigger — none of it is reimplemented here.
 */
export const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(
  function Dialog(
    {
      open,
      onClose,
      title,
      children,
      size = 'md',
      disableBackdropClose = false,
      className,
      'aria-label': ariaLabel,
    },
    ref,
  ) {
    const titleId = React.useId();
    const { dialogRef, mounted, dialogProps } = useModalDialog({
      open,
      onClose,
      lightDismiss: !disableBackdropClose,
    });

    React.useImperativeHandle(ref, () => dialogRef.current!, [mounted]);

    if (!mounted) return null;

    return ReactDOM.createPortal(
      <dialog
        ref={dialogRef}
        {...dialogProps}
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        className={clsx(withBaseName(), withBaseName(size), className)}
      >
        <div className={withBaseName.el('header')}>
          {title && (
            <h2 id={titleId} className={withBaseName.el('title')}>{title}</h2>
          )}
          <IconButton
            className={withBaseName.el('close')}
            appearance="transparent"
            emphasis="neutral"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className={withBaseName.el('body')}>{children}</div>
      </dialog>,
      document.body,
    );
  },
);

Dialog.displayName = 'Dialog';
