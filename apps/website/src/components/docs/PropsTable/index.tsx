import type { PropRow } from '../../../content/components/types';
import './PropsTable.css';

export function PropsTable({ props }: { props: PropRow[] }) {
  if (props.length === 0) return null;

  return (
    <div className="props-table__wrapper">
      <table className="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
              </td>
              <td>
                <code>{row.type}</code>
              </td>
              <td>{row.default ? <code>{row.default}</code> : '—'}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
