export type IconButtonAppearance = 'solid' | 'transparent' | 'bordered';
export type IconButtonEmphasis = 'accented' | 'neutral' | 'success' | 'destructive';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Controls the visual style of the button. */
  appearance?: IconButtonAppearance;
  /** Conveys the intent or meaning of the action. */
  emphasis?: IconButtonEmphasis;
  /** When true, replaces the icon with a spinner and disables interaction. */
  loading?: boolean;
  /**
   * When true, a disabled button remains focusable so screen readers can
   * discover it. Sets `aria-disabled` instead of the native `disabled`
   * attribute, which would remove it from the tab order entirely.
   */
  focusableWhenDisabled?: boolean;
  /** A single icon rendered inside the button. Required — overrides the optional inherited type. */
  children: React.ReactNode;
  /**
   * Accessible label describing the button's action, e.g. "Delete item".
   * Required because the button renders only an icon with no visible text —
   * screen readers announce this label in its place. Overrides the optional
   * inherited type.
   */
  'aria-label': string;
}

/**
 * IconButton rendered as a link, for actions that navigate: pass `href` and
 * it renders an `<a>` with the same styles, so users keep middle-click,
 * ⌘/Ctrl-click, "Copy link", and the URL preview. Links can't be disabled
 * or loading, so those props aren't available.
 */
export interface IconButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The URL to go to. Renders the button as an `<a>`. Required — overrides the optional inherited type. */
  href: string;
  /** Controls the visual style of the button. */
  appearance?: IconButtonAppearance;
  /** Conveys the intent or meaning of the action. */
  emphasis?: IconButtonEmphasis;
  /**
   * Where to open the link, e.g. `"_blank"` for a new tab. With `"_blank"`,
   * `rel` defaults to `"noopener noreferrer"`, and `aria-label` should say
   * that it opens a new tab.
   */
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  /** A single icon rendered inside the link. Required — overrides the optional inherited type. */
  children: React.ReactNode;
  /**
   * Accessible label describing where the link goes, e.g. "Go to order
   * ORD-1024". Required because the link renders only an icon. Overrides the
   * optional inherited type.
   */
  'aria-label': string;
}
