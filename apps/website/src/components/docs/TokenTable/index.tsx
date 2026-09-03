import './TokenTable.css';

export interface TokenRow {
  name: string;
  cssVar: string;
  value: string;
}

export interface TokenTableProps {
  rows: TokenRow[];
  swatch?: boolean;
}

export function TokenTable({ rows, swatch = false }: TokenTableProps) {
  return (
    <div className="token-table__wrapper">
      <table className="token-table">
        <thead>
          <tr>
            {swatch && <th className="token-table__swatch-col" aria-label="Preview" />}
            <th>Token</th>
            <th>CSS variable</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.cssVar}>
              {swatch && (
                <td className="token-table__swatch-col">
                  <div className="token-table__swatch" style={{ background: `var(${row.cssVar})` }} />
                </td>
              )}
              <td>
                <code>{row.name}</code>
              </td>
              <td>
                <code>{row.cssVar}</code>
              </td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
