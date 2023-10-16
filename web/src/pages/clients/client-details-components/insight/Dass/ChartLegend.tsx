import './ChartLegend.scss';
import { BaseText } from 'src/components/typography';

const ChartLegend = () => {
  return (
    <div className="ChartLegend">
      <div className="ChartLegend__item">
        <span className="ChartLegend__item--dot"></span>
        <BaseText type="caption">D</BaseText>
      </div>
      <div className="ChartLegend__item">
        <span className="ChartLegend__item--dot a"></span>
        <BaseText type="caption">A</BaseText>
      </div>
      <div className="ChartLegend__item">
        <span className="ChartLegend__item--dot s"></span>
        <BaseText type="caption">S</BaseText>
      </div>
    </div>
  );
};

export default ChartLegend;
