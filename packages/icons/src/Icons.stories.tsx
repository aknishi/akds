import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowBackIcon } from './components/ArrowBackIcon';
import { LiveEditStory } from './LiveEditStory';
import * as Icons from './index';
import type { IconSize } from './types';
import { Text, TextInput } from '@aknishi/akds-reactkit';

const meta: Meta<typeof ArrowBackIcon> = {
  title: 'Icons/Overview',
  component: ArrowBackIcon,
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
};

export default meta;

type Story = StoryObj<typeof ArrowBackIcon>;
type IconEntry = { name: string; Component: React.ComponentType<{ size?: IconSize }>; tags?: string[] };

const GROUPS: { category: string; icons: IconEntry[] }[] = [
  {
    category: 'Status',
    icons: [
      { name: 'CheckIcon', Component: Icons.CheckIcon, tags: ['tick', 'done', 'complete', 'success', 'checkmark'] },
      { name: 'CheckCircleIcon', Component: Icons.CheckCircleIcon, tags: ['tick', 'done', 'complete', 'success', 'checkmark'] },
      { name: 'CheckCircleFilledIcon', Component: Icons.CheckCircleFilledIcon, tags: ['tick', 'done', 'complete', 'success', 'checkmark'] },
      { name: 'ErrorIcon', Component: Icons.ErrorIcon, tags: ['alert', 'danger', 'exclamation', 'problem', 'issue'] },
      { name: 'ErrorFilledIcon', Component: Icons.ErrorFilledIcon, tags: ['alert', 'danger', 'exclamation', 'problem', 'issue'] },
      { name: 'WarningIcon', Component: Icons.WarningIcon, tags: ['alert', 'caution', 'triangle', 'exclamation'] },
      { name: 'WarningFilledIcon', Component: Icons.WarningFilledIcon, tags: ['alert', 'caution', 'triangle', 'exclamation'] },
      { name: 'InfoIcon', Component: Icons.InfoIcon, tags: ['information', 'help', 'hint', 'tooltip'] },
      { name: 'InfoFilledIcon', Component: Icons.InfoFilledIcon, tags: ['information', 'help', 'hint', 'tooltip'] },
    ],
  },
  {
    category: 'Rating & Social',
    icons: [
      { name: 'StarIcon', Component: Icons.StarIcon, tags: ['rating', 'bookmark', 'favourite', 'review'] },
      { name: 'StarFilledIcon', Component: Icons.StarFilledIcon, tags: ['rating', 'bookmark', 'favourite', 'review'] },
      { name: 'StarHalfIcon', Component: Icons.StarHalfIcon, tags: ['rating', 'half', 'review'] },
      { name: 'FavoriteIcon', Component: Icons.FavoriteIcon, tags: ['heart', 'like', 'love', 'favourite', 'wish'] },
      { name: 'FavoriteFilledIcon', Component: Icons.FavoriteFilledIcon, tags: ['heart', 'like', 'love', 'favourite', 'wish'] },
      { name: 'ThumbsUpIcon', Component: Icons.ThumbsUpIcon, tags: ['like', 'approve', 'upvote', 'good'] },
      { name: 'ThumbsUpFilledIcon', Component: Icons.ThumbsUpFilledIcon, tags: ['like', 'approve', 'upvote', 'good'] },
    ],
  },
  {
    category: 'Arrows & Chevrons',
    icons: [
      { name: 'ArrowBackIcon', Component: Icons.ArrowBackIcon, tags: ['left', 'previous', 'return', 'navigate'] },
      { name: 'ArrowForwardIcon', Component: Icons.ArrowForwardIcon, tags: ['right', 'next', 'navigate'] },
      { name: 'ArrowUpIcon', Component: Icons.ArrowUpIcon, tags: ['up', 'navigate', 'scroll'] },
      { name: 'ArrowDownIcon', Component: Icons.ArrowDownIcon, tags: ['down', 'navigate', 'scroll'] },
      { name: 'ChevronLeftIcon', Component: Icons.ChevronLeftIcon, tags: ['left', 'previous', 'navigate', 'caret'] },
      { name: 'ChevronRightIcon', Component: Icons.ChevronRightIcon, tags: ['right', 'next', 'navigate', 'caret'] },
      { name: 'ChevronUpIcon', Component: Icons.ChevronUpIcon, tags: ['up', 'collapse', 'navigate', 'caret'] },
      { name: 'ChevronDownIcon', Component: Icons.ChevronDownIcon, tags: ['down', 'expand', 'dropdown', 'navigate', 'caret'] },
    ],
  },
  {
    category: 'Actions',
    icons: [
      { name: 'AddIcon', Component: Icons.AddIcon, tags: ['plus', 'create', 'new', 'insert'] },
      { name: 'BlockIcon', Component: Icons.BlockIcon, tags: ['ban', 'forbidden', 'disable', 'stop', 'prohibit'] },
      { name: 'CancelIcon', Component: Icons.CancelIcon, tags: ['close', 'remove', 'clear', 'x', 'dismiss'] },
      { name: 'CancelFilledIcon', Component: Icons.CancelFilledIcon, tags: ['close', 'remove', 'clear', 'x', 'dismiss'] },
      { name: 'CloseIcon', Component: Icons.CloseIcon, tags: ['x', 'dismiss', 'remove', 'cancel'] },
      { name: 'CopyIcon', Component: Icons.CopyIcon, tags: ['duplicate', 'clipboard', 'paste'] },
      { name: 'CopyFilledIcon', Component: Icons.CopyFilledIcon, tags: ['duplicate', 'clipboard', 'paste'] },
      { name: 'DeleteIcon', Component: Icons.DeleteIcon, tags: ['trash', 'bin', 'remove', 'garbage'] },
      { name: 'DragPanIcon', Component: Icons.DragPanIcon, tags: ['drag', 'pan', 'move', 'hand', 'grab'] },
      { name: 'EditIcon', Component: Icons.EditIcon, tags: ['pencil', 'write', 'modify', 'update', 'pen'] },
      { name: 'EditFilledIcon', Component: Icons.EditFilledIcon, tags: ['pencil', 'write', 'modify', 'update', 'pen'] },
      { name: 'FilterIcon', Component: Icons.FilterIcon, tags: ['funnel', 'sort', 'refine'] },
      { name: 'FilterFilledIcon', Component: Icons.FilterFilledIcon, tags: ['funnel', 'sort', 'refine'] },
      { name: 'FlashIcon', Component: Icons.FlashIcon, tags: ['bolt', 'lightning', 'electric', 'power', 'energy', 'quick'] },
      { name: 'FlashFilledIcon', Component: Icons.FlashFilledIcon, tags: ['bolt', 'lightning', 'electric', 'power', 'energy', 'quick'] },
      { name: 'MoveIcon', Component: Icons.MoveIcon, tags: ['pan', 'drag', 'reposition', 'arrows'] },
      { name: 'OpenInFullIcon', Component: Icons.OpenInFullIcon, tags: ['expand', 'fullscreen', 'maximise', 'enlarge'] },
      { name: 'OpenInNewIcon', Component: Icons.OpenInNewIcon, tags: ['external', 'link', 'tab', 'launch'] },
      { name: 'PrintIcon', Component: Icons.PrintIcon, tags: ['printer', 'document', 'paper'] },
      { name: 'PrintFilledIcon', Component: Icons.PrintFilledIcon, tags: ['printer', 'document', 'paper'] },
      { name: 'RedoIcon', Component: Icons.RedoIcon, tags: ['repeat', 'forward', 'history'] },
      { name: 'RefreshIcon', Component: Icons.RefreshIcon, tags: ['reload', 'sync', 'update', 'rotate'] },
      { name: 'RestartIcon', Component: Icons.RestartIcon, tags: ['reset', 'reload', 'reboot'] },
      { name: 'SaveIcon', Component: Icons.SaveIcon, tags: ['floppy', 'disk', 'store', 'persist'] },
      { name: 'SaveFilledIcon', Component: Icons.SaveFilledIcon, tags: ['floppy', 'disk', 'store', 'persist'] },
      { name: 'ScheduleIcon', Component: Icons.ScheduleIcon, tags: ['clock', 'time', 'timer', 'calendar', 'deadline'] },
      { name: 'SearchIcon', Component: Icons.SearchIcon, tags: ['find', 'magnify', 'lookup', 'magnifying glass'] },
      { name: 'UndoIcon', Component: Icons.UndoIcon, tags: ['back', 'revert', 'history'] },
      { name: 'UploadIcon', Component: Icons.UploadIcon, tags: ['import', 'attach', 'cloud', 'share'] },
      { name: 'ZoomInIcon', Component: Icons.ZoomInIcon, tags: ['magnify', 'enlarge', 'scale up'] },
      { name: 'ZoomOutIcon', Component: Icons.ZoomOutIcon, tags: ['shrink', 'scale down', 'reduce'] },
    ],
  },
  {
    category: 'Navigation & UI',
    icons: [
      { name: 'AppsIcon', Component: Icons.AppsIcon, tags: ['grid', 'tiles', 'launcher', 'menu'] },
      { name: 'CalendarMonthIcon', Component: Icons.CalendarMonthIcon, tags: ['date', 'month', 'event', 'agenda', 'schedule'] },
      { name: 'DashboardIcon', Component: Icons.DashboardIcon, tags: ['overview', 'widgets', 'panel', 'home'] },
      { name: 'DashboardFilledIcon', Component: Icons.DashboardFilledIcon, tags: ['overview', 'widgets', 'panel', 'home'] },
      { name: 'GridViewIcon', Component: Icons.GridViewIcon, tags: ['tiles', 'layout', 'gallery', 'mosaic'] },
      { name: 'GridViewFilledIcon', Component: Icons.GridViewFilledIcon, tags: ['tiles', 'layout', 'gallery', 'mosaic'] },
      { name: 'HomeIcon', Component: Icons.HomeIcon, tags: ['house', 'main', 'start', 'landing'] },
      { name: 'MoreVertIcon', Component: Icons.MoreVertIcon, tags: ['overflow', 'kebab', 'dots', 'options', 'menu', 'ellipsis'] },
      { name: 'SettingsIcon', Component: Icons.SettingsIcon, tags: ['gear', 'cog', 'preferences', 'configure', 'options'] },
      { name: 'SettingsFilledIcon', Component: Icons.SettingsFilledIcon, tags: ['gear', 'cog', 'preferences', 'configure', 'options'] },
      { name: 'SmartphoneIcon', Component: Icons.SmartphoneIcon, tags: ['mobile', 'phone', 'device', 'cell'] },
      { name: 'SmartphoneFilledIcon', Component: Icons.SmartphoneFilledIcon, tags: ['mobile', 'phone', 'device', 'cell'] },
      { name: 'SpeedIcon', Component: Icons.SpeedIcon, tags: ['gauge', 'performance', 'velocity', 'fast'] },
      { name: 'SpeedFilledIcon', Component: Icons.SpeedFilledIcon, tags: ['gauge', 'performance', 'velocity', 'fast'] },
      { name: 'WorldIcon', Component: Icons.WorldIcon, tags: ['globe', 'earth', 'international', 'global', 'public', 'language', 'internet'] },
    ],
  },
  {
    category: 'Communication',
    icons: [
      { name: 'CallIcon', Component: Icons.CallIcon, tags: ['phone', 'telephone', 'ring', 'dial'] },
      { name: 'CallFilledIcon', Component: Icons.CallFilledIcon, tags: ['phone', 'telephone', 'ring', 'dial'] },
      { name: 'ChatIcon', Component: Icons.ChatIcon, tags: ['message', 'bubble', 'talk', 'conversation', 'comment'] },
      { name: 'ContactSupportIcon', Component: Icons.ContactSupportIcon, tags: ['help', 'headset', 'question', 'agent', 'support'] },
      { name: 'ContactSupportFilledIcon', Component: Icons.ContactSupportFilledIcon, tags: ['help', 'headset', 'question', 'agent', 'support'] },
      { name: 'MessageIcon', Component: Icons.MessageIcon, tags: ['sms', 'text', 'bubble', 'chat', 'inbox'] },
      { name: 'MessageFilledIcon', Component: Icons.MessageFilledIcon, tags: ['sms', 'text', 'bubble', 'chat', 'inbox'] },
      { name: 'NotificationsIcon', Component: Icons.NotificationsIcon, tags: ['bell', 'alert', 'remind', 'ring'] },
      { name: 'NotificationsFilledIcon', Component: Icons.NotificationsFilledIcon, tags: ['bell', 'alert', 'remind', 'ring'] },
      { name: 'SendIcon', Component: Icons.SendIcon, tags: ['submit', 'paper plane', 'email', 'share'] },
      { name: 'SendFilledIcon', Component: Icons.SendFilledIcon, tags: ['submit', 'paper plane', 'email', 'share'] },
    ],
  },
  {
    category: 'Security',
    icons: [
      { name: 'LockIcon', Component: Icons.LockIcon, tags: ['padlock', 'secure', 'private', 'closed'] },
      { name: 'LockFilledIcon', Component: Icons.LockFilledIcon, tags: ['padlock', 'secure', 'private', 'closed'] },
      { name: 'LockOpenIcon', Component: Icons.LockOpenIcon, tags: ['padlock', 'unlocked', 'open', 'accessible'] },
      { name: 'LockOpenFilledIcon', Component: Icons.LockOpenFilledIcon, tags: ['padlock', 'unlocked', 'open', 'accessible'] },
      { name: 'ShieldLockIcon', Component: Icons.ShieldLockIcon, tags: ['protect', 'safe', 'shield', 'guard', 'privacy'] },
      { name: 'ShieldLockFilledIcon', Component: Icons.ShieldLockFilledIcon, tags: ['protect', 'safe', 'shield', 'guard', 'privacy'] },
      { name: 'VerifiedUserIcon', Component: Icons.VerifiedUserIcon, tags: ['badge', 'trusted', 'certified', 'tick', 'confirmed'] },
      { name: 'VerifiedUserFilledIcon', Component: Icons.VerifiedUserFilledIcon, tags: ['badge', 'trusted', 'certified', 'tick', 'confirmed'] },
      { name: 'VisibilityIcon', Component: Icons.VisibilityIcon, tags: ['eye', 'show', 'view', 'password', 'preview'] },
      { name: 'VisibilityFilledIcon', Component: Icons.VisibilityFilledIcon, tags: ['eye', 'show', 'view', 'password', 'preview'] },
      { name: 'VisibilityOffIcon', Component: Icons.VisibilityOffIcon, tags: ['eye', 'hide', 'hidden', 'password', 'masked'] },
      { name: 'VisibilityOffFilledIcon', Component: Icons.VisibilityOffFilledIcon, tags: ['eye', 'hide', 'hidden', 'password', 'masked'] },
    ],
  },
  {
    category: 'Media & Creative',
    icons: [
      { name: 'CameraIcon', Component: Icons.CameraIcon, tags: ['photo', 'picture', 'snapshot', 'photograph'] },
      { name: 'CameraFilledIcon', Component: Icons.CameraFilledIcon, tags: ['photo', 'picture', 'snapshot', 'photograph'] },
      { name: 'ImageIcon', Component: Icons.ImageIcon, tags: ['photo', 'picture', 'landscape', 'gallery'] },
      { name: 'ImageFilledIcon', Component: Icons.ImageFilledIcon, tags: ['photo', 'picture', 'landscape', 'gallery'] },
      { name: 'PaletteIcon', Component: Icons.PaletteIcon, tags: ['color', 'colour', 'paint', 'art', 'design', 'theme'] },
      { name: 'PaletteFilledIcon', Component: Icons.PaletteFilledIcon, tags: ['color', 'colour', 'paint', 'art', 'design', 'theme'] },
    ],
  },
  {
    category: 'People',
    icons: [
      { name: 'GroupIcon', Component: Icons.GroupIcon, tags: ['team', 'users', 'members', 'people', 'crowd'] },
      { name: 'GroupFilledIcon', Component: Icons.GroupFilledIcon, tags: ['team', 'users', 'members', 'people', 'crowd'] },
      { name: 'PersonIcon', Component: Icons.PersonIcon, tags: ['user', 'account', 'profile', 'avatar', 'human'] },
      { name: 'PersonAddFilledIcon', Component: Icons.PersonAddFilledIcon, tags: ['user', 'account', 'invite', 'add', 'new member'] },
    ],
  },
  {
    category: 'Files & Data',
    icons: [
      { name: 'FileIcon', Component: Icons.FileIcon, tags: ['document', 'doc', 'page', 'text', 'paper'] },
      { name: 'FileCopyIcon', Component: Icons.FileCopyIcon, tags: ['document', 'duplicate', 'clone', 'copy'] },
      { name: 'FileCopyFilledIcon', Component: Icons.FileCopyFilledIcon, tags: ['document', 'duplicate', 'clone', 'copy'] },
      { name: 'FolderIcon', Component: Icons.FolderIcon, tags: ['directory', 'files', 'storage', 'organise'] },
      { name: 'FolderFilledIcon', Component: Icons.FolderFilledIcon, tags: ['directory', 'files', 'storage', 'organise'] },
    ],
  },
  {
    category: 'Places',
    icons: [
      { name: 'ApartmentIcon', Component: Icons.ApartmentIcon, tags: ['building', 'office', 'complex', 'block', 'residential'] },
      { name: 'BusinessCenterIcon', Component: Icons.BusinessCenterIcon, tags: ['briefcase', 'work', 'job', 'portfolio', 'career'] },
      { name: 'LocationOnIcon', Component: Icons.LocationOnIcon, tags: ['pin', 'map', 'place', 'address', 'marker', 'gps'] },
      { name: 'LocationOnFilledIcon', Component: Icons.LocationOnFilledIcon, tags: ['pin', 'map', 'place', 'address', 'marker', 'gps'] },
      { name: 'PlantIcon', Component: Icons.PlantIcon, tags: ['leaf', 'nature', 'eco', 'green', 'tree', 'environment'] },
      { name: 'PlantFilledIcon', Component: Icons.PlantFilledIcon, tags: ['leaf', 'nature', 'eco', 'green', 'tree', 'environment'] },
      { name: 'PublicFilledIcon', Component: Icons.PublicFilledIcon, tags: ['globe', 'earth', 'world', 'internet', 'web', 'global'] },
      { name: 'PriceTagIcon', Component: Icons.PriceTagIcon, tags: ['label', 'price', 'cost', 'sell', 'shop', 'tag'] },
      { name: 'PriceTagFilledIcon', Component: Icons.PriceTagFilledIcon, tags: ['label', 'price', 'cost', 'sell', 'shop', 'tag'] },
    ],
  },
];

const cellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 8px',
  borderRadius: '8px',
  border: '1px solid var(--akds-color-border-default-default)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--akds-color-text-secondary-default)',
  textAlign: 'center',
  fontFamily: 'monospace',
  wordBreak: 'break-all',
};

export const AllIcons: Story = {
  name: 'All Icons',
  render: () => {
    const [query, setQuery] = React.useState('');
    const q = query.toLowerCase();

    const filtered = GROUPS.map(g => ({
      ...g,
      icons: g.icons.filter(({ name, tags }) =>
        name.toLowerCase().includes(q) || tags?.some(t => t.includes(q))
      ),
    })).filter(g => g.icons.length > 0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <TextInput
          startAdornment={<Icons.SearchIcon />}
          value={query}
          onChange={e => setQuery(e.target.value)}
          label='Search icons'
          helperText={`${filtered.reduce((sum, g) => sum + g.icons.length, 0)} icons`}
        />
        {filtered.length === 0 && (
          <Text>
            No icons match "{query}"
          </Text>
        )}
        {filtered.map(({ category, icons }) => (
          <div key={category}>
            <Text style={{ marginBottom: '8px' }}>
              {category}
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
              {icons.map(({ name, Component }) => (
                <div key={name} style={cellStyle}>
                  <Component size="lg" />
                  <Text styleAs="label">{name.replace(/Icon$/, '')}</Text>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const Sizes = LiveEditStory({
  component: ArrowBackIcon,
  code: `import { HomeIcon, SettingsIcon, DeleteIcon, CheckIcon, CloseIcon } from '@aknishi/akds-icons';

const Example = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
      <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--akds-color-text-secondary-default)', width: '24px', flexShrink: 0 }}>
          {size}
        </span>
        <HomeIcon size={size} />
        <SettingsIcon size={size} />
        <DeleteIcon size={size} />
        <CheckIcon size={size} />
        <CloseIcon size={size} />
      </div>
    ))}
  </div>
);

export default Example;
`,
});

export const SemanticColors = LiveEditStory({
  component: ArrowBackIcon,
  code: `import { 
InfoFilledIcon, 
ErrorFilledIcon, 
WarningFilledIcon, 
ErrorIcon, 
WarningIcon, 
CheckIcon,
CheckCircleFilledIcon,
HomeIcon, 
PersonIcon, 
ArrowForwardIcon,
} from '@aknishi/akds-icons';

import { Text, Flexbox } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox direction="row" gap="md">
    <Flexbox direction="column" gap="md">
      <Text>default</Text>
      <Text>info</Text>
      <Text>success</Text>
      <Text>error</Text>
      <Text>warning</Text>
    </Flexbox>
    <Flexbox direction="column" gap="">
      <Flexbox direction="row" gap="md">
        <HomeIcon size="lg" color="default" />
        <PersonIcon size="lg" color="default" />
      </Flexbox>
      <Flexbox direction="row" gap="md">
        <InfoFilledIcon size="lg" color="info" />
        <ArrowForwardIcon size="lg" color="info" />
      </Flexbox>
      <Flexbox direction="row" gap="md">
        <CheckIcon size="lg" color="success" />
        <CheckCircleFilledIcon size="lg" color="success" />
      </Flexbox>
      <Flexbox direction="row" gap="md">
        <ErrorFilledIcon size="lg" color="error" /> 
        <ErrorIcon size="lg" color="error" />
      </Flexbox>
      <Flexbox direction="row" gap="md">
        <WarningFilledIcon size="lg" color="warning" />
        <WarningIcon size="lg" color="warning" />
      </Flexbox>
    </Flexbox>
  </Flexbox>
);

export default Example;
`,
});
