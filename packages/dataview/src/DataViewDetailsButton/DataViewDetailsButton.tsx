import React from 'react';
import clsx from 'clsx';
import { IconButton, Tooltip } from '@aknishi/akds-reactkit';
import { ChevronRightIcon, OpenInNewIcon, RightPanelOpenIcon } from '@aknishi/akds-icons';
import type { DataViewDetailsButtonProps, DataViewDetailsTarget } from './DataViewDetailsButton.types';
import { makePrefixer } from '../utils';

const withBaseName = makePrefixer('akds-dataview-details-button');

/**
 * The icon, accessible name, and tooltip for each target, kept together so
 * choosing where details open gives a matching set. Each tooltip starts with
 * the same words as the name, so voice control users know what to say.
 */
const TARGETS: Record<DataViewDetailsTarget, { icon: React.ReactNode; label: (rowLabel: string) => string; tooltip: string }> = {
  drawer: {
    icon: <RightPanelOpenIcon aria-hidden="true" />,
    label: (rowLabel) => `View details for ${rowLabel}`,
    tooltip: 'View details',
  },
  page: {
    icon: <ChevronRightIcon aria-hidden="true" />,
    label: (rowLabel) => `Go to details for ${rowLabel}`,
    tooltip: 'Go to details',
  },
  // A new tab must be announced before it opens, not only shown by the icon.
  'new-tab': {
    icon: <OpenInNewIcon aria-hidden="true" />,
    label: (rowLabel) => `Open details for ${rowLabel} in a new tab`,
    tooltip: 'Open in a new tab',
  },
};

/**
 * The default details control: an icon button with a tooltip, named for
 * the row. Exported for `rowClickOptions.renderButton`, to keep the standard
 * button with a different target, icon, name, or tooltip.
 */
export const DataViewDetailsButton = React.forwardRef<HTMLButtonElement, DataViewDetailsButtonProps>(
  function DataViewDetailsButton(
    {
      rowLabel,
      onClick,
      target = 'drawer',
      icon,
      label,
      tooltip,
      className,
    },
    ref,
  ) {
    const preset = TARGETS[target];
    return (
      <Tooltip content={tooltip ?? preset.tooltip}>
        <IconButton
          ref={ref}
          appearance="solid"
          aria-label={(label ?? preset.label)(rowLabel)}
          className={clsx(withBaseName(), className)}
          // No stopPropagation: the row's own handler ignores clicks on buttons.
          onClick={onClick}
        >
          {icon ?? preset.icon}
        </IconButton>
      </Tooltip>
    );
  },
);

DataViewDetailsButton.displayName = 'DataViewDetailsButton';
