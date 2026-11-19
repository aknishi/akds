import React from 'react';

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

function supportsUserInvalid(): boolean {
  return (
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('selector(:user-invalid)')
  );
}

/**
 * Mirrors the CSS `:user-invalid` state of a native field into React state so
 * `aria-invalid` and the visible error message change at the same moment as
 * the error styling: after the user edits and leaves the field, or after a
 * submit attempt — never while the field is pristine.
 *
 * Where `:user-invalid` is unsupported, the same timing is tracked manually
 * (edited + blurred, or an `invalid` event) and `validity.valid` decides.
 */
export function useUserInvalid<T extends FieldElement>(fieldRef: React.RefObject<T>) {
  const [userInvalid, setUserInvalid] = React.useState(false);
  const [validationMessage, setValidationMessage] = React.useState('');
  const interaction = React.useRef({ edited: false, blurred: false });

  const sync = React.useCallback((el: T, forceInvalid = false) => {
    let invalid: boolean;
    if (forceInvalid) {
      invalid = true;
    } else if (supportsUserInvalid()) {
      invalid = el.matches(':user-invalid');
    } else {
      const { edited, blurred } = interaction.current;
      invalid = edited && blurred && !el.validity.valid;
    }
    setUserInvalid(invalid);
    setValidationMessage(invalid ? el.validationMessage : '');
  }, []);

  // A form reset clears :user-invalid after the 'reset' event fires.
  React.useEffect(() => {
    const form = fieldRef.current?.form;
    if (!form) return undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handleReset = () => {
      interaction.current = { edited: false, blurred: false };
      timer = setTimeout(() => {
        setUserInvalid(false);
        setValidationMessage('');
      });
    };
    form.addEventListener('reset', handleReset);
    return () => {
      form.removeEventListener('reset', handleReset);
      if (timer) clearTimeout(timer);
    };
  }, [fieldRef]);

  const onBlur = (e: React.FocusEvent<T>) => {
    interaction.current.blurred = true;
    sync(e.currentTarget);
  };

  const onChange = (e: React.ChangeEvent<T>) => {
    interaction.current.edited = true;
    // Only re-check once the field has been left at least once, so errors
    // aren't raised while the user is still typing — but are cleared as soon
    // as the value is fixed.
    if (interaction.current.blurred) sync(e.currentTarget);
  };

  // A failed submit (or reportValidity) fires 'invalid' on each failing
  // field, including ones the user never touched; that counts as interaction.
  const onInvalid = (e: React.FormEvent<T>) => {
    interaction.current = { edited: true, blurred: true };
    sync(e.currentTarget, true);
  };

  return { userInvalid, validationMessage, onBlur, onChange, onInvalid };
}
