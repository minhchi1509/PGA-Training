import { Col, Form, Modal, ModalProps, Row } from 'antd';
import Checkbox from 'antd/es/checkbox/Checkbox';

import './AssignClientsModal.scss';
import Button from 'src/components/button';
import { FormItem } from 'src/components/forms';
import Select from 'src/components/select';
import { BaseText } from 'src/components/typography';
import { TPractitionerLite } from 'src/interfaces/practitioners-interface';

type TForm = {
  practitionerRellocate: string;
  deactive: boolean;
};

interface IAssignClientsModalProps extends ModalProps {
  onSubmit: (values: TForm) => void;
  onCancel: () => void;
  loading?: boolean;
  practitionerId: string;
  totalClient?: number;
  totalActiveClient?: number;
  listPractitioner: TPractitionerLite[];
}

const AssignClientsModal = (props: IAssignClientsModalProps): JSX.Element => {
  const [form] = Form.useForm<TForm>();
  const deactive = Form.useWatch('deactive', form);
  const { onSubmit, onCancel, loading, listPractitioner, practitionerId, totalClient, totalActiveClient, ...rest } =
    props;

  const handleSubmit = (values: TForm) => {
    onSubmit(values);
  };

  return (
    <Modal closable={false} footer={null} width={570} className="AssignClientsModal" {...rest}>
      <Form onFinish={handleSubmit} form={form} initialValues={{ deactive: false }}>
        <BaseText type="title">Practitioner’s clients?</BaseText>
        <div className="AssignClientsModal__content">
          <BaseText type="small" className="AssignClientsModal__content--title">
            There are {totalClient} {Number(totalClient) > 0 ? 'clients' : 'client'} that are being treatmented by this
            practitioner, do you want to deactivate or allocate them to another practitioner?
          </BaseText>

          <div className="AssignClientsModal__content-table">
            <Row gutter={10} className="AssignClientsModal__content-table--header">
              <Col span={8}>
                <BaseText type="caption">Number of active clients</BaseText>
              </Col>
              <Col span={12}>
                <BaseText type="caption">Reallocate</BaseText>
              </Col>
              <Col span={4}>
                <BaseText type="caption">Deactivate</BaseText>
              </Col>
            </Row>
            <Row gutter={10} className="AssignClientsModal__content-table--content">
              <Col span={8}>
                <BaseText type="caption">{totalActiveClient}</BaseText>
              </Col>
              <Col span={12}>
                <FormItem
                  name="practitionerRellocate"
                  style={{ marginBottom: 0 }}
                  rules={[
                    {
                      validator(_, value) {
                        if (value || deactive) {
                          return Promise.resolve();
                        }

                        return Promise.reject('Please select practitioner');
                      },
                    },
                  ]}
                >
                  <Select
                    placeholder="Select practitioner"
                    style={{ width: '100%' }}
                    options={listPractitioner
                      .filter((practitioner) => practitioner.id !== practitionerId)
                      .map((practitioner) => ({
                        value: practitioner.id,
                        label: `${practitioner.firstName} ${practitioner.lastName}`,
                      }))}
                  />
                </FormItem>
              </Col>
              <Col span={4} className="AssignClientsModal__content-table--content--checkbox">
                <FormItem name="deactive" valuePropName="checked" noStyle>
                  <Checkbox />
                </FormItem>
              </Col>
            </Row>
          </div>

          <BaseText type="small">
            {deactive ? 'Deactivate' : 'Reallocate'}: {totalClient} {Number(totalClient) > 0 ? 'clients' : 'client'}
          </BaseText>
        </div>
        <div className="AssignClientsModal__footer">
          <Button type="default" onClick={onCancel} disabled={loading}>
            <BaseText>Cancel</BaseText>
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            <BaseText>Confirm</BaseText>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AssignClientsModal;
