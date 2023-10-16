import { PlayCircleOutlined } from '@ant-design/icons';

import './ImageWithMask.scss';

interface IProps {
  videoUrl?: string;
  mask?: React.ReactNode;
  captureTime?: number;
  size?: number;
  customImage?: React.ReactNode;
}

const ImageWithMask = ({ videoUrl, customImage, captureTime = 1, mask, size }: IProps) => {
  return (
    <div className="ImageWithMask" style={{ width: size, height: size }}>
      {videoUrl && (
        <>
          <video src={`${videoUrl}#t=${captureTime}`} className="ImageWithMask__image" width={size} height={size} />
          <div className="ImageWithMask__ghost">
            <PlayCircleOutlined />
          </div>
        </>
      )}
      {customImage}

      {mask && <div className="ImageWithMask__mask">{mask}</div>}
    </div>
  );
};

export default ImageWithMask;
