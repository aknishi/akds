import type { Meta } from '@storybook/react-vite';
import { TableViewRowClick } from './TableViewRowClick';
import tableSource from './TableViewRowClick.tsx?raw';
import cardSource from './CardViewCardClick.tsx?raw';
import customButtonSource from './RowClickCustomButton.tsx?raw';
import { LiveEditStory, exampleCode } from './LiveEditStory';

const meta: Meta<typeof TableViewRowClick> = {
  title: 'Dataview/Row Click',
  component: TableViewRowClick,
};

export default meta;

export const TableViewWithRowClick = LiveEditStory({ code: exampleCode(tableSource, 'TableViewRowClick') });

export const CardViewWithCardClick = LiveEditStory({ code: exampleCode(cardSource, 'CardViewCardClick') });

export const CustomButton = LiveEditStory({ code: exampleCode(customButtonSource, 'RowClickCustomButton') });
