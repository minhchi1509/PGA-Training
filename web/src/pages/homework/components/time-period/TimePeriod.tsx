import { Button, DatePicker, Form, Modal, ModalProps, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { ITimezoneOption, allTimezones, useTimezoneSelect } from 'react-timezone-select';
import { TimeIcon } from 'src/assets/icons';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import Select from 'src/components/select';
import { BaseText } from 'src/components/typography';
import { THomework } from 'src/interfaces/clients-interface';
import { TChangeInputEvent } from 'src/interfaces/common-interface';
import { DAY_OPTIONS, FREQUENCY_OPTIONS, REPEAT_NUMBERS, REPEAT_TYPES } from 'src/variables/common';
import {
  EDayOfWeek,
  EDisplayDayOfWeek,
  EFrequencyType,
  ERepeatDurationType,
  ETimePeriod,
} from 'src/variables/enum-variables';
import './TimePeriod.scss';
import { TTimePeriodFormValues } from './time-period-types';

interface ITimePeriodProps extends ModalProps {
  selectedTask?: THomework;
  formValues?: TTimePeriodFormValues;
  onClose: () => void;
  onSubmit: (values: TTimePeriodFormValues) => void;
}

const initialValues: TTimePeriodFormValues = {
  frequency: EFrequencyType.ASSIGN_ONE,
  reminderTime: '',
  reminderTimePeriod: '',
  startDate: dayjs(new Date()),
  dayOfWeek: [],
  endAfter: 1,
  endDate: undefined,
  repeatDuration: ERepeatDurationType.DAY,
  repeatEvery: 1,
  timezone: 'Australia/Sydney',
};

const labelStyle = 'original';
const timezones = {
  ...allTimezones,
  'Europe/Berlin': 'Frankfurt',
};

const TimePeriod = (props: ITimePeriodProps) => {
  const [form] = Form.useForm<TTimePeriodFormValues>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState({});
  const { selectedTask, formValues: existedValues, onClose, onSubmit, ...rest } = props;
  const values = form.getFieldsValue();
  const startDate = Form.useWatch('startDate', form);
  const frequency = Form.useWatch('frequency', form);
  const dayOfWeek = Form.useWatch('dayOfWeek', form);
  const repeatDuration = Form.useWatch('repeatDuration', form);
  const repeatEvery = Form.useWatch('repeatEvery', form);
  const endAfter = Form.useWatch('endAfter', form);
  const endDate = Form.useWatch('endDate', form);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { options, parseTimezone } = useTimezoneSelect({ labelStyle, timezones });
  const filterTimeZone = options.filter((tz: ITimezoneOption) => Number(tz.offset) >= 0);
  const timeZoneOptions = filterTimeZone.map((tz: ITimezoneOption) => ({ label: tz.label, value: tz.value }));

  const summary = useMemo(() => {
    // update logic check field touch when frequency type = custom
    const isTouched = form.isFieldsTouched(['startDate', 'frequency', 'reminderTime', 'reminderTimePeriod']);
    const existedDate = !isTouched && existedValues?.startDate ? existedValues?.startDate : values.startDate;

    if (existedDate) return dayjs(existedDate).format('MMM DD YYYY');
    if (!isTouched) return dayjs(new Date()).format('MMM DD YYYY');
    return '';
  }, [values]);

  const validateEndDateForm = () => {
    const endAfter = form.getFieldValue('endAfter');
    const endDate = form.getFieldValue('endDate');

    if (endAfter || endDate) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Please select times or end date'));
    }
  };

  const validateStartDateForm = () => {
    const startDate = form.getFieldValue('startDate');
    const endDate = form.getFieldValue('endDate');

    if (startDate && endDate && dayjs(startDate).isAfter(endDate)) {
      return Promise.reject(new Error('Start date can not  greater than end date!'));
    } else {
      return Promise.resolve();
    }
  };

  const handleSelectDayOfWeek = (value: EDayOfWeek) => {
    const dayOfWeek = form.getFieldValue('dayOfWeek');
    let newdayOfWeek = [];
    if (!dayOfWeek) {
      newdayOfWeek = [value];
    } else if (!dayOfWeek.includes(value)) {
      newdayOfWeek = [...dayOfWeek, value];
    } else {
      newdayOfWeek = dayOfWeek.filter((day: string) => day !== value);
    }

    form.setFieldValue('dayOfWeek', newdayOfWeek);
  };

  const renderSummary = () => {
    if (frequency === EFrequencyType.ASSIGN_ONE) {
      return <BaseText type="caption">Once time on {summary}</BaseText>;
    }
    const formatDayOfWeek = dayOfWeek && dayOfWeek.map((day) => EDisplayDayOfWeek[day]);
    return (
      <BaseText type="caption">
        Every{' '}
        {repeatDuration === ERepeatDurationType.DAY
          ? `${repeatEvery && repeatEvery > 1 ? repeatEvery + ' days' : 'day'}`
          : `${repeatEvery && repeatEvery > 1 ? repeatEvery + ' weeks' : 'week'}`}{' '}
        {repeatDuration === ERepeatDurationType.WEEK ? `on ${formatDayOfWeek && formatDayOfWeek?.join(', ')}` : ''}{' '}
        {endAfter
          ? ` for ${endAfter} times from ${dayjs(startDate).format('MMM DD YYYY')}`
          : ` from ${dayjs(startDate).format('MMM DD YYYY')} to ${dayjs(endDate).format('MMM DD YYYY')}`}
      </BaseText>
    );
  };

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  const handleChangeEndDate = (value: dayjs.Dayjs | null) => {
    form.setFieldValue('endDate', value);
    form.setFieldValue('endAfter', undefined);
    form.validateFields(['endAfter', 'endDate']);
  };

  const handleChangeEndTimes = (event: TChangeInputEvent) => {
    form.setFieldValue('endDate', undefined);
    form.setFieldValue('endAfter', event.target.value);
    form.validateFields(['endAfter', 'endDate']);
  };

  const handleChangeStartDate = (value: dayjs.Dayjs | null) => {
    form.setFieldValue('startDate', value);
    form.validateFields(['startDate', 'endDate']);
  };

  const handleSubmit = (values: TTimePeriodFormValues) => {
    onSubmit(values);
    handleClose();
  };

  useEffect(() => {
    if (existedValues) {
      form.setFieldsValue(existedValues);
      return;
    }
    if (selectedTask && !existedValues && rest.open) {
      form.setFields([
        // { name: 'reminderTime', value: convertReminderTimeToDate(selectedTask.reminderAtFormat?.time ?? '') },
        {
          name: 'reminderTime',
          value: dayjs(`${selectedTask.reminderAtFormat?.time} ${selectedTask.reminderAtFormat?.period}`, 'hh:mm A'),
        },
        { name: 'reminderTimePeriod', value: selectedTask?.reminderAtFormat?.period ?? ETimePeriod.AM },
        { name: 'timezone', value: selectedTask?.timezone },
      ]);
    }
  }, [existedValues, selectedTask, rest.open]);

  return (
    <Modal
      className="TimePeriod__modal"
      centered
      closable={false}
      footer={null}
      width={370}
      onCancel={handleClose}
      {...rest}
    >
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
        layout="vertical"
        onValuesChange={(value) => setFormValues(value)}
        className="TimePeriod__form"
      >
        <BaseText type="title" textAlign="center">
          {selectedTask?.title}
        </BaseText>
        <div className="TimePeriod__body">
          <FormItem
            label="Frequency"
            name="frequency"
            showRequiredMark={false}
            rules={[{ required: true, message: 'Please select frequency' }]}
          >
            <Select options={FREQUENCY_OPTIONS} placeholder="Frequency" />
          </FormItem>
          {frequency === EFrequencyType.CUSTOM && (
            <>
              <div className="TimePeriod__body-repeatForm">
                <FormItem name="repeatEvery" label="Repeat every">
                  <Select options={REPEAT_NUMBERS} />
                </FormItem>
                <FormItem name="repeatDuration" label=" ">
                  <Select options={REPEAT_TYPES} />
                </FormItem>
              </div>
              {repeatDuration !== ERepeatDurationType.DAY && (
                <FormItem
                  label="Days"
                  name="dayOfWeek"
                  showRequiredMark={false}
                  rules={[{ required: true, message: 'Please select at least 1 day of the week' }]}
                  validateTrigger="onClick"
                >
                  <div className="TimePeriod__body-dayOfWeekForm">
                    {DAY_OPTIONS.map((option) => (
                      <Button
                        size="small"
                        type={dayOfWeek?.includes(option.value as EDayOfWeek) ? 'primary' : 'default'}
                        key={option.value}
                        onClick={() => handleSelectDayOfWeek(option.value as EDayOfWeek)}
                      >
                        <BaseText type="x-small">{option.label}</BaseText>
                      </Button>
                    ))}
                  </div>
                </FormItem>
              )}
            </>
          )}
          {frequency === EFrequencyType.CUSTOM && <BaseText type="subHeading">Start date</BaseText>}
          <FormItem
            leftLabel={frequency === EFrequencyType.CUSTOM ? '' : 'Date'}
            showRequiredMark={false}
            name="startDate"
            className="TimePeriod__time-picker"
            rules={[
              { type: 'object' as const, required: true, message: 'Please select start date' },
              { validator: validateStartDateForm },
            ]}
          >
            <DatePicker
              placeholder="-- / -- / ----"
              format="DD/MM/YYYY"
              disabledDate={(date) => date && date < dayjs().startOf('day')}
              onChange={handleChangeStartDate}
            />
          </FormItem>
          {frequency === EFrequencyType.CUSTOM && (
            <>
              <BaseText type="subHeading">End date</BaseText>
              <div className="TimePeriod__body-endTimeForm">
                <BaseText type="caption">After</BaseText>
                <FormItem name="endAfter" rules={[{ validator: validateEndDateForm }]}>
                  <Input
                    type="number"
                    min={1}
                    onChange={handleChangeEndTimes}
                    suffix={
                      <BaseText type="small" className="suffix-text">
                        times
                      </BaseText>
                    }
                  />
                </FormItem>

                <BaseText type="caption">Or</BaseText>
                <FormItem
                  name="endDate"
                  className="TimePeriod__time-picker"
                  rules={[{ validator: validateEndDateForm }]}
                >
                  <DatePicker
                    placeholder="-- / -- / ----"
                    format="DD/MM/YYYY"
                    allowClear={false}
                    disabledDate={(date) => date && date < form.getFieldValue('startDate')}
                    onChange={handleChangeEndDate}
                  />
                </FormItem>
              </div>
            </>
          )}
          <div className="TimePeriod__body-time">
            <div className="caption">
              <TimeIcon />
              <BaseText type="caption">Reminder at :</BaseText>
            </div>
            <div className="TimePeriod__body-hour">
              <FormItem
                name="reminderTime"
                className="TimePeriod__body-hour-select"
                style={{ width: 107 }}
                rules={[
                  {
                    required: true,
                    message: 'Please enter the time',
                  },
                ]}
              >
                <TimePicker format="hh:mm A" hideDisabledOptions placeholder="" clearIcon={null} />
              </FormItem>
            </div>
          </div>
          <FormItem
            label="Time zone"
            name="timezone"
            rules={[{ required: true, message: 'Please select time zone' }]}
            showRequiredMark={false}
          >
            <Select options={timeZoneOptions} placement="topLeft" defaultValue={'Australia/Sydney'} />
          </FormItem>
          {summary ? (
            <div className="TimePeriod__summary">
              <BaseText type="subHeading">Summary</BaseText>
              <div className="TimePeriod__summary-text">{renderSummary()}</div>
            </div>
          ) : null}
        </div>
        <div className="TimePeriod__footer">
          <Button type="primary" size="large" htmlType="submit" className={`button`}>
            <BaseText>Add</BaseText>
          </Button>
          <Button onClick={handleClose} size="large" className={`button`}>
            <BaseText>Cancel</BaseText>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TimePeriod;
