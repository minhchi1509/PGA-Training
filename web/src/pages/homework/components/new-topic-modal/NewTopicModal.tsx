import { Form, Modal, ModalProps } from 'antd';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { BaseText } from 'src/components/typography';
import { STRING_NOT_ONLY_SPACE_REGEX } from 'src/variables/constants';
import { TNewTopicValues } from './new-topic-types';
import Button from 'src/components/button';
import './NewTopicModal.scss';

interface INewTopicModal extends ModalProps {
  onSave: (values: TNewTopicValues) => void;
  onClose: () => void;
}

const NewTopicModal = ({ onSave, onClose, ...rest }: INewTopicModal) => {
  const [form] = Form.useForm<TNewTopicValues>();

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  const handleSubmit = (values: TNewTopicValues) => {
    handleClose();
    onSave(values);
  };

  return (
    <Modal centered footer={null} width={370} closable={false} {...rest} className="NewTopicModal">
      <BaseText type="title" textAlign="center" className="NewTopicModal__title">
        Add new topic
      </BaseText>
      <Form form={form} onFinish={handleSubmit}>
        <div className="NewTopicModal__input-row">
          <BaseText>Topic name</BaseText>
          <FormItem
            name="topicName"
            rules={[
              {
                required: true,
                message: 'Please enter the topic name',
              },
              {
                max: 100,
                message: `Valid topic name shouldn't exceed 100 characters`,
              },
              { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the topic name' },
            ]}
          >
            <Input />
          </FormItem>
        </div>
        <div className="NewTopicModal__buttons">
          <Button className="NewTopicModal__button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="primary" className="NewTopicModal__button" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NewTopicModal;
