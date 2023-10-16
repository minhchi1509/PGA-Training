import { useState } from 'react';
import { Form, UploadProps } from 'antd';
import { RcFile, UploadFile } from 'antd/es/upload';

import './ContactHelp.scss';
import { BaseText } from 'src/components/typography';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import Upload from 'src/components/upload';
import Button from 'src/components/button';
import { UploadIcon } from 'src/assets/icons';
import { getBase64, validateFileType } from 'src/utils/common-utils';
import { showErrorToast } from 'src/components/toast/Toast';
import { ACCEPTED_CONTACT_HELP_FILE_TYPE } from 'src/variables/common';
import ContactHelpPreviewFiles from './components/ContactHelpPreviewFiles';
import { TContactHelpFormValues } from 'src/interfaces/profile-interface';
import { TRootState, useAppDispatch } from 'src/stores';
import { sendContactHelp } from 'src/stores/profile/profile-actions';
import { useSelector } from 'react-redux';
import { EProfileActions } from 'src/stores/profile/profile-constants';
import { EAcceptedContactHelpFileType } from 'src/variables/enum-variables';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const MAX_NUMER_OF_FILES = 5;

const ContactHelp = () => {
  const dispatch = useAppDispatch();
  const isSendingContactHelpForm = useSelector((state: TRootState) => state.loading[EProfileActions.SEND_CONTACT_HELP]);
  const [form] = Form.useForm();
  const [contactHelpFiles, setContactHelpFiles] = useState<UploadFile[]>([]);

  const handleSubmitContactHelpForm = async (values: TContactHelpFormValues) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('content', values.contactDescription);
    values.files && values.files.fileList.forEach((file) => formData.append('attachments', file.originFileObj as Blob));
    await dispatch(sendContactHelp(formData));
    setContactHelpFiles([]);
    form.resetFields();
  };

  const handleChangeFile: UploadProps['onChange'] = async ({ file, fileList }) => {
    const isValidFileType = validateFileType(file.type || '', EAcceptedContactHelpFileType);
    if (!isValidFileType) {
      showErrorToast('This format is not supported');
      return;
    }
    if (fileList.length > MAX_NUMER_OF_FILES) {
      showErrorToast('You cannot upload more than 5 files');
      return;
    }
    if ((file.size as number) > MAX_FILE_SIZE) {
      showErrorToast('File size has exceeded 5 MB');
      return;
    }

    const isImageFile = file.type?.includes('image');
    if (isImageFile) {
      const newFile = fileList.map(async (file) => ({
        ...file,
        preview: await getBase64(file.originFileObj as RcFile),
      }));
      Promise.all(newFile).then((results) => setContactHelpFiles([...results]));
    } else {
      setContactHelpFiles([...fileList]);
    }
  };

  const handleRemoveFile = (uid: string) => {
    const removeFileIndex = contactHelpFiles.findIndex((file) => file.uid === uid);
    const newFiles = [...contactHelpFiles];
    newFiles.splice(removeFileIndex, 1);
    const currentFileInFormItem = form.getFieldValue('files');
    form.setFieldValue('files', { ...currentFileInFormItem, fileList: [...newFiles] });
    setContactHelpFiles(newFiles);
  };

  return (
    <div className="ContactHelp">
      <Form
        form={form}
        name="ContactHelpForm"
        onFinish={handleSubmitContactHelpForm}
        autoComplete="off"
        layout="vertical"
        className="ContactHelp__form"
      >
        <BaseText type="caption" className="ContactHelp__form--title">
          Start by sending messages to our admin
        </BaseText>
        <FormItem
          label="Name"
          name="name"
          rules={[{ required: true, message: 'This field is required' }]}
          showRequiredMark={false}
        >
          <Input />
        </FormItem>
        <FormItem
          label="How can we help"
          name="contactDescription"
          rules={[{ required: true, message: 'This field is required' }]}
          showRequiredMark={false}
        >
          <Input />
        </FormItem>
        <FormItem name="files" className="ContactHelp__form--upload">
          <Upload
            multiple
            fileList={contactHelpFiles}
            onChange={handleChangeFile}
            accept={ACCEPTED_CONTACT_HELP_FILE_TYPE}
          >
            <Button icon={<UploadIcon />} className="btn-upload">
              Upload file
            </Button>
          </Upload>
        </FormItem>
        {contactHelpFiles.length > 0 && (
          <ContactHelpPreviewFiles files={contactHelpFiles} onRemoveFile={handleRemoveFile} />
        )}
        <div className="ContactHelp__form--action">
          <Button
            onClick={() => {
              form.resetFields();
              setContactHelpFiles([]);
            }}
            className="btn-cancel"
          >
            <BaseText>Cancel</BaseText>
          </Button>
          <Button type="primary" htmlType="submit" className="btn-submit" loading={isSendingContactHelpForm}>
            <BaseText>Submit</BaseText>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ContactHelp;
