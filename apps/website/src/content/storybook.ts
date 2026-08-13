export const STORYBOOK_URL = 'https://akds-storybook.com';

export function storybookDocsUrl(storybookId: string) {
  return `${STORYBOOK_URL}/?path=/docs/${storybookId}`;
}
