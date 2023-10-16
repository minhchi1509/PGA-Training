import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel, Modal } from 'antd';
import ReactPlayer from 'react-player';
import { CarouselRef } from 'antd/es/carousel';

import Button from 'src/components/button';
import Image from 'src/components/image';
import { BaseText } from 'src/components/typography';
import { TFile } from 'src/interfaces/common-interface';
import { EFileType } from 'src/variables/enum-variables';
import './PreviewFilesModal.scss';

interface IProps {
  fileIndex?: number;
  files: TFile[];
  open: boolean;
  slideRef?: React.Ref<CarouselRef>;
  onClose: () => void;
}

const PreviewFilesModal = ({ open, files, fileIndex = 0, slideRef, onClose }: IProps) => {
  return (
    <Modal
      className="PreviewFilesModal"
      open={open}
      width={700}
      footer={null}
      onCancel={onClose}
      closable={false}
      destroyOnClose
    >
      <BaseText textAlign="center" type="title" className="PreviewFilesModal__title">
        Preview
      </BaseText>
      <Carousel
        arrows
        ref={slideRef}
        prevArrow={<LeftOutlined />}
        nextArrow={<RightOutlined />}
        rootClassName="PreviewFilesModal__carousel"
        initialSlide={fileIndex}
      >
        {files.map((item) => {
          if (item.type === EFileType.IMAGE)
            return (
              <Image
                className="PreviewFilesModal__carousel-image"
                key={item.url}
                src={item.url}
                height={360}
                preview={false}
              />
            );

          if (item.type === EFileType.VIDEO)
            return (
              <ReactPlayer
                controls
                width={'100%'}
                url={item.url}
                key={item.url}
                style={{ borderRadius: 8, overflow: 'hidden' }}
              />
            );
        })}
      </Carousel>

      <Button type="primary" className="PreviewFilesModal__action" onClick={onClose}>
        Close
      </Button>
    </Modal>
  );
};

export default PreviewFilesModal;
