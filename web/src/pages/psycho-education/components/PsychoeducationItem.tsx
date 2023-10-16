import { RightIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import { TPsychoeducationItemData } from 'src/interfaces/psychoeducation-interface';
import './PsychoeducationItem.scss';

interface IProps {
  data: TPsychoeducationItemData;
  onClick: () => void;
}

const PsychoeducationItem = ({ data, onClick }: IProps) => {
  return (
    <div className={`PsychoeducationItem ${data.type}`} onClick={onClick}>
      <BaseText type="body1">{data.title}</BaseText>
      <RightIcon className="PsychoeducationItem__icon" />
    </div>
  );
};

export default PsychoeducationItem;
