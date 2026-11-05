declare module '*.css';

// Vite's ?raw imports, used by stories to show an example file's code.
declare module '*?raw' {
  const content: string;
  export default content;
}
