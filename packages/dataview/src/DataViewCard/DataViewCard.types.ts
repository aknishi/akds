import type React from 'react';

export interface DataViewCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /**
   * The card's title, rendered as an h3. Also names the card group. The
   * checkbox and Details button are named by useDataView's `getRowLabel`.
   * Overrides the inherited HTML `title` attribute.
   */
  title: string;
  /**
   * Secondary text rendered below the title, such as an email or a role.
   * The title and subtitle stack as one block.
   */
  subtitle?: React.ReactNode;
  /**
   * An avatar, usually `<Avatar />`, rendered between the checkbox and the
   * title. The checkbox, avatar, and title block center on each other, while
   * the Details control and header actions stay top aligned. An `<Avatar />`
   * without a `size` renders at `sm`; an explicit `size` is respected.
   */
  avatar?: React.ReactNode;
  /** The card body: the flexible region where teams lay out fields. Required. */
  children: React.ReactNode;
}
