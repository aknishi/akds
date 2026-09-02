import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const table: ComponentEntry = {
  slug: 'table',
  name: 'Basic Table',
  category: 'Data Display & Content',
  summary: 'A semantic HTML table for static or simple tabular data, composed from Thead, Tbody, Tfoot, Tr, Th, and Td.',
  sourcePath: 'packages/reactkit/src/components/Table',
  storybookId: 'reactkit-table-basic-table--docs',
  preview: (
    <Table>
      <Thead>
        <Tr>
          <Th scope="col">Name</Th>
          <Th scope="col">Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Widget</Td>
          <Td>Active</Td>
        </Tr>
      </Tbody>
    </Table>
  ),
  examples: [
    {
      title: 'Composed',
      description: 'Build a table from Thead, Tbody, Tr, Th, and Td — the same structure used throughout this site\'s own documentation tables.',
      render: () => (
        <Table>
          <Thead>
            <Tr>
              <Th scope="col">Prop</Th>
              <Th scope="col">Type</Th>
              <Th scope="col">Default</Th>
              <Th scope="col">Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td><code>variant</code></Td>
              <Td><code>'primary' | 'secondary'</code></Td>
              <Td><code>'primary'</code></Td>
              <Td>Controls the visual style of the component.</Td>
            </Tr>
            <Tr>
              <Td><code>disabled</code></Td>
              <Td><code>boolean</code></Td>
              <Td><code>false</code></Td>
              <Td>Prevents interaction and applies disabled styling.</Td>
            </Tr>
          </Tbody>
        </Table>
      ),
      code: `<Table>
  <Thead>
    <Tr>
      <Th scope="col">Prop</Th>
      <Th scope="col">Type</Th>
      <Th scope="col">Default</Th>
      <Th scope="col">Description</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td><code>variant</code></Td>
      <Td><code>'primary' | 'secondary'</code></Td>
      <Td><code>'primary'</code></Td>
      <Td>Controls the visual style of the component.</Td>
    </Tr>
    <Tr>
      <Td><code>disabled</code></Td>
      <Td><code>boolean</code></Td>
      <Td><code>false</code></Td>
      <Td>Prevents interaction and applies disabled styling.</Td>
    </Tr>
  </Tbody>
</Table>`,
    },
    {
      title: 'Alignment',
      description: 'align on Th/Td controls horizontal text alignment per column — useful for right-aligning numeric columns.',
      render: () => (
        <Table>
          <Thead>
            <Tr>
              <Th scope="col">Item</Th>
              <Th scope="col" align="center">In Stock</Th>
              <Th scope="col" align="right">Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Widget</Td>
              <Td align="center">Yes</Td>
              <Td align="right">$9.00</Td>
            </Tr>
            <Tr>
              <Td>Gadget</Td>
              <Td align="center">No</Td>
              <Td align="right">$24.00</Td>
            </Tr>
          </Tbody>
        </Table>
      ),
      code: `<Table>
  <Thead>
    <Tr>
      <Th scope="col">Item</Th>
      <Th scope="col" align="center">In Stock</Th>
      <Th scope="col" align="right">Price</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>Widget</Td>
      <Td align="center">Yes</Td>
      <Td align="right">$9.00</Td>
    </Tr>
    <Tr>
      <Td>Gadget</Td>
      <Td align="center">No</Td>
      <Td align="right">$24.00</Td>
    </Tr>
  </Tbody>
</Table>`,
    },
    {
      title: 'Resizable columns',
      description: 'resizable on Th adds a draggable, keyboard-operable handle on the column\'s trailing edge. Use defaultWidth for an uncontrolled starting width, or width + onWidthChange to control it.',
      render: () => (
        <Table>
          <Thead>
            <Tr>
              <Th scope="col" resizable defaultWidth={160}>Prop</Th>
              <Th scope="col" resizable defaultWidth={220}>Type</Th>
              <Th scope="col">Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td><code>variant</code></Td>
              <Td><code>'primary' | 'secondary'</code></Td>
              <Td>Controls the visual style of the component.</Td>
            </Tr>
          </Tbody>
        </Table>
      ),
      code: `<Table>
  <Thead>
    <Tr>
      <Th scope="col" resizable defaultWidth={160}>Prop</Th>
      <Th scope="col" resizable defaultWidth={220}>Type</Th>
      <Th scope="col">Description</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td><code>variant</code></Td>
      <Td><code>'primary' | 'secondary'</code></Td>
      <Td>Controls the visual style of the component.</Td>
    </Tr>
  </Tbody>
</Table>`,
    },
    {
      title: 'Striped rows',
      description: 'striped on Tbody applies alternating row backgrounds. Off by default.',
      render: () => (
        <Table>
          <Thead>
            <Tr>
              <Th scope="col">Prop</Th>
              <Th scope="col">Type</Th>
            </Tr>
          </Thead>
          <Tbody striped>
            <Tr>
              <Td><code>variant</code></Td>
              <Td><code>'primary' | 'secondary'</code></Td>
            </Tr>
            <Tr>
              <Td><code>disabled</code></Td>
              <Td><code>boolean</code></Td>
            </Tr>
            <Tr>
              <Td><code>size</code></Td>
              <Td><code>'sm' | 'md' | 'lg'</code></Td>
            </Tr>
          </Tbody>
        </Table>
      ),
      code: `<Table>
  <Thead>
    <Tr>
      <Th scope="col">Prop</Th>
      <Th scope="col">Type</Th>
    </Tr>
  </Thead>
  <Tbody striped>
    <Tr>
      <Td><code>variant</code></Td>
      <Td><code>'primary' | 'secondary'</code></Td>
    </Tr>
    <Tr>
      <Td><code>disabled</code></Td>
      <Td><code>boolean</code></Td>
    </Tr>
    <Tr>
      <Td><code>size</code></Td>
      <Td><code>'sm' | 'md' | 'lg'</code></Td>
    </Tr>
  </Tbody>
</Table>`,
    },
    {
      title: 'With footer',
      description: 'Tfoot renders a summary row, set apart from Tbody by a top divider instead of a filled background.',
      render: () => (
        <Table>
          <Thead>
            <Tr>
              <Th scope="col">Item</Th>
              <Th scope="col" align="right">Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Widget</Td>
              <Td align="right">$9.00</Td>
            </Tr>
            <Tr>
              <Td>Gadget</Td>
              <Td align="right">$24.00</Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th scope="row">Total</Th>
              <Td align="right">$33.00</Td>
            </Tr>
          </Tfoot>
        </Table>
      ),
      code: `<Table>
  <Thead>
    <Tr>
      <Th scope="col">Item</Th>
      <Th scope="col" align="right">Price</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>Widget</Td>
      <Td align="right">$9.00</Td>
    </Tr>
    <Tr>
      <Td>Gadget</Td>
      <Td align="right">$24.00</Td>
    </Tr>
  </Tbody>
  <Tfoot>
    <Tr>
      <Th scope="row">Total</Th>
      <Td align="right">$33.00</Td>
    </Tr>
  </Tfoot>
</Table>`,
    },
  ],
  accessibilityNotes: [
    'Table, Thead, Tbody, Tfoot, Tr, Th, and Td render their real semantic HTML elements — always pass scope="col" on column headers and scope="row" on row headers (e.g. a Tfoot label cell) so screen readers can associate cells correctly.',
    'The resize handle rendered by Th\'s resizable prop is a focusable role="separator" with aria-orientation="vertical" and aria-valuenow/aria-valuemin — it can be dragged with a pointer or resized with the Left/Right arrow keys once focused.',
  ],
  props: [
    { name: 'wrapperClassName', type: 'string', description: 'className applied to the outer scroll wrapper element, separate from className on the table itself.' },
    { name: 'children', type: 'React.ReactNode', description: 'Typically Thead, Tbody, and/or Tfoot. Required.' },
  ],
  doDont: [
    { do: 'Use Basic Table for static or simple tabular data — a props table, a summary list, a small dataset.', dont: "Don't reach for sorting, filtering, or pagination here — those are planned for a separate future Datagrid package built on TanStack Table." },
  ],
  related: ['card', 'text'],
};
