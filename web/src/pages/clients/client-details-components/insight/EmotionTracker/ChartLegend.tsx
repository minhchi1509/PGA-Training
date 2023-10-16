import { BaseText } from 'src/components/typography';
import './ChartLegend.scss';
import { EmotionIcon } from 'src/assets/icons';

const ChartLegend = () => {
  return (
    <div className="ChartLegendTrackMood">
      <div className="ChartLegendTrackMood__item">
        <EmotionIcon rate={5} size={16} />
        <BaseText type="caption">Happy</BaseText>
      </div>
      <div className="ChartLegendTrackMood__item">
        <EmotionIcon rate={4} size={16} />
        <BaseText type="caption">--</BaseText>
      </div>
      <div className="ChartLegendTrackMood__item">
        <EmotionIcon rate={3} size={16} />
        <BaseText type="caption">--</BaseText>
      </div>
      <div className="ChartLegendTrackMood__item">
        <EmotionIcon rate={2} size={16} />
        <BaseText type="caption">--</BaseText>
      </div>
      <div className="ChartLegendTrackMood__item">
        <EmotionIcon rate={1} size={16} />
        <BaseText type="caption">--</BaseText>
      </div>
    </div>
  );
};

export default ChartLegend;
