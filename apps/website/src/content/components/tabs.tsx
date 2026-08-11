import { Tab, TabList, TabPanel, Tabs, Text } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const tabs: ComponentEntry = {
  slug: 'tabs',
  name: 'Tabs',
  category: 'Navigation & Disclosure',
  summary:
    'A compound component set (Tabs, TabList, Tab, TabPanel) that shares active-tab state through context — no manual wiring required.',
  sourcePath: 'packages/reactkit/src/components/Tabs',
  examples: [
    {
      title: 'Basic',
      render: () => (
        <Tabs defaultActiveTab="account">
          <TabList>
            <Tab value="account">Account</Tab>
            <Tab value="security">Security</Tab>
            <Tab value="billing">Billing</Tab>
          </TabList>
          <TabPanel value="account">
            <Text styleAs="body">Account settings content.</Text>
          </TabPanel>
          <TabPanel value="security">
            <Text styleAs="body">Security settings content.</Text>
          </TabPanel>
          <TabPanel value="billing">
            <Text styleAs="body">Billing settings content.</Text>
          </TabPanel>
        </Tabs>
      ),
      code: `<Tabs defaultActiveTab="account">
  <TabList>
    <Tab value="account">Account</Tab>
    <Tab value="security">Security</Tab>
    <Tab value="billing">Billing</Tab>
  </TabList>
  <TabPanel value="account">
    <Text styleAs="body">Account settings content.</Text>
  </TabPanel>
  <TabPanel value="security">
    <Text styleAs="body">Security settings content.</Text>
  </TabPanel>
  <TabPanel value="billing">
    <Text styleAs="body">Billing settings content.</Text>
  </TabPanel>
</Tabs>`,
    },
    {
      title: 'Disabled tab',
      render: () => (
        <Tabs defaultActiveTab="one">
          <TabList>
            <Tab value="one">Available</Tab>
            <Tab value="two" disabled>
              Disabled
            </Tab>
          </TabList>
          <TabPanel value="one">
            <Text styleAs="body">Content for the available tab.</Text>
          </TabPanel>
        </Tabs>
      ),
      code: `<Tab value="two" disabled>Disabled</Tab>`,
    },
  ],
  accessibilityNotes: [
    'TabList renders role="tablist"; each Tab is a role="tab" button; each TabPanel is role="tabpanel" — matching the WAI-ARIA Tabs pattern.',
    'Tab state is shared via React context, not prop drilling — TabList, Tab, and TabPanel all read from the same Tabs root.',
    'Arrow-key navigation moves focus between tabs; Tab/Shift+Tab moves focus in and out of the tablist as a single stop.',
  ],
  props: [
    { name: 'activeTab', type: 'string', description: 'The value of the currently active tab. Makes the component controlled.' },
    { name: 'defaultActiveTab', type: 'string', description: 'Initial active tab for the uncontrolled case.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called when the active tab changes.' },
    { name: 'children', type: 'React.ReactNode', description: 'Typically a TabList and one or more TabPanels.' },
  ],
  doDont: [
    { do: 'Use Tabs to switch between related views of the same content.', dont: "Don't use Tabs for a multi-step, sequential flow — use a wizard or ProgressTracker instead." },
    { do: 'Keep tab labels short and parallel in structure.', dont: "Don't hide critical actions inside inactive tab panels." },
  ],
  related: ['accordion', 'progress-tracker'],
};
