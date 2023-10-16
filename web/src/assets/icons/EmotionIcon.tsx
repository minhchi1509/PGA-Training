import Emotion1 from 'src/assets/images/emotion1.png';
import Emotion2 from 'src/assets/images/emotion2.png';
import Emotion3 from 'src/assets/images/emotion3.png';
import Emotion4 from 'src/assets/images/emotion4.png';
import Emotion5 from 'src/assets/images/emotion5.png';

interface IProps {
  rate: number;
  size?: number;
}

const emotionSrc = {
  1: Emotion1,
  2: Emotion2,
  3: Emotion3,
  4: Emotion4,
  5: Emotion5,
};

const EmotionIcon = ({ rate, size = 48 }: IProps) => {
  return <img className="EmotionIcon" src={emotionSrc[rate]} style={{ width: size, height: size }} />;
};

export default EmotionIcon;
