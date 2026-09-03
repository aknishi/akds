import type { Meta } from '@storybook/react-vite';
import { Table } from './Table';
import { Thead } from '../Thead';
import { Tbody } from '../Tbody';
import { Tfoot } from '../Tfoot';
import { Tr } from '../Tr';
import { Th } from '../Th';
import { Td } from '../Td';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Table> = {
  title: 'Reactkit/Table/Basic Table',
  component: Table,
  subcomponents: { Thead, Tbody, Tfoot, Tr, Th, Td },
};

export default meta;

export const Default = LiveEditStory({
  component: Table,
  code: `import { Table, Thead, Tbody, Tr, Th, Td } from '@aknishi/akds-reactkit';

const Example = () => (
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
);

export default Example;
`,
});

export const Alignment = LiveEditStory({
  component: Table,
  code: `import { Table, Thead, Tbody, Tr, Th, Td } from '@aknishi/akds-reactkit';

const Example = () => (
  <Table>
    <Thead>
      <Tr>
        <Th scope="col">Item</Th>
        <Th scope="col" align="center">In Stock</Th>
        <Th scope="col" align="right">Quantity</Th>
        <Th scope="col" align="right">Price</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>Widget</Td>
        <Td align="center">Yes</Td>
        <Td align="right">3</Td>
        <Td align="right">$9.00</Td>
      </Tr>
      <Tr>
        <Td>Gadget</Td>
        <Td align="center">No</Td>
        <Td align="right">1</Td>
        <Td align="right">$24.00</Td>
      </Tr>
    </Tbody>
  </Table>
);

export default Example;
`,
});

export const ResizableColumns = LiveEditStory({
  component: Table,
  code: `import { Table, Thead, Tbody, Tr, Th, Td } from '@aknishi/akds-reactkit';

const Example = () => (
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
      <Tr>
        <Td><code>disabled</code></Td>
        <Td><code>boolean</code></Td>
        <Td>Prevents interaction and applies disabled styling.</Td>
      </Tr>
    </Tbody>
  </Table>
);

export default Example;
`,
});

export const ResizableColumnsControlled = LiveEditStory({
  component: Table,
  code: `import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Text } from '@aknishi/akds-reactkit';

const Example = () => {
  const [propWidth, setPropWidth] = React.useState(160);

  return (
    <>
      <Text>Prop column width: {Math.round(propWidth)}px</Text>
      <Table>
        <Thead>
          <Tr>
            <Th scope="col" resizable width={propWidth} onWidthChange={setPropWidth}>Prop</Th>
            <Th scope="col">Type</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td><code>variant</code></Td>
            <Td><code>'primary' | 'secondary'</code></Td>
          </Tr>
          <Tr>
            <Td><code>disabled</code></Td>
            <Td><code>boolean</code></Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  );
};

export default Example;
`,
});

export const Striped = LiveEditStory({
  component: Table,
  code: `import { Table, Thead, Tbody, Tr, Th, Td } from '@aknishi/akds-reactkit';

const Example = () => (
  <Table>
    <Thead>
      <Tr>
        <Th scope="col">Prop</Th>
        <Th scope="col">Type</Th>
        <Th scope="col">Default</Th>
      </Tr>
    </Thead>
    <Tbody striped>
      <Tr>
        <Td><code>variant</code></Td>
        <Td><code>'primary' | 'secondary'</code></Td>
        <Td><code>'primary'</code></Td>
      </Tr>
      <Tr>
        <Td><code>disabled</code></Td>
        <Td><code>boolean</code></Td>
        <Td><code>false</code></Td>
      </Tr>
      <Tr>
        <Td><code>size</code></Td>
        <Td><code>'sm' | 'md' | 'lg'</code></Td>
        <Td><code>'md'</code></Td>
      </Tr>
    </Tbody>
  </Table>
);

export default Example;
`,
});

export const WithFooter = LiveEditStory({
  component: Table,
  code: `import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from '@aknishi/akds-reactkit';

const Example = () => (
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
);

export default Example;
`,
});
