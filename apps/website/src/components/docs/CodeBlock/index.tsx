import React from 'react';
import { IconButton, Tooltip } from '@aknishi/akds-reactkit';
import { CopyIcon, CheckIcon } from '@aknishi/akds-icons';
import './CodeBlock.css';

export interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="code-block">
      <div className="code-block__toolbar">
        <span className="code-block__language">{language}</span>
        <Tooltip content={copied ? 'Copied!' : 'Copy code'}>
          <IconButton appearance="transparent" emphasis="neutral" aria-label="Copy code" onClick={handleCopy}>
            {copied ? <CheckIcon /> : <CopyIcon />}
          </IconButton>
        </Tooltip>
      </div>
      <pre className="code-block__pre" tabIndex={0}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
