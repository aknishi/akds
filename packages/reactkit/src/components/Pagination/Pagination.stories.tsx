import type { Meta } from '@storybook/react-vite';
import { Pagination } from './Pagination';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Pagination> = {
  title: 'Reactkit/Pagination',
  component: Pagination,
  argTypes: {
    count: { control: 'number' },
    page: { control: 'number' },
    defaultPage: { control: 'number' },
    siblingCount: { control: 'number' },
    disabled: { control: 'boolean' },
    previousLabel: { control: 'text' },
    nextLabel: { control: 'text' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Pagination,
  code: `import { Pagination } from '@aknishi/akds-reactkit';

const PaginationExample = () => <Pagination count={5} />;

export default PaginationExample;
`,
});

export const Truncation = LiveEditStory({
  component: Pagination,
  code: `import { Flexbox, Pagination, Text } from '@aknishi/akds-reactkit';

const PaginationExample = () => (
  <Flexbox direction="column" gap="md">
    <Text styleAs="label">Near the start</Text>
    <Pagination count={20} defaultPage={2} aria-label="Near the start" />
    <Text styleAs="label">In the middle</Text>
    <Pagination count={20} defaultPage={10} aria-label="In the middle" />
    <Text styleAs="label">Near the end</Text>
    <Pagination count={20} defaultPage={19} aria-label="Near the end" />
    <Text styleAs="label">siblingCount={2}</Text>
    <Pagination count={20} defaultPage={10} siblingCount={2} aria-label="Two siblings" />
  </Flexbox>
);

export default PaginationExample;
`,
});

export const Controlled = LiveEditStory({
  component: Pagination,
  code: `import React from 'react';
import { Flexbox, Pagination, Text } from '@aknishi/akds-reactkit';

const PAGE_SIZE = 10;
const TOTAL_ROWS = 243;

const PaginationExample = () => {
  const [page, setPage] = React.useState(1);
  const pageCount = Math.ceil(TOTAL_ROWS / PAGE_SIZE);
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, TOTAL_ROWS);

  return (
    <Flexbox align="center" justify="space-between" gap="md">
      <Text styleAs="caption">
        Showing {first}–{last} of {TOTAL_ROWS}
      </Text>
      <Pagination count={pageCount} page={page} onPageChange={setPage} aria-label="Orders pages" />
    </Flexbox>
  );
};

export default PaginationExample;
`,
});

export const Disabled = LiveEditStory({
  component: Pagination,
  code: `import { Pagination } from '@aknishi/akds-reactkit';

const PaginationExample = () => <Pagination count={10} defaultPage={3} disabled />;

export default PaginationExample;
`,
});
