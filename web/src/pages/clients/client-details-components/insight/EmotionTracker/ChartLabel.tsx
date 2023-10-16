import './ChartLabel.scss';
import { EmotionIcon } from 'src/assets/icons';

const ChartLabel = () => {
  return (
    <div className="ChartLabelTracker">
      <div className="ChartLabelTracker__item">
        <EmotionIcon rate={5} size={16} />
      </div>
      <div className="ChartLabelTracker__item">
        <EmotionIcon rate={4} size={16} />
      </div>
      <div className="ChartLabelTracker__item">
        <EmotionIcon rate={3} size={16} />
      </div>
      <div className="ChartLabelTracker__item">
        <EmotionIcon rate={2} size={16} />
      </div>
      <div className="ChartLabelTracker__item">
        <EmotionIcon rate={1} size={16} />
      </div>
      <div className="ChartLabelTracker__item" style={{ display: 'none' }}>
        <EmotionIcon rate={1} size={16} />
      </div>
    </div>
  );
};

export default ChartLabel;
