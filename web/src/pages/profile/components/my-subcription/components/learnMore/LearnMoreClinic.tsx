import { Modal, Row, Space } from 'antd';
import { useState } from 'react';
import { DotIcon, InfoIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';

import { PackageDescriptionRow } from 'src/components/pricing-package';
import './LearnMore.scss';

const LearnMoreClinic = (): JSX.Element => {
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
            <BaseText type="headline">Clinic Owner</BaseText>
          </div>
          <div className="LearnMore-content">
            <BaseText type="small">
              As a Clinic Owner, you can puechase 3 or more licences for our platform each at
            </BaseText>
            <BaseText type="small">a discounted rate, with no limit on the number of licences.</BaseText>
            <BaseText type="small">
              If you&apos;re also a Practitioner, one of these licences can be assigned to you.
            </BaseText>
          </div>
          <div className="LearnMore-content">
            <BaseText type="small">Our platform ensures privacy prevening Clinic Owners from seeing</BaseText>
            <BaseText type="small">
              Practitioner clients & information. However, you can still collect overall de-
            </BaseText>
            <BaseText type="small">identified usage data for your staff.</BaseText>
          </div>
          <BaseText type="subHeading" className="LearnMore-sub-heading">
            Clinic rates:
          </BaseText>
          <div className="LearnMore-description">
            <PackageDescriptionRow
              icon={<DotIcon className="dot-icon" />}
              text="Prices start as low as $36 per practitioner licence."
            />
            <PackageDescriptionRow
              icon={<DotIcon className="dot-icon" />}
              text="$59 AUD 1-2 practitioner licences (+ G.S.T) each."
            />
            <PackageDescriptionRow
              icon={<DotIcon className="dot-icon" />}
              text="Then a 5% discount for each extra licence up to 10."
            />
            <PackageDescriptionRow
              icon={<DotIcon className="dot-icon" />}
              text="For more than 10 practitioners, please contact us for a quote."
            />
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default LearnMoreClinic;
