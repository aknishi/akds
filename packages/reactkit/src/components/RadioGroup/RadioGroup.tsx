import React from 'react';
import clsx from 'clsx';
import './RadioGroup.css';
import type { RadioGroupProps } from './RadioGroup.types';
import { RadioGroupContext } from './RadioGroupContext';
import { makePrefixer } from '../../utils';
import { devWarning } from '../../utils/devWarning';
import { Text } from '../Text';

const withBaseName = makePrefixer('akds-radio-group');

export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  function RadioGroup(
    {
      name,
      value,
      onChange,
      legend,
      disabled = false,
      orientation = 'vertical',
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const hasAccessibleName = Boolean(legend || rest['aria-label'] || rest['aria-labelledby']);
    React.useEffect(() => {
      if (!hasAccessibleName) {
        devWarning(
          `RadioGroup "${name}" has no accessible name. Pass \`legend\`, or \`aria-label\` / \`aria-labelledby\` when the group is labelled elsewhere.`,
        );
      }
    }, [hasAccessibleName, name]);

    return (
      <RadioGroupContext.Provider value={{ name, disabled, ...(value !== undefined && { value }), ...(onChange !== undefined && { onChange }) }}>
        <fieldset
          ref={ref}
          className={clsx(
            withBaseName(),
            withBaseName(orientation),
            { [withBaseName('disabled')]: disabled },
            className,
          )}
          {...rest}
        >
          {legend && <Text as="legend" className={withBaseName.el('legend')}>{legend}</Text>}
          {children}
        </fieldset>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';
