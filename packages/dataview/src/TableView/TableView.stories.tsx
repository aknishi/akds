import type { Meta } from '@storybook/react-vite';
import { TableView } from './TableView';
import defaultSource from '../demo/TableViewDefault.tsx?raw';
import withSelectionSource from '../demo/TableViewWithSelection.tsx?raw';
import pinnedColumnsSource from '../demo/TableViewPinnedColumns.tsx?raw';
import { LiveEditStory, exampleCode } from '../demo/LiveEditStory';

const meta: Meta<typeof TableView> = {
  title: 'Dataview/TableView',
  component: TableView,
};

export default meta;

export const Default = LiveEditStory({ code: exampleCode(defaultSource, 'TableViewDefault') });

export const WithSelection = LiveEditStory({ code: exampleCode(withSelectionSource, 'TableViewWithSelection') });

export const PinnedColumns = LiveEditStory({ code: exampleCode(pinnedColumnsSource, 'TableViewPinnedColumns') });
