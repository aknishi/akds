import './TokenSwatch.css';

export interface TokenSwatchProps {
  varName: string;
  label?: string;
  size?: 'sm' | 'md';
}

export function TokenSwatch({ varName, label, size = 'md' }: TokenSwatchProps) {
  return (
    <div className="token-swatch" title={varName}>
      <div
        className={`token-swatch__box token-swatch__box--${size}`}
        style={{ background: `var(${varName})` }}
      />
      <div className="token-swatch__meta">
        {label && <span className="token-swatch__label">{label}</span>}
        <code className="token-swatch__var">{varName}</code>
      </div>
    </div>
  );
}
