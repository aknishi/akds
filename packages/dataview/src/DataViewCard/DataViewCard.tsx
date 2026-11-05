import React from 'react';
import clsx from 'clsx';
import './DataViewCard.css';
import type { DataViewCardProps } from './DataViewCard.types';
import type { AvatarProps } from '@aknishi/akds-reactkit';
import { Avatar, Card, CardContent, CardFooter, CardHeader, Checkbox, VisuallyHidden } from '@aknishi/akds-reactkit';
import { useDataViewRow, useRowLabel, IGNORE_CLICK_ATTRIBUTE } from '../headless';
import { DataViewActions } from '../DataViewActions';
import { DataViewDetailsSlot } from '../DataViewDetailsButton';
import { CARD_ROW_ID_ATTRIBUTE } from './cardRowId';
import { makePrefixer } from '../utils';

const withBaseName = makePrefixer('akds-dataview-card');

export const DataViewCard = React.forwardRef<HTMLDivElement, DataViewCardProps>(
  function DataViewCard(
    {
      title,
      subtitle,
      avatar,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const { row, selectable, cardActions, cardActionsPlacement, tabIndex, rowClickOptions } = useDataViewRow();
    const getRowLabel = useRowLabel();
    const titleId = React.useId();
    const isSelected = row.getIsSelected();
    const label = getRowLabel(row);
    const actions = cardActions ? (
      <DataViewActions {...{ [IGNORE_CLICK_ATTRIBUTE]: '' }}>{cardActions(row)}</DataViewActions>
    ) : null;

    // An Avatar without a size defaults to sm in the card header. An explicit
    // size is kept.
    const sizedAvatar =
      React.isValidElement<AvatarProps>(avatar) && avatar.type === Avatar && avatar.props.size === undefined
        ? React.cloneElement(avatar, { size: 'sm' })
        : avatar;

    // The frame is fixed so every team's card reads in the same order:
    // checkbox, avatar, title and subtitle, details control, header actions,
    // body, footer actions.
    return (
      <Card
        ref={ref}
        role="group"
        aria-labelledby={titleId}
        tabIndex={tabIndex}
        {...{ [CARD_ROW_ID_ATTRIBUTE]: row.id }}
        className={clsx(
          withBaseName(),
          {
            [withBaseName('selected')]: isSelected,
            [withBaseName('with-avatar')]: Boolean(avatar),
          },
          className,
        )}
        {...rest}
      >
        <CardHeader className={withBaseName.el('header')}>
          {selectable && (
            <Checkbox
              className={withBaseName.el('checkbox')}
              label={<VisuallyHidden>Select {label}</VisuallyHidden>}
              checked={isSelected}
              onChange={row.getToggleSelectedHandler()}
            />
          )}
          {avatar && <span className={withBaseName.el('avatar')}>{sizedAvatar}</span>}
          <div className={withBaseName.el('heading')}>
            {/* A real h3 for heading navigation, styled like any CardHeader text. */}
            <h3 id={titleId} className={withBaseName.el('title')}>
              {title}
            </h3>
            {subtitle && <p className={withBaseName.el('subtitle')}>{subtitle}</p>}
          </div>
          {rowClickOptions && <DataViewDetailsSlot row={row} rowLabel={label} options={rowClickOptions} />}
          {cardActionsPlacement === 'header' && actions}
        </CardHeader>
        <CardContent className={withBaseName.el('body')}>{children}</CardContent>
        {cardActionsPlacement === 'footer' && actions && (
          <CardFooter className={withBaseName.el('footer')}>{actions}</CardFooter>
        )}
      </Card>
    );
  },
);

DataViewCard.displayName = 'DataViewCard';
