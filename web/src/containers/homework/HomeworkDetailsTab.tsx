import { Form, Spin } from 'antd';
import dayjs from 'dayjs';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ITimezoneOption, allTimezones, useTimezoneSelect } from 'react-timezone-select';
import { TimeIcon } from 'src/assets/icons';
import Button from 'src/components/button';
import DatePicker from 'src/components/date-picker';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import Select from 'src/components/select';
import TimePicker from 'src/components/time-picker';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import { TGetAssignedHomeworkDetailsResponse, TUpdateHomeworkDetailsRequest } from 'src/interfaces/clients-interface';
import { TChangeInputEvent } from 'src/interfaces/common-interface';
import { TTimePeriodFormValues } from 'src/pages/homework/components/time-period/time-period-types';
import { TRootState, useAppDispatch } from 'src/stores';
import { EClientsAction, updateHomeworkDetailsAction } from 'src/stores/clients';
import { DAY_OPTIONS, EProfileStatus, FREQUENCY_OPTIONS, REPEAT_NUMBERS, REPEAT_TYPES } from 'src/variables/common';
import { EDayOfWeek, EFrequencyType, EHomeworkStatus, ERepeatDurationType } from 'src/variables/enum-variables';
import './HomeworkDetailsTab.scss';
import HomeworkInfo from './HomeworkInfo';

const labelStyle = 'original';
const timezones = {
  ...allTimezones,
  'Europe/Berlin': 'Frankfurt',
};

interface IProps {
  clientId?: string;
  homeworkDetails?: TGetAssignedHomeworkDetailsResponse;
  onUpdateSuccess: () => void;
}

const HomeworkDetailsTab = ({ clientId, homeworkDetails, onUpdateSuccess }: IProps) => {
  const dispatch = useAppDispatch();
  const homeworkInfo = homeworkDetails?.homework;
  const [form] = Form.useForm<TTimePeriodFormValues>();
  const [isDisableButton, setDisableButton] = useState<boolean>(true);

  const frequency = Form.useWatch('frequency', form);
  const dayOfWeek = Form.useWatch('dayOfWeek', form);
  const repeatDuration = Form.useWatch('repeatDuration', form);
  const endAfter = Form.useWatch('endAfter', form);
  const endDate = Form.useWatch('endDate', form);
  const { updating, clientInfo, loadingHomeworkDetails } = useSelector((state: TRootState) => ({
    updating: state.loading[EClientsAction.UPDATE_HOMEWORK_DETAILS],
    clientInfo: state.clients.clientInfo,
    loadingHomeworkDetails: state.loading[EClientsAction.GET_ASSIGNED_HOMEWORK_DETAILS],
  }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { options, parseTimezone } = useTimezoneSelect({ labelStyle, timezones });
  const filterTimeZone = options.filter((tz: ITimezoneOption) => Number(tz.offset) >= 0);
  const timeZoneOptions = filterTimeZone.map((tz: ITimezoneOption) => ({ label: tz.label, value: tz.value }));

  const profileStatusAction = () => {
    const stt = clientInfo?.statusConvert as EProfileStatus;
    if ([EProfileStatus.ACTIVE, EProfileStatus.PENDING].includes(stt)) {
      return true;
    }
    return false;
  };

  const hideAction = homeworkDetails?.status !== EHomeworkStatus.ACTIVE || !profileStatusAction();

  const handleSelectDayOfWeek = (value: EDayOfWeek) => {
    let newDayOfWeek = [];
    if (!dayOfWeek) {
      newDayOfWeek = [value];
    } else if (!dayOfWeek.includes(value)) {
      newDayOfWeek = [...dayOfWeek, value];
    } else {
      newDayOfWeek = dayOfWeek.filter((day: string) => day !== value);
    }

    form.setFieldValue('dayOfWeek', newDayOfWeek);
    setDisableButton(false);
  };

  const validateEndDateForm = () => {
    if (endAfter || endDate) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Please select times or end date'));
    }
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChangeFormValues = (_values: TTimePeriodFormValues) => {
    setDisableButton(false);
  };

  const handleResetFormData = () => {
    form.resetFields();
    setDisableButton(true);
  };

  const handleSubmit = async (values: TTimePeriodFormValues) => {
    //TODO: Update function save homework detail
    if (homeworkDetails) {
      setDisableButton;
      const bodyRequest: TUpdateHomeworkDetailsRequest = {
        id: homeworkDetails?.id,
        clientId: clientId ?? '',
        assignHomeworkUpdate: {
          homeworkId: homeworkDetails?.homework?.id,
          frequency: values.frequency,
          startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
          reminderAt: {
            time: dayjs(values.reminderTime).format('hh:mm'),
            period: dayjs(values.reminderTime).format('A'),
          },
          dayOfWeek: values.dayOfWeek,
          endType: {
            ...(values.endAfter && { afterTimes: Number(values.endAfter) }),
            ...(values.endDate && { expiredDate: dayjs(values.endDate).toISOString() }),
          },
          repeatEvery: values.repeatEvery,
          repeatDuration: values.repeatDuration,
          timezone: values.timezone,
        },
        timezone: values.timezone,
      };

      const { payload: response } = await dispatch(updateHomeworkDetailsAction(bodyRequest));

      if (response.homeworkAssignId) {
        setDisableButton(true);
        showSuccessToast('Update homework details successfully!');
        onUpdateSuccess();
        return;
      }

      showErrorToast('Update homework details failed!');
    }
  };

  const fillFormValues = (homeworkDetails?: TGetAssignedHomeworkDetailsResponse) => {
    if (homeworkDetails) {
      const formValues = {
        frequency: homeworkDetails.frequency,
        // reminderTime: convertReminderTimeToDate(homeworkDetails.reminderAt.time),
        reminderTime: dayjs(`${homeworkDetails.reminderAt.time} ${homeworkDetails.reminderAt.period}`, 'hh:mm A'),
        reminderTimePeriod: homeworkDetails.reminderAt.period,
        dayOfWeek: homeworkDetails.dayOfWeek,
        startDate: dayjs(homeworkDetails.startDate),
        endAfter: homeworkDetails.endType.afterTimes,
        endDate: homeworkDetails.endType.expiredDate ? dayjs(homeworkDetails.endType.expiredDate) : undefined,
        repeatEvery: homeworkDetails.repeatEvery,
        repeatDuration: homeworkDetails.repeatDuration,
        timezone: homeworkDetails.timezone,
      };
      form.setFieldsValue(formValues);
    }
  };

  useEffect(() => {
    fillFormValues(homeworkDetails);
  }, [homeworkDetails]);

  return (
    <div className="HomeworkDetailsTab">
      {loadingHomeworkDetails ? (
        <Spin spinning />
      ) : (
        <>
          <HomeworkInfo homework={homeworkInfo} />

          <Form
            form={form}
            layout="vertical"
            disabled={hideAction}
            className="HomeworkDetailsTab__form"
            onFinish={handleSubmit}
            onValuesChange={handleChangeFormValues}
          >
            <div className="HomeworkDetailsTab__form-content">
              <div className="HomeworkDetailsTab__form-content--row">
                <div className="HomeworkDetailsTab__form-content--col">
                  <BaseText type="subHeading" className="HomeworkDetailsTab__form-content--formTitle">
                    Frequency
                  </BaseText>
                  <FormItem name="frequency" rules={[{ required: true, message: 'Please select frequency' }]}>
                    <Select options={FREQUENCY_OPTIONS} placeholder="Frequency" />
                  </FormItem>
                </div>
                <div className="HomeworkDetailsTab__form-content--col">
                  <div className="HomeworkDetailsTab__form-content--formTitle" />
                  <div className="HomeworkDetailsTab__form-content--reminder">
                    <TimeIcon />
                    <BaseText type="caption">Reminder at:</BaseText>
                    <FormItem name="reminderTime" rules={[{ required: true, message: 'Please enter the time' }]}>
                      <TimePicker format="hh:mm A" hideDisabledOptions placeholder="" clearIcon={null} />
                    </FormItem>
                  </div>
                </div>
              </div>

              <div className="HomeworkDetailsTab__form-content--row">
                {frequency === EFrequencyType.CUSTOM && (
                  <div className="HomeworkDetailsTab__form-content--col">
                    <BaseText type="subHeading" className="HomeworkDetailsTab__form-content--formTitle">
                      Repeat every
                    </BaseText>
                    <div className="HomeworkDetailsTab__form-content--repeat">
                      <FormItem name="repeatEvery" rules={[{ required: true, message: 'Please select repeat time' }]}>
                        <Select options={REPEAT_NUMBERS} />
                      </FormItem>
                      <FormItem
                        name="repeatDuration"
                        rules={[{ required: true, message: 'Please select repeat duration' }]}
                      >
                        <Select options={REPEAT_TYPES} />
                      </FormItem>
                    </div>
                  </div>
                )}
                {frequency !== EFrequencyType.CUSTOM && (
                  <div className="HomeworkDetailsTab__form-content--col">
                    <BaseText type="subHeading" className="HomeworkDetailsTab__form-content--formTitle">
                      Date
                    </BaseText>
                    <FormItem
                      name="startDate"
                      rules={[{ type: 'object' as const, required: true, message: 'Please select start date' }]}
                    >
                      <DatePicker
                        placeholder="-- / -- / ----"
                        format="DD/MM/YYYY"
                        disabledDate={(date) => date && date < dayjs().startOf('day')}
                      />
                    </FormItem>
                  </div>
                )}
                <div className="HomeworkDetailsTab__form-content--col">
                  <BaseText type="subHeading" className="HomeworkDetailsTab__form-content--formTitle">
                    Time zone
                  </BaseText>
                  <FormItem
                    name="timezone"
                    rules={[{ required: true, message: 'Please select time zone' }]}
                    showRequiredMark={false}
                    style={{ width: '330px' }}
                  >
                    <Select options={timeZoneOptions} />
                  </FormItem>
                </div>
              </div>

              {frequency === EFrequencyType.CUSTOM && (
                <div className="HomeworkDetailsTab__form-content--row">
                  <div className="HomeworkDetailsTab__form-content--col">
                    {repeatDuration === ERepeatDurationType.WEEK && (
                      <>
                        <BaseText type="caption" className="HomeworkDetailsTab__form-content--formTitle">
                          Days
                        </BaseText>
                        <FormItem
                          name="dayOfWeek"
                          rules={[{ required: true, message: 'Please select at least 1 day of the week' }]}
                          validateTrigger="onClick"
                        >
                          <div className="HomeworkDetailsTab__form-content--dayOfWeek">
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
                      </>
                    )}
                  </div>

                  <div className="HomeworkDetailsTab__form-content--col-2">
                    <div>
                      <BaseText type="subHeading" className="HomeworkDetailsTab__form-content--formTitle">
                        {frequency === EFrequencyType.CUSTOM ? 'Start date' : 'Date'}
                      </BaseText>
                      <FormItem
                        name="startDate"
                        rules={[{ type: 'object' as const, required: true, message: 'Please select start date' }]}
                      >
                        <DatePicker
                          placeholder="-- / -- / ----"
                          format="DD/MM/YYYY"
                          disabledDate={(date) => date && date < dayjs().startOf('day')}
                        />
                      </FormItem>
                    </div>
                    <div>
                      <BaseText type="subHeading" className="HomeworkDetailsTab__form-content--formTitle">
                        Ends
                      </BaseText>
                      <div className="HomeworkDetailsTab__form-content--endDate">
                        <BaseText type="caption">After</BaseText>
                        <FormItem
                          name="endAfter"
                          rules={[{ validator: validateEndDateForm }]}
                          className="HomeworkDetailsTab__form-content--endDate-timePicker"
                        >
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
                          rules={[{ validator: validateEndDateForm }]}
                          className="HomeworkDetailsTab__form-content--endDate-datePicker"
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
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!hideAction && (
              <div className="HomeworkDetailsTab__footer">
                <Button size="large" disabled={isDisableButton} onClick={handleResetFormData}>
                  <BaseText>Cancel</BaseText>
                </Button>
                <Button type="primary" size="large" htmlType="submit" disabled={isDisableButton} loading={updating}>
                  <BaseText>Save changes</BaseText>
                </Button>
              </div>
            )}
          </Form>
        </>
      )}
    </div>
  );
};

export default HomeworkDetailsTab;
