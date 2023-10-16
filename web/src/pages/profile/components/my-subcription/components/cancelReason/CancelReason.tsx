import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Checkbox, Form, Modal, ModalProps, Space } from 'antd';

import './CancelReason.scss';
import Button from 'src/components/button';
import { BaseText } from 'src/components/typography';
import TextArea from 'src/components/input/TextArea';
import Alert from 'src/components/alert/Alert';
import { TRootState } from 'src/stores';

interface ICancelReasonProps extends ModalProps {
  onCancel: () => void;
  onSubmit: (values: { reason: string[]; comment: '' }) => void;
  loading?: boolean;
}

const LIST_REASON = [
  'Change in work requirements',
  'Too difficult to use',
  'Found an alternative',
  `Didn't like it`,
  'Too many technical glitches',
  'Privacy concerns',
  'Not happy with customer support',
  'Too expensive',
  'Other',
];

const CancelReason = (props: ICancelReasonProps): JSX.Element => {
  const profile = useSelector((state: TRootState) => state.user.profile);
  const { onSubmit, onCancel, loading, closable = false, ...rest } = props;
  const [form] = Form.useForm();
  const reason = Form.useWatch('reason', form);

  const handleSubmit = (values: { reason: string[]; comment: '' }) => {
    onSubmit(values);
  };

  return (
    <Modal centered closable={closable} footer={null} width={570} onCancel={onCancel} {...rest} className={`CancelSubcription`}>
      <Form onFinish={handleSubmit} form={form}>
        <Space direction="vertical" className="discharge-modal">
          <div className="CancelSubcription-reason-heading">
            <BaseText type="headline">
              {`${profile?.firstName} ${profile?.lastName}`}, we’re sorry to see you go!{' '}
            </BaseText>
            <BaseText type="small" className="CancelSubcription__subtitle">
              {`We'd love to learn more about your experience before you go.`}
            </BaseText>
          </div>

          <div className="CancelSubcription-reason">
            <BaseText className="CancelSubcription__reason--title">
              Select the main reason(s) for your cancellation (REQUIRED)
            </BaseText>
            <div className="reason-content">
              <Form.Item name="reason" rules={[{ required: true, message: 'Please select the reason' }]}>
                <Checkbox.Group>
                  <Space direction="vertical">
                    {LIST_REASON.map((reason, index) => (
                      <Checkbox value={reason} key={index}>
                        {reason}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item
                name="comment"
                className="CancelSubcription__reason--comment"
                rules={[
                  {
                    validator(_, value) {
                      if (reason && reason.includes('Other') && !value) {
                        return Promise.reject('Please enter the comment');
                      }

                      return Promise.resolve();
                    },
                  },
                  {
                    max: 250,
                    message: `Valid comment shouldn't exceed 250 characters`,
                  },
                ]}
              >
                <TextArea className="reason-other-input" placeholder="Let us know what's missing..."></TextArea>
              </Form.Item>
              <Alert
                message={`By cancelling your subscription, all practitioners and clients in your practice will lose access to ANTSA at the end of your billing cycle (${dayjs().format(
                  'MMM DD YYYY',
                )})`}
                type="warning"
                showIcon
              />
            </div>
          </div>
          <div className="CancelSubcription__footer">
            <Button
              type="default"
              onClick={onCancel}
              size="large"
              className="CancelSubcription__footer--btnleft"
              disabled={loading}
            >
              <BaseText>Cancel</BaseText>
            </Button>
            <Button type="primary" htmlType="submit" size="large" loading={loading}>
              <BaseText>Cancel my subscription</BaseText>
            </Button>
          </div>
        </Space>
      </Form>
    </Modal>
  );
};

export default CancelReason;
