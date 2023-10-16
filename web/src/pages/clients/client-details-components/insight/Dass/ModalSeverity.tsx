import { Modal, ModalProps, Space } from 'antd';
import { BaseText } from 'src/components/typography';
import SeverityTable from 'src/containers/homework/SeverityTable';
import { THomeworkSeverity } from 'src/interfaces/clients-interface';

interface IModalSeverityProps extends ModalProps {
  data?: THomeworkSeverity;
}

const ModalSeverity = (props: IModalSeverityProps) => {
  const { data, ...rest } = props;

  return (
    <Modal centered footer={null} {...rest} className="AlertModal">
      <Space direction="vertical" className="discharge-modal">
        <BaseText type="subHeading">Severity</BaseText>
        {data ? <SeverityTable data={data} /> : null}
      </Space>
    </Modal>
  );
};

export default ModalSeverity;
