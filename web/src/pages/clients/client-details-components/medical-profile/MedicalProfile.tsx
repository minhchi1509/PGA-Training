import { Form, InputRef, Spin } from 'antd';
import dayjs from 'dayjs';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import './MedicalProfile.scss';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { STRING_NOT_ONLY_SPACE_REGEX } from 'src/variables/constants';
import TextArea from 'src/components/input/TextArea';
import { BaseText } from 'src/components/typography';
import DatePicker from 'src/components/date-picker';
import { PhoneNumber } from 'src/components/phone-number';
import Button from 'src/components/button';
import { TMedicalProfileRequest } from 'src/interfaces/clients-interface';
import { useAppDispatch } from 'src/stores';
import { EProfileStatus } from 'src/variables/common';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { validateDrProviderNumber, validatePhoneNumber } from 'src/utils/validate-utils';
import { getClientMedicalInfo, updateClientMedicalInfo } from 'src/stores/clients/clients-actions';

interface IMedicalProfileProps {
  status?: EProfileStatus;
}

const MedicalProfile: FC<IMedicalProfileProps> = ({ status }) => {
  const dispatch = useAppDispatch();
  const phoneNumberInputRef = useRef<InputRef>(null);
  const param = useParams();
  const clientId = param.clientId as string;
  const [form] = Form.useForm<TMedicalProfileRequest>();
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);
  const [isGettingClientMedicalProfile, setIsGettingClientMedicalProfile] = useState<boolean>(false);
  const [initialFormValues, setInitialFormValues] = useState<TMedicalProfileRequest | object>({});
  const [isDisableSubmit, setDisableSubmit] = useState<boolean>(true);
  const cannotChanges = status === EProfileStatus.INACTIVE;

  const getClientMedicalProfile = async () => {
    setIsGettingClientMedicalProfile(true);
    const result = await dispatch(getClientMedicalInfo(clientId));
    const data = result.payload as TMedicalProfileRequest;
    const formValue = {
      drAddress: data.drAddress,
      diagnosis: data.diagnosis,
      ...(data.lastEngagement && { lastEngagement: dayjs(data.lastEngagement).toDate() }),
      history: data.history,
      medication: data.medication,
      drName: data.drName,
      drProvideNumber: data.drProvideNumber,
      emergencyContactName: data.emergencyContactName,
      emergencyContactRelationship: data.emergencyContactRelationship,
      emergencyContactPhone: data.emergencyContactPhone,
    };
    form.setFieldsValue(formValue);
    setInitialFormValues(formValue);
    phoneNumberInputRef.current?.focus();
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        phoneNumberInputRef.current?.blur();
        resolve();
      }, 5);
    });
    setIsGettingClientMedicalProfile(false);
  };

  const handleResetFormData = () => {
    form.resetFields();
    setDisableSubmit(true);
  };

  const handleValuesChange = () => {
    setDisableSubmit(false);
  };

  const onFinish = async (values: TMedicalProfileRequest) => {
    setIsSubmittingForm(true);
    try {
      values.clientId = clientId;
      if (values.lastEngagement) {
        values.lastEngagement = dayjs(values.lastEngagement).utc(true).toDate();
      }
      const newValues = { ...values };
      const result = unwrapResult(await dispatch(updateClientMedicalInfo(newValues)));
      if (result.success) {
        showSuccessToast('Update medical profile successfully!');
        setInitialFormValues(newValues);
      } else {
        showErrorToast(result.message);
      }
    } catch (error) {
      showErrorToast('Edit medical profile failed');
      throw error;
    } finally {
      setIsSubmittingForm(false);
      setDisableSubmit(true);
    }
  };

  useEffect(() => {
    getClientMedicalProfile();
  }, [status]);

  useEffect(() => {
    form.resetFields();
  }, [initialFormValues]);

  return (
    <Form
      name="MedicalProfileForm"
      className="MedicalProfile"
      onFinish={onFinish}
      form={form}
      layout="vertical"
      initialValues={initialFormValues}
      onValuesChange={handleValuesChange}
    >
      {isGettingClientMedicalProfile ? (
        <Spin className="MedicalProfile__loading" />
      ) : (
        <>
          <div className="content">
            <div className="history">
              <div className="history__title">
                <BaseText type="title">Medical history</BaseText>
              </div>
              <div className="history-row">
                <FormItem
                  label="Dr's Name"
                  name="drName"
                  showRequiredMark={false}
                  rules={[{ max: 100, message: 'Valid  name shouldn’t exceed 100 characters' }]}
                >
                  <Input disabled={cannotChanges} />
                </FormItem>
                <FormItem
                  label="Dr's Provider Number"
                  name="drProvideNumber"
                  showRequiredMark={false}
                  rules={[{ validator: validateDrProviderNumber }]}
                >
                  <Input disabled={cannotChanges} />
                </FormItem>
              </div>
              <div>
                <FormItem
                  label="Dr's Address"
                  name="drAddress"
                  showRequiredMark={false}
                  rules={[{ max: 255, message: 'Valid address shouldn’t exceed 255 characters' }]}
                >
                  <Input disabled={cannotChanges} />
                </FormItem>
              </div>
              <div>
                <FormItem
                  label="Medications"
                  name="medication"
                  showRequiredMark={false}
                  rules={[
                    {
                      max: 1000,
                      message: `Valid medications shouldn't exceed 1000 characters`,
                    },
                  ]}
                >
                  <TextArea className="area-input" disabled={cannotChanges} />
                </FormItem>
              </div>
              <div>
                <FormItem
                  label="Current Diagnoses"
                  name="diagnosis"
                  showRequiredMark={false}
                  rules={[
                    {
                      max: 1000,
                      message: `Valid diagnosis shouldn't exceed 1000 characters`,
                    },
                  ]}
                >
                  <TextArea className="area-input" disabled={cannotChanges} />
                </FormItem>
              </div>
              <div>
                <FormItem
                  label="History (further information)"
                  name="history"
                  showRequiredMark={false}
                  rules={[
                    {
                      max: 1000,
                      message: `Valid history shouldn't exceed 1000 characters`,
                    },
                  ]}
                >
                  <TextArea className="area-input" disabled={cannotChanges} />
                </FormItem>
              </div>
            </div>
            <div className="engagement">
              <div className="engagement__title">
                <BaseText type="title">Last engagement</BaseText>
              </div>
              <div>
                <FormItem
                  leftLabel="Last engagement"
                  rightLabel="DD / MM / YYYY"
                  name="lastEngagement"
                  valuePropName="lastEngagement"
                  normalize={(date) => date && date.format('MM/DD/YYYY')}
                >
                  <DatePicker
                    placeholder="-- / -- / ----"
                    disabledDate={(date) => date.isAfter(new Date())}
                    {...(form.getFieldValue('lastEngagement') && {
                      defaultValue: dayjs(form.getFieldValue('lastEngagement')),
                    })}
                    disabled={cannotChanges}
                  />
                </FormItem>
              </div>
              <div className="engagement__title">
                <BaseText type="title">Emergency contact</BaseText>
              </div>
              <div>
                <FormItem
                  label="Full name"
                  name="emergencyContactName"
                  rules={[
                    { required: true, message: 'Please enter the full name' },
                    { max: 100, message: 'Valid full name shouldn’t exceed 100 characters' },
                    { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the full name' },
                  ]}
                >
                  <Input disabled={cannotChanges} />
                </FormItem>
              </div>
              <div className="history-row">
                <FormItem
                  label="Relationship"
                  name="emergencyContactRelationship"
                  showRequiredMark={false}
                  rules={[
                    { max: 100, message: 'Valid relationship shouldn’t exceed 100 characters' },
                    { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the relationship' },
                  ]}
                >
                  <Input disabled={cannotChanges} />
                </FormItem>
                <FormItem
                  label="Phone number"
                  name="emergencyContactPhone"
                  rules={[{ required: true, message: 'Please enter phone number' }, { validator: validatePhoneNumber }]}
                >
                  <PhoneNumber mask="+61 000 000 000" disabled={cannotChanges} inputRef={phoneNumberInputRef} />
                </FormItem>
              </div>
            </div>
          </div>
          {cannotChanges ? (
            <></>
          ) : (
            <div className="footer">
              <Button type="default" onClick={handleResetFormData} disabled={isDisableSubmit}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isSubmittingForm} disabled={isDisableSubmit}>
                Save changes
              </Button>
            </div>
          )}
        </>
      )}
    </Form>
  );
};

export default React.memo(MedicalProfile);
