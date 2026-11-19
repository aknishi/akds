import React from 'react';
import { ErrorFilledIcon } from '@aknishi/akds-icons';
import './FieldErrorIcon.css';

/**
 * Error icon that prefixes field error messages so the error state isn't
 * conveyed by color alone. Exposed to assistive tech as an image named
 * "Error", so the message reads "Error, <message>".
 */
export function FieldErrorIcon() {
  return (
    <span role="img" aria-label="Error" className="akds-field-error-icon">
      <ErrorFilledIcon size="sm" color="error" />
    </span>
  );
}
