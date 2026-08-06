import type { Meta } from '@storybook/react-vite';
import { Tabs } from './Tabs';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Tabs> = {
  title: 'Reactkit/Tabs',
  component: Tabs,
};

export default meta;

export const Default = LiveEditStory({
  component: Tabs,
  code: `import { Tabs, TabList, Tab, TabPanel } from '@aknishi/akds-reactkit';

const Example = () => (
  <Tabs defaultActiveTab="overview">
    <TabList>
      <Tab value="overview">Overview</Tab>
      <Tab value="details">Details</Tab>
      <Tab value="settings">Settings</Tab>
    </TabList>
    <TabPanel value="overview">
      <p>Overview content goes here.</p>
    </TabPanel>
    <TabPanel value="details">
      <p>Details content goes here.</p>
    </TabPanel>
    <TabPanel value="settings">
      <p>Settings content goes here.</p>
    </TabPanel>
  </Tabs>
);

export default Example;
`,
});

export const Controlled = LiveEditStory({
  component: Tabs,
  code: `import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from '@aknishi/akds-reactkit';

const Example = () => {
  const [activeTab, setActiveTab] = React.useState('tab1');
  return (
    <Tabs activeTab={activeTab} onChange={setActiveTab}>
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3" disabled>Tab 3</Tab>
      </TabList>
      <TabPanel value="tab1"><p>Content for Tab 1</p></TabPanel>
      <TabPanel value="tab2"><p>Content for Tab 2</p></TabPanel>
      <TabPanel value="tab3"><p>Content for Tab 3</p></TabPanel>
    </Tabs>
  );
};

export default Example;
`,
});

export const WithDisabledTab = LiveEditStory({
  component: Tabs,
  code: `import { Tabs, TabList, Tab, TabPanel } from '@aknishi/akds-reactkit';

const Example = () => (
  <Tabs defaultActiveTab="a">
    <TabList>
      <Tab value="a">Active</Tab>
      <Tab value="b" disabled>Disabled</Tab>
      <Tab value="c">Another</Tab>
    </TabList>
    <TabPanel value="a"><p>First panel.</p></TabPanel>
    <TabPanel value="b"><p>Disabled panel.</p></TabPanel>
    <TabPanel value="c"><p>Third panel.</p></TabPanel>
  </Tabs>
);

export default Example;
`,
});
