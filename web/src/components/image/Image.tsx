import { Image as AntImage, ImageProps } from 'antd';

import PreviewErrorUrl from 'src/assets/images/default-image.png';
import './Image.scss';

interface IProps extends ImageProps {
  className?: string;
  showFallback?: boolean;
}

const Image = ({ showFallback, ...rest }: IProps) => {
  return <AntImage fallback={showFallback ? PreviewErrorUrl : undefined} wrapperClassName="Image" {...rest} />;
};

export const ImagePreviewGroup = AntImage.PreviewGroup;

export default Image;
