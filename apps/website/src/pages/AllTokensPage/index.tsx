import { Flexbox, Tab, TabList, TabPanel, Tabs, Text } from '@aknishi/akds-reactkit';
import { TokenTable } from '../../components/docs/TokenTable';
import {
  getBreakpointRows,
  getElevationRows,
  getFontFamilyRows,
  getFontSizeRows,
  getFontWeightRows,
  getLetterSpacingRows,
  getLineHeightRows,
  getPrimitiveColorRows,
  getRadiusRows,
  getSemanticColorRows,
  getSizeRows,
  getSpacingLayoutRows,
  getSpacingScaleRows,
} from './tokenRows';
import './AllTokensPage.css';

export function AllTokensPage() {
  return (
    <Flexbox direction="column" gap="xl" className="all-tokens-page">
      <Flexbox direction="column" gap="sm">
        <Text as="h1" styleAs="h1">
          All tokens
        </Text>
        <Text styleAs="body" className="all-tokens-page__lede">
          Every token name and CSS variable in AKDS, grouped by type.
        </Text>
      </Flexbox>

      <Tabs defaultActiveTab="colors">
        <TabList>
          <Tab value="colors">Colors</Tab>
          <Tab value="spacing">Spacing</Tab>
          <Tab value="typography">Typography</Tab>
          <Tab value="elevation">Elevation</Tab>
          <Tab value="breakpoints">Breakpoints</Tab>
        </TabList>
        <TabPanel value="colors">
          <Flexbox direction="column" gap="lg" mt={1}>
            <Flexbox direction="column" gap="xs">
              <Text styleAs="label">Semantic</Text>
              <TokenTable rows={getSemanticColorRows()} swatch />
            </Flexbox>
            <Flexbox direction="column" gap="xs">
              <Text styleAs="label">Primitive</Text>
              <TokenTable rows={getPrimitiveColorRows()} swatch />
            </Flexbox>
          </Flexbox>
        </TabPanel>
        <TabPanel value="spacing">
          <Flexbox direction="column" gap="lg" mt={1}>
            <Flexbox direction="column" gap="xs">
              <Text styleAs="label">Scale</Text>
              <TokenTable rows={getSpacingScaleRows()} />
            </Flexbox>
            <Flexbox direction="column" gap="xs">
              <Text styleAs="label">Layout</Text>
              <TokenTable rows={getSpacingLayoutRows()} />
            </Flexbox>
            <Flexbox direction="column" gap="xs">
              <Text styleAs="label">Radius</Text>
              <TokenTable rows={getRadiusRows()} />
            </Flexbox>
            <Flexbox direction="column" gap="xs">
              <Text styleAs="label">Size</Text>
              <TokenTable rows={getSizeRows()} />
            </Flexbox>
          </Flexbox>
        </TabPanel>
        <TabPanel value="typography">
          <Flexbox direction="column" gap="lg" mt={1}>
            <Flexbox direction="column" gap="xs">
              <Text styleAs="label">Font family</Text>
              <TokenTable rows={getFontFamilyRows()} />
            </Flexbox>
            <Flexbox direction="column" gap="xs">
              <Text styleAs="label">Font size</Text>
              <TokenTable rows={getFontSizeRows()} />
            </Flexbox>
            <Flexbox direction="column" gap="xs">
              <Text styleAs="label">Font weight</Text>
              <TokenTable rows={getFontWeightRows()} />
            </Flexbox>
            <Flexbox direction="column" gap="xs">
              <Text styleAs="label">Line height</Text>
              <TokenTable rows={getLineHeightRows()} />
            </Flexbox>
            <Flexbox direction="column" gap="xs">
              <Text styleAs="label">Letter spacing</Text>
              <TokenTable rows={getLetterSpacingRows()} />
            </Flexbox>
          </Flexbox>
        </TabPanel>
        <TabPanel value="elevation">
          <Flexbox direction="column" gap="xs" mt={1}>
            <TokenTable rows={getElevationRows()} />
          </Flexbox>
        </TabPanel>
        <TabPanel value="breakpoints">
          <Flexbox direction="column" gap="xs" mt={1}>
            <TokenTable rows={getBreakpointRows()} />
          </Flexbox>
        </TabPanel>
      </Tabs>
    </Flexbox>
  );
}
