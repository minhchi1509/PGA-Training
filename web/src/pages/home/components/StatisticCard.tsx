import { FC } from 'react';

import './StatisticCard.scss';
import { BaseText } from 'src/components/typography';

interface IStatisticCardProps {
  className?: string;
  title: string;
  decorColor: string;
  children?: React.ReactNode;
  imgSrc?: string;
}

const StatisticCard: FC<IStatisticCardProps> = ({ title, decorColor, children, imgSrc, className }) => {
  return (
    <div className={`StatisticCard ${className ?? ''}`}>
      <div className="StatisticCard__title">
        <div className="decor" style={{ backgroundColor: decorColor }}></div>
        <BaseText type="title">{title}</BaseText>
      </div>
      {imgSrc && <img src={imgSrc} alt="Background Image" />}
      <div className="StatisticCard__content">{children}</div>
    </div>
  );
};

export default StatisticCard;
