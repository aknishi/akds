/**
 * Generates React SVG icon components from @material-symbols/svg-400.
 * Run with: npm run generate
 *
 * To add icons: add an entry to ICONS below and re-run.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const SYMBOLS_DIR = join(
  dirname(require.resolve('@material-symbols/svg-400/package.json')),
  'rounded',
);
const OUT_DIR = join(ROOT, 'src/components');

/** Map of component name → material symbol filename (without .svg) */
const ICONS: Record<string, string> = {
  // Status
  CheckIcon: 'check',
  CheckCircleIcon: 'check_circle',
  CheckCircleFilledIcon: 'check_circle-fill',
  ErrorIcon: 'error',
  ErrorFilledIcon: 'error-fill',
  WarningIcon: 'warning',
  WarningFilledIcon: 'warning-fill',
  InfoIcon: 'info',
  InfoFilledIcon: 'info-fill',

  // Rating & Social
  StarIcon: 'star',
  StarFilledIcon: 'star-fill',
  StarHalfIcon: 'star_half',
  FavoriteIcon: 'favorite',
  FavoriteFilledIcon: 'favorite-fill',
  ThumbsUpIcon: 'thumb_up',
  ThumbsUpFilledIcon: 'thumb_up-fill',

  // Arrows & Chevrons
  ArrowBackIcon: 'arrow_back',
  ArrowDownIcon: 'arrow_downward',
  ArrowForwardIcon: 'arrow_forward',
  ArrowUpIcon: 'arrow_upward',
  ChevronDownIcon: 'keyboard_arrow_down',
  ChevronLeftIcon: 'chevron_left',
  ChevronRightIcon: 'chevron_right',
  ChevronUpIcon: 'keyboard_arrow_up',
  KeyboardArrowDownIcon: 'keyboard_arrow_down',
  KeyboardArrowLeftIcon: 'keyboard_arrow_left',
  KeyboardArrowRightIcon: 'keyboard_arrow_right',
  KeyboardArrowUpIcon: 'keyboard_arrow_up',

  // Actions
  AddIcon: 'add',
  BlockIcon: 'block',
  CancelIcon: 'cancel',
  CancelFilledIcon: 'cancel-fill',
  CloseIcon: 'close',
  CopyIcon: 'content_copy',
  CopyFilledIcon: 'content_copy-fill',
  DeleteIcon: 'delete',
  DragPanIcon: 'drag_pan',
  EditIcon: 'edit',
  EditFilledIcon: 'edit-fill',
  FilterIcon: 'filter_alt',
  FilterFilledIcon: 'filter_alt-fill',
  AnimationIcon: 'animation',
  AnimationFilledIcon: 'animation-fill',
  FlashIcon: 'bolt',
  FlashFilledIcon: 'bolt-fill',
  MoveIcon: 'open_with',
  OpenInFullIcon: 'open_in_full',
  OpenInNewIcon: 'open_in_new',
  PrintIcon: 'print',
  PrintFilledIcon: 'print-fill',
  RedoIcon: 'redo',
  RefreshIcon: 'refresh',
  RestartIcon: 'restart_alt',
  SaveIcon: 'save',
  SaveFilledIcon: 'save-fill',
  ScheduleIcon: 'schedule',
  SearchIcon: 'search',
  UndoIcon: 'undo',
  UploadIcon: 'upload',
  ZoomInIcon: 'zoom_in',
  ZoomOutIcon: 'zoom_out',

  // Navigation & UI
  AppsIcon: 'apps',
  CalendarMonthIcon: 'calendar_month',
  DashboardIcon: 'dashboard',
  DashboardFilledIcon: 'dashboard-fill',
  GridViewIcon: 'grid_view',
  GridViewFilledIcon: 'grid_view-fill',
  HomeIcon: 'home',
  MenuIcon: 'menu',
  MoreVertIcon: 'more_vert',
  SettingsIcon: 'settings',
  SettingsFilledIcon: 'settings-fill',
  ResponsiveLayoutIcon: 'responsive_layout',
  ResponsiveLayoutFilledIcon: 'responsive_layout-fill',
  SmartphoneIcon: 'mobile',
  SmartphoneFilledIcon: 'mobile-fill',
  SpeedIcon: 'speed',
  SpeedFilledIcon: 'speed-fill',
  WorldIcon: 'language',

  // Communication
  CallIcon: 'call',
  CallFilledIcon: 'call-fill',
  ChatIcon: 'chat',
  ContactSupportIcon: 'contact_support',
  ContactSupportFilledIcon: 'contact_support-fill',
  MessageIcon: 'sms',
  MessageFilledIcon: 'sms-fill',
  NotificationsIcon: 'notifications',
  NotificationsFilledIcon: 'notifications-fill',
  SendIcon: 'send',
  SendFilledIcon: 'send-fill',

  // Security
  LockIcon: 'lock',
  LockFilledIcon: 'lock-fill',
  LockOpenIcon: 'lock_open',
  LockOpenFilledIcon: 'lock_open-fill',
  ShieldLockIcon: 'security',
  ShieldLockFilledIcon: 'security-fill',
  VerifiedUserIcon: 'verified_user',
  VerifiedUserFilledIcon: 'verified_user-fill',
  VisibilityIcon: 'visibility',
  VisibilityFilledIcon: 'visibility-fill',
  VisibilityOffIcon: 'visibility_off',
  VisibilityOffFilledIcon: 'visibility_off-fill',

  // Media & Creative
  CameraIcon: 'photo_camera',
  CameraFilledIcon: 'photo_camera-fill',
  ImageIcon: 'image',
  ImageFilledIcon: 'image-fill',
  PaletteIcon: 'palette',
  PaletteFilledIcon: 'palette-fill',

  // People
  GroupIcon: 'group',
  GroupFilledIcon: 'group-fill',
  PersonIcon: 'person',
  PersonAddFilledIcon: 'person_add-fill',

  // Files & Data
  FileIcon: 'description',
  FileCopyIcon: 'file_copy',
  FileCopyFilledIcon: 'file_copy-fill',
  FolderIcon: 'folder',
  FolderFilledIcon: 'folder-fill',

  // Places
  ApartmentIcon: 'apartment',
  BusinessCenterIcon: 'business_center',
  LocationOnIcon: 'location_on',
  LocationOnFilledIcon: 'location_on-fill',
  PlantIcon: 'eco',
  PlantFilledIcon: 'eco-fill',
  PublicFilledIcon: 'public-fill',
  PriceTagIcon: 'sell',
  PriceTagFilledIcon: 'sell-fill',

  // Theme & Weather
  SunnyIcon: 'sunny',
  SunnyFilledIcon: 'sunny-fill',
  DarkModeIcon: 'dark_mode',
  DarkModeFilledIcon: 'dark_mode-fill',

  // Food & Drink
  LunchDiningIcon: 'lunch_dining',
  LocalBarIcon: 'local_bar',
  IceCreamIcon: 'icecream',
};

function extractPath(svgContent: string): string {
  const match = svgContent.match(/<path\s+d="([^"]+)"/);
  if (!match || !match[1]) {
    throw new Error('Could not extract path data from SVG');
  }
  return match[1];
}

function generateComponent(name: string, pathD: string): string {
  return `import React from 'react';
import type { IconSize, IconColor } from '../types.js';
import { SIZE_MAP, SEMANTIC_ICON_COLORS } from '../types.js';
import '../Icon.css';

export interface ${name}Props extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color'> {
  /** Controls the size of the icon using design token sizes. Defaults to "md" (20px). */
  size?: IconSize;
  /** Applies a semantic color token (\`default\` | \`error\` | \`warning\` | \`success\` | \`info\`) via the akds-icon--{color} class. Any other CSS color value (hex, rgb(), a CSS variable, etc.) is applied as a custom color instead. Defaults to "default" (var(--akds-color-icon-neutral-default)). */
  color?: IconColor | React.CSSProperties['color'];
}

export const ${name} = React.forwardRef<SVGSVGElement, ${name}Props>(
  function ${name}({ size = 'md', color = 'default', className, style, ...props }, ref) {
    const px = SIZE_MAP[size];
    const isSemantic = (SEMANTIC_ICON_COLORS as readonly string[]).includes(color as string);
    const classes = [
      'akds-icon',
      isSemantic ? (color !== 'default' ? \`akds-icon--\${color}\` : null) : 'akds-icon--custom',
      className,
    ].filter(Boolean).join(' ');
    const mergedStyle = isSemantic
      ? style
      : ({ '--akds-icon-custom-color': color, ...style } as React.CSSProperties);
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width={px}
        height={px}
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className={classes}
        style={mergedStyle}
        {...props}
      >
        <path d="${pathD}" />
      </svg>
    );
  },
);

${name}.displayName = '${name}';
`;
}

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const exports: string[] = [];

for (const [name, symbolFile] of Object.entries(ICONS)) {
  const svgPath = join(SYMBOLS_DIR, `${symbolFile}.svg`);
  const svgContent = readFileSync(svgPath, 'utf-8');
  const pathD = extractPath(svgContent);
  const component = generateComponent(name, pathD);
  writeFileSync(join(OUT_DIR, `${name}.tsx`), component);
  exports.push(`export { ${name} } from './components/${name}.js';`);
  exports.push(`export type { ${name}Props } from './components/${name}.js';`);
  console.log(`✓ ${name}`);
}

const indexContent = `export type { IconSize, IconColor } from './types.js';\n` + exports.join('\n') + '\n';
writeFileSync(join(ROOT, 'src/index.ts'), indexContent);
console.log(`\n✓ src/index.ts written with ${Object.keys(ICONS).length} icons`);