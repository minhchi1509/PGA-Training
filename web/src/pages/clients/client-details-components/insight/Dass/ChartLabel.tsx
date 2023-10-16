import './ChartLabel.scss';
import { BaseText } from 'src/components/typography';

const ChartLabel = () => {
  return (
    <div className="ChartLabel">
      <div className="ChartLabel__item">
        <BaseText className="ChartLabel__item--title">Extremely severe</BaseText>
      </div>
      <div className="ChartLabel__item">
        <BaseText className="ChartLabel__item--title">Severe</BaseText>
      </div>
      <div className="ChartLabel__item">
        <BaseText className="ChartLabel__item--title">Moderate</BaseText>
      </div>
      <div className="ChartLabel__item">
        <BaseText className="ChartLabel__item--title">Mild</BaseText>
      </div>
      <div className="ChartLabel__item">
        <BaseText className="ChartLabel__item--title">Nomal</BaseText>
      </div>
    </div>
  );
};

export default ChartLabel;
