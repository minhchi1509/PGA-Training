import { Form, Modal, ModalProps, Space, TimePicker } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { QuestionModalIcon, TimeIcon } from 'src/assets/icons';
import { FormItem } from 'src/components/forms';
import Select from 'src/components/select';
import { BaseText } from 'src/components/typography';
import './NewAndEditHomeworkModal.scss';
import { TEditHomeworkDefaultValue, TNewHomeworkFormValues } from './new-edit-homework-types';
import Button from 'src/components/button';
import Input from 'src/components/input';
import { HOMEWORK_TYPE_LABEL } from 'src/variables/client';
import { useSelector } from 'react-redux';
import { TRootState } from 'src/stores';
import { EHomeworkType } from 'src/interfaces/clients-interface';
import { TGetHomeworkTopicsResponse } from 'src/interfaces/homework-topics';
import TextArea from 'src/components/input/TextArea';
import { STRING_NOT_ONLY_SPACE_REGEX } from 'src/variables/constants';
import { ConfirmModal } from 'src/components/popup';
import { revertRemindTime } from 'src/utils/txt-utils';
import dayjs from 'dayjs';
import { EHomeworkTopicsAction } from 'src/stores/homework-topics';
import { useTimezoneSelect, allTimezones, ITimezoneOption } from 'react-timezone-select';

interface INewAndEditHomeworkModalProps extends ModalProps {
  onClose: () => void;
  onSubmit: (values: TNewHomeworkFormValues) => void;
  isEdit: boolean;
  defaultValue?: TEditHomeworkDefaultValue;
}

const HOMEWORK_TYPES = [
  {
    label: HOMEWORK_TYPE_LABEL[EHomeworkType.ACTIVITIES],
    value: EHomeworkType.ACTIVITIES,
  },
  {
    label: HOMEWORK_TYPE_LABEL[EHomeworkType.WRITTEN_TASKS],
    value: EHomeworkType.WRITTEN_TASKS,
  },
];

const labelStyle = 'original';
const timezones = {
  ...allTimezones,
  'Europe/Berlin': 'Frankfurt',
};

const NewAndEditHomeworkModal = ({
  onClose,
  onSubmit,
  defaultValue,
  isEdit,
  ...rest
}: INewAndEditHomeworkModalProps) => {
  const FORM_DEFAULT_VALUE: TNewHomeworkFormValues = {
    description: '',
    homeworkTitle: '',
    homeworkType: null,
    reminderTimePeriod: 'AM',
    reminderTime: dayjs('08:00', 'hh:mm'),
    topic: '',
    timezone: 'Australia/Sydney',
  };

  const [form] = Form.useForm<TNewHomeworkFormValues>();
  const [formValues, setFormValues] = useState<TNewHomeworkFormValues>(FORM_DEFAULT_VALUE);
  const [openConfirmUpdateModal, setOpenConfirmUpdateModal] = useState<boolean>(false);

  const { loading } = useSelector((state: TRootState) => ({
    loading: state.loading[EHomeworkTopicsAction.UPDATE_HOMEWORK_BY_ID],
  }));

  const { activityTopics, questionnairesTopics, writtenTasksTopics, videosTopics } = useSelector(
    (state: TRootState) => ({
      activityTopics: state.homeworkTopics.activityTopics,
      questionnairesTopics: state.homeworkTopics.questionnairesTopics,
      writtenTasksTopics: state.homeworkTopics.writtenTasksTopics,
      videosTopics: state.homeworkTopics.videosTopics,
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { options, parseTimezone } = useTimezoneSelect({ labelStyle, timezones });
  const filterTimeZone = options.filter((tz: ITimezoneOption) => Number(tz.offset) >= 0);
  const timeZoneOptions = filterTimeZone.map((tz: ITimezoneOption) => ({ label: tz.label, value: tz.value }));

  const listTopicOptions = useMemo(() => {
    if (formValues.homeworkType) {
      const topics = {
        [EHomeworkType.ACTIVITIES]: activityTopics,
        [EHomeworkType.QUESTIONNAIRES]: questionnairesTopics,
        [EHomeworkType.WRITTEN_TASKS]: writtenTasksTopics,
        [EHomeworkType.VIDEOS]: videosTopics,
      };

      const selectedTopics: TGetHomeworkTopicsResponse = topics[formValues.homeworkType];

      const options = selectedTopics.data.map((topic) => ({
        label: topic.name,
        value: topic.id,
      }));

      return options;
    }
    return [];
  }, [formValues]);

  const handleClose = () => {
    setOpenConfirmUpdateModal(false);
    onClose();
    form.resetFields();
    setFormValues(FORM_DEFAULT_VALUE);
  };

  const handleSubmit = (values: TNewHomeworkFormValues) => {
    onSubmit({
      ...values,
      reminderTimePeriod: dayjs(values.reminderTime).format('A'),
      reminderTime:
        typeof values.reminderTime === 'number'
          ? dayjs(revertRemindTime(values.reminderTime).timeRevert, 'HHmm').format('HHmm')
          : dayjs(values.reminderTime, 'HHmm').format('HHmm'),
    });
    handleClose();
  };

  const onFinish = (values: TNewHomeworkFormValues) => {
    if (isEdit) {
      onOpenConfirmUpdateModal();
    } else {
      handleSubmit(values);
    }
  };

  const onOpenConfirmUpdateModal = () => {
    setOpenConfirmUpdateModal(true);
  };

  const onCloseConfirmUpdateModal = () => {
    setOpenConfirmUpdateModal(false);
  };

  useEffect(() => {
    if (defaultValue) {
      const { homeworkType, topic, homeworkTitle, description, reminderTime, timezone } = defaultValue;
      const revertTime = typeof reminderTime === 'number' ? revertRemindTime(reminderTime) : null;

      form.setFields([
        {
          name: 'homeworkType',
          value: homeworkType,
        },
        {
          name: 'topic',
          value: topic,
        },
        {
          name: 'homeworkTitle',
          value: homeworkTitle,
        },
        {
          name: 'description',
          value: description,
        },
        {
          name: 'reminderTime',
          value: dayjs(revertTime?.timeRevert, 'hh:mm'),
        },
        {
          name: 'reminderTimePeriod',
          value: revertTime ? revertTime.timePeriod : null,
        },
        {
          name: 'timezone',
          value: timezone ? timezone : timeZoneOptions.find((item) => item.value === 'Australia/Sydney'),
        },
      ]);

      setFormValues({
        ...defaultValue,
        reminderTimePeriod: revertTime?.timePeriod || null,
      });
    }
  }, [defaultValue]);

  useEffect(() => {
    if (!defaultValue) form.setFieldValue('topic', '');
  }, [form.getFieldValue('homeworkType')]);

  return (
    <>
      <Modal
        centered
        closable={false}
        footer={null}
        width={370}
        onCancel={handleClose}
        {...rest}
        className="NewHomeworkModal"
      >
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={FORM_DEFAULT_VALUE}
          layout="vertical"
          onValuesChange={(_, values) => setFormValues(values)}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <BaseText type="title" textAlign="center">
              {`${isEdit ? ' Edit homework' : ' Add new homework'}`}
            </BaseText>
            <div className="NewHomework__body">
              <FormItem
                label="Homework type"
                name="homeworkType"
                rules={[{ required: true, message: 'Please select homework type' }]}
                showRequiredMark={false}
              >
                <Select options={HOMEWORK_TYPES} disabled={isEdit} />
              </FormItem>
              <FormItem
                label="Topic"
                name="topic"
                rules={[{ required: true, message: 'Please select topic' }]}
                showRequiredMark={false}
              >
                <Select options={listTopicOptions} disabled={isEdit} />
              </FormItem>
              <FormItem
                label="Homework title"
                name="homeworkTitle"
                rules={[
                  { required: true, message: 'Please enter homework title' },
                  {
                    max: 100,
                    message: `Valid homework title shouldn't exceed 100 characters`,
                  },
                  { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the homework title' },
                ]}
                showRequiredMark={false}
              >
                <Input />
              </FormItem>
              <FormItem
                label="Description"
                name="description"
                rules={[
                  { required: true, message: 'Please enter the description' },
                  {
                    max: 2500,
                    message: `Valid description shouldn't exceed 2500 characters`,
                  },
                  { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the description' },
                ]}
                showRequiredMark={false}
              >
                <TextArea className="NewHomeworkModal__TextArea" />
              </FormItem>

              <div className="NewHomeworkModal__body-time">
                <TimeIcon />
                <BaseText type="caption">Reminder at:</BaseText>
                <div className="NewHomeworkModal__body-hour">
                  <FormItem
                    name="reminderTime"
                    className="NewHomeworkModal__body-hour-select"
                    style={{ width: 112 }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the time',
                      },
                    ]}
                  >
                    <TimePicker format="hh:mm A" use12Hours hideDisabledOptions placeholder="" clearIcon={null} />
                  </FormItem>
                </div>
              </div>
              <FormItem
                label="Time zone"
                name="timezone"
                rules={[{ required: true, message: 'Please select time zone' }]}
                showRequiredMark={false}
              >
                <Select options={timeZoneOptions} placement="topLeft" />
              </FormItem>
            </div>
            <div className="NewHomeworkModal__footer">
              <Button onClick={handleClose} className="button">
                <BaseText>Cancel</BaseText>
              </Button>
              <Button type="primary" htmlType="submit" className="button">
                <BaseText>Save</BaseText>
              </Button>
            </div>
          </Space>
        </Form>
      </Modal>
      <ConfirmModal
        icon={<QuestionModalIcon />}
        titleModal="Do you want to update this homework?"
        onCancelButton={onCloseConfirmUpdateModal}
        onCancel={onCloseConfirmUpdateModal}
        open={openConfirmUpdateModal}
        onsubmit={() => handleSubmit(formValues)}
        loading={loading}
      >
        <BaseText type="body1" textAlign="center" className="ConfirmUpdateModal__body">
          Please kindly note that the updated homework information will be applied to this client from now on
        </BaseText>
      </ConfirmModal>
    </>
  );
};

export default NewAndEditHomeworkModal;
