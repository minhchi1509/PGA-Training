import { AntsaIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import './ImgContainer.scss';

interface IProps extends React.PropsWithChildren {
  className?: string;
  title?: string;
  description?: string;
  bgColor: string;
  bgImgSrc: string;
}

const ImgContainer = ({
  title = 'Welcome to Antsa',
  description = 'ANTSA automates the process of monitoring, engaging and connecting with clients while saving the practitioner time and stress!',
  bgImgSrc,
  bgColor,
  className,
  children,
}: IProps) => {
  return (
    <div className={`ImgContainer ${className ?? ''}`}>
      <div className="ImgContainer__left" style={{ background: bgColor }}>
        <img src={bgImgSrc} alt="Background Image" />
        <div className="ImgContainer__left-container">
          <div className="ImgContainer__left-logo">
            <AntsaIcon />
            <BaseText>FOR PROFESSIONALS</BaseText>
          </div>
          <BaseText type="headline" className="ImgContainer__left-title">
            {title}
          </BaseText>
          <BaseText type="display1">{description}</BaseText>
        </div>
      </div>
      <div className="ImgContainer__right">{children}</div>
    </div>
  );
};

export default ImgContainer;
