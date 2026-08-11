import { CheckCircleFilledIcon, CancelFilledIcon } from '@aknishi/akds-icons';
import { Text } from '@aknishi/akds-reactkit';
import type { DoDontPair } from '../../../content/components/types';
import './DoDontPanel.css';

export function DoDontPanel({ pair }: { pair: DoDontPair }) {
  return (
    <div className="do-dont-panel">
      <div className="do-dont-panel__item do-dont-panel__item--do">
        <CheckCircleFilledIcon color="success" />
        <Text styleAs="body">{pair.do}</Text>
      </div>
      <div className="do-dont-panel__item do-dont-panel__item--dont">
        <CancelFilledIcon color="error" />
        <Text styleAs="body">{pair.dont}</Text>
      </div>
    </div>
  );
}
