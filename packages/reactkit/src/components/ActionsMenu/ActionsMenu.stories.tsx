import type { Meta } from '@storybook/react-vite';
import { ActionsMenu } from './ActionsMenu';
import { MenuItem } from '../MenuItem';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof ActionsMenu> = {
  title: 'Reactkit/ActionsMenu',
  component: ActionsMenu,
  subcomponents: { MenuItem },
  argTypes: {
    placement: { control: 'select', options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'] },
    disabled: { control: 'boolean' },
    focusableWhenDisabled: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: ActionsMenu,
  code: `import { ActionsMenu, MenuItem, Flexbox } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox justify="center" style={{ height: '200px' }}>
    <ActionsMenu label="Actions for Hanako Sato">
      <MenuItem onClick={() => console.log('view')}>View details</MenuItem>
      <MenuItem onClick={() => console.log('cancel')}>Cancel order</MenuItem>
      <MenuItem disabled>Refund</MenuItem>
    </ActionsMenu>
  </Flexbox>
);

export default Example;
`,
});

export const Disabled = LiveEditStory({
  component: ActionsMenu,
  code: `import { ActionsMenu, MenuItem, Flexbox, Text } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox direction="column" gap="md">
    <Flexbox align="center" gap="sm">
      <ActionsMenu label="Bulk actions, select rows to enable" disabled focusableWhenDisabled>
        <MenuItem>Export</MenuItem>
      </ActionsMenu>
      <Text styleAs="caption">Disabled, still focusable</Text>
    </Flexbox>
    <Flexbox align="center" gap="sm">
      <ActionsMenu label="Actions" disabled>
        <MenuItem>Export</MenuItem>
      </ActionsMenu>
      <Text styleAs="caption">Disabled, removed from the tab order</Text>
    </Flexbox>
  </Flexbox>
);

export default Example;
`,
});

export const CustomTrigger = LiveEditStory({
  component: ActionsMenu,
  code: `import { ActionsMenu, MenuItem, Button, Flexbox } from '@aknishi/akds-reactkit';
import { KeyboardArrowDownIcon } from '@aknishi/akds-icons';

const Example = () => (
  <Flexbox justify="center" style={{ height: '200px' }}>
    <ActionsMenu
      trigger={(
        <Button size="sm" appearance="bordered">
          Bulk actions
          <KeyboardArrowDownIcon size="sm" aria-hidden="true" />
        </Button>
      )}
    >
      <MenuItem onClick={() => console.log('export')}>Export</MenuItem>
      <MenuItem onClick={() => console.log('copy')}>Copy</MenuItem>
    </ActionsMenu>
  </Flexbox>
);

export default Example;
`,
});

export const InTableRow = LiveEditStory({
  component: ActionsMenu,
  code: `import { ActionsMenu, MenuItem, Table, Thead, Tbody, Tr, Th, Td, VisuallyHidden } from '@aknishi/akds-reactkit';

const orders = [
  { id: 'ORD-1024', customer: 'Hanako Sato' },
  { id: 'ORD-1025', customer: 'Kenji Ito' },
  { id: 'ORD-1026', customer: 'Maria Garcia' },
];

const Example = () => (
  <Table>
    <Thead>
      <Tr>
        <Th scope="col">Order</Th>
        <Th scope="col">Customer</Th>
        <Th scope="col" align="right"><VisuallyHidden>Actions</VisuallyHidden></Th>
      </Tr>
    </Thead>
    <Tbody>
      {orders.map((order) => (
        <Tr key={order.id}>
          <Td>{order.id}</Td>
          <Td>{order.customer}</Td>
          <Td align="right">
            <ActionsMenu label={\`Actions for \${order.customer}\`}>
              <MenuItem onClick={() => console.log('view', order.id)}>View details</MenuItem>
              <MenuItem onClick={() => console.log('cancel', order.id)}>Cancel order</MenuItem>
            </ActionsMenu>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

export default Example;
`,
});
