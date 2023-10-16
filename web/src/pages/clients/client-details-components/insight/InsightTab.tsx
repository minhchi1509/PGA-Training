import './InsightTab.scss';

import Dass from './Dass/Dass';
import EmotionTracker from './EmotionTracker/EmotionTracker';

const InsightTab = () => {
  return (
    <div className="InsightTab">
      <Dass />
      <EmotionTracker />
    </div>
  );
};

export default InsightTab;
