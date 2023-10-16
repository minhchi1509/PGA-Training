import { Form, Modal, ModalProps, Upload, UploadProps } from 'antd';
import { UploadIcon, XIcon } from 'src/assets/icons';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { BaseText } from 'src/components/typography';
import { STRING_NOT_ONLY_SPACE_REGEX } from 'src/variables/constants';
import './UploadModal.scss';
import Button from 'src/components/button';
import { EAcceptedClientFileType, EAcceptedFileManagementType } from 'src/variables/enum-variables';
import { validateFileType, validateSizeImage } from 'src/utils/common-utils';
import { showErrorToast } from 'src/components/toast/Toast';
import { RcFile } from 'antd/es/upload';
import { TClientUploadFileRequest, TClientUploadFileResponse } from 'src/interfaces/clients-interface';
import { useState } from 'react';
import { TFile, TUploadFileManagementRequest } from 'src/interfaces/files-interface';

interface TUploadFileRequest extends TClientUploadFileRequest, TUploadFileManagementRequest {}
interface TUploadFileResponse extends TClientUploadFileResponse, TFile {}

interface IUploadModalProps extends ModalProps {
  onClose: () => void;
  onSubmit: (values: TUploadFileRequest) => Promise<TUploadFileResponse>;
  acceptFile?: string;
}

const UploadModal = ({ onClose, onSubmit, acceptFile, ...rest }: IUploadModalProps) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFinish = async (values: TUploadFileRequest) => {
    setIsLoading(true);
    try {
      const result = await onSubmit(values);
      if (result.id) {
        onClose();
        form.resetFields();
        props.defaultFileList = [];
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBeforeUploadFile = async (file: RcFile) => {
    const validFileType =
      file.type && validateFileType(file.type, !acceptFile ? EAcceptedClientFileType : EAcceptedFileManagementType);
    const validFileSize = file.size && validateSizeImage(file.size, 20);

    if (!validFileType) {
      showErrorToast('This format is not supported');
      form.resetFields(['file']);
      return false;
    }

    if (!validFileSize) {
      showErrorToast('The file should not exceed 20MB');
      form.resetFields(['file']);
      return false;
    }

    return false;
  };

  const props: UploadProps = {
    name: 'file',
    beforeUpload: (file) => handleBeforeUploadFile(file),
    accept: acceptFile ? acceptFile : '.jpg, .jpeg, .png, .gif, .docx, .xlsx, .csv, .pdf',
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    maxCount: 1,
    listType: 'picture',
    defaultFileList: [],
    showUploadList: {
      removeIcon: <XIcon />,
    },
  };

  return (
    <Modal onCancel={onClose} width={370} centered closable={false} footer={null} {...rest} className="UploadModal">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="UploadModal__title">
          <BaseText>Upload a new file</BaseText>
        </div>

        <BaseText type="caption" textAlign="center" className="UploadModal__caption">
          {`Maximum file size: 20MB. Allowed file types: word, excel, csv, jpg, png,${
            acceptFile ? ' mov, mp4,' : ''
          } jpeg, pdf.`}
        </BaseText>
        <div className="UploadModal__body">
          <FormItem
            label="File name"
            name="name"
            rules={[
              { required: true, message: 'Please enter the file name' },
              {
                max: 100,
                message: `Valid file name shouldn't exceed 100 characters`,
              },
              { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the file name' },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            className="ContactHelp__form--upload"
            name="file"
            rules={[{ required: true, message: 'Please choose a file to upload' }]}
          >
            <Upload {...props}>
              <Button icon={<UploadIcon />} className="bt-upload">
                Upload file
              </Button>
            </Upload>
          </FormItem>
          <div className="UploadModal__footer">
            <Button
              onClick={() => {
                onClose();
                form.resetFields();
              }}
              className="button"
            >
              <BaseText>Cancel</BaseText>
            </Button>
            <Button type="primary" htmlType="submit" className="button" loading={isLoading}>
              <BaseText>Submit</BaseText>
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default UploadModal;
