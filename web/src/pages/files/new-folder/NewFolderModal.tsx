import { Form, Modal, ModalProps } from 'antd';
import { UploadFolderIcon } from 'src/assets/icons';
import Button from 'src/components/button';
import { BaseText } from 'src/components/typography';
import { TNewFolderRequest } from 'src/interfaces/files-interface';

import './NewFolderModal.scss';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { STRING_NOT_ONLY_SPACE_REGEX } from 'src/variables/constants';

interface INewFolderModalProps extends ModalProps {
  onClose: () => void;
  onSubmit: (values: TNewFolderRequest) => void;
}
const NewFolderModal = ({ onClose, onSubmit, ...rest }: INewFolderModalProps) => {
  const [form] = Form.useForm();
  const onFinish = async (values: TNewFolderRequest) => {
    onSubmit(values);
    onClose();
    form.resetFields();
  };
  return (
    <Modal centered footer={null} width={370} {...rest} className="NewFolderModal">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="icon">
          <UploadFolderIcon />
        </div>
        <div className="NewFolderModal__title">
          <BaseText type="title" textAlign="center">
            New folder
          </BaseText>
        </div>
        <div className="NewFolderModal__body">
          <FormItem
            showRequiredMark={false}
            label="Folder name"
            name="name"
            rules={[
              { required: true, message: 'Please enter the folder name' },
              {
                max: 100,
                message: `Valid folder name shouldn't exceed 100 characters`,
              },
              { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the folder name' },
            ]}
          >
            <Input />
          </FormItem>
        </div>
        <div className="NewFolderModal__footer">
          <Button
            onClick={() => {
              onClose();
              form.resetFields();
            }}
            className="button"
          >
            <BaseText>Cancel</BaseText>
          </Button>
          <Button type="primary" htmlType="submit" className="button">
            <BaseText>Create</BaseText>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NewFolderModal;
