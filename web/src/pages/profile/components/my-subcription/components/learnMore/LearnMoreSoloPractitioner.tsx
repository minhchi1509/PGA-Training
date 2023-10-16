import { Modal, Row, Space } from 'antd';
import { useState } from 'react';
import { DotIcon, InfoIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';

import { PackageDescriptionRow } from 'src/components/pricing-package';
import './LearnMore.scss';

const LearnMoreSoloPractitioner = (): JSX.Element => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const onToggleOpenModal = () => {
    setIsOpenModal(!isOpenModal);
  };
  return (
    <>
      <Row className="LearnMore">
        <div className="info-icon">
          <InfoIcon />
        </div>
        <div className="LearnMore-btn" onClick={onToggleOpenModal}>
          <BaseText> Learn more</BaseText>
        </div>
      </Row>
      <Modal
        centered
        footer={null}
        width={570}
        className={`CancelSubcription`}
        open={isOpenModal}
        onCancel={onToggleOpenModal}
      >
        <Space direction="vertical">
          <div className="LearnMore-heading">
            <BaseText type="headline">Solo Pratitioner</BaseText>
          </div>
          <div className="LearnMore-content">
            <BaseText type="small">As a Solo Pratitioner, you can monitor your clients as well as keep them</BaseText>
            <BaseText type="small">engaged for LESS THAN $14 per week. This way, you can track their progress</BaseText>
            <BaseText type="small">
              without having to call them or schedule additional appointments when your time is limited.
            </BaseText>
          </div>
          <BaseText type="subHeading" className="LearnMore-sub-heading">
            Solo Pratitioner:
          </BaseText>
          <div className="LearnMore-description">
            <PackageDescriptionRow icon={<DotIcon className="dot-icon" />} text="$59 AUD (plus GST) per month" />
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default LearnMoreSoloPractitioner;
