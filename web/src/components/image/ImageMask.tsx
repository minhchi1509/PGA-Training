import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';

import './ImageMask.scss';

interface IProps {
  className?: string;
  preview?: boolean;
  downloading?: boolean;
  onDownload?: () => void;
  onPreview?: () => void;
}

const ImageMask = ({ className, preview = true, downloading, onPreview, onDownload }: IProps) => {
  const handleClickDownload: React.MouseEventHandler<HTMLSpanElement> = (e) => {
    if (downloading) return;
    e.stopPropagation();
    onDownload?.();
  };

  const handlePreview: React.MouseEventHandler<HTMLSpanElement> = (e) => {
    if (onPreview) {
      e.stopPropagation();
      onPreview?.();
    }
  };

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (downloading) return;
    if (preview && onPreview) {
      e.stopPropagation();
      onPreview();
    }
  };

  return (
    <div className={`ImageMask  ${className ?? ''}`} onClick={handleClick}>
      {preview && <EyeOutlined onClick={handlePreview} />}
      {onDownload && <DownloadOutlined onClick={handleClickDownload} disabled={downloading} />}
    </div>
  );
};

export default ImageMask;
