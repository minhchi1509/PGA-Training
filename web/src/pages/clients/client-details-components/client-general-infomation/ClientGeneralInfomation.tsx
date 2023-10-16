import React, { useEffect, useRef, useState } from 'react';
import { Form, InputRef } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

import './ClientGeneralInfomation.scss';
import Button from 'src/components/button';
import DatePicker from 'src/components/date-picker';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { PhoneNumber } from 'src/components/phone-number';
import Select from 'src/components/select';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import { TClientUpdateInfoRequest } from 'src/interfaces/clients-interface';
import ResponseError from 'src/interfaces/error-response-interface';
import { useAppDispatch } from 'src/stores';
import { updateClientGeneralInfo } from 'src/stores/clients';
import { validatePhoneNumber } from 'src/utils/validate-utils';
import { EProfileStatus, GENDER_OPTIONS } from 'src/variables/common';
import { STRING_NOT_ONLY_SPACE_REGEX } from 'src/variables/constants';

interface ClientGeneralInformation {
  clientId: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  address: string;
  dob?: Date | Dayjs;
  email: string;
  occupational?: string;
  status?: EProfileStatus;
  statusConvert?: EProfileStatus;
}

interface IClientGeneralInformationProps {
  initialValue: ClientGeneralInformation;
}

const ClientGeneralInfomation = (props: IClientGeneralInformationProps) => {
  const dispatch = useAppDispatch();
  const { initialValue } = props;
  const [form] = Form.useForm<TClientUpdateInfoRequest>();
  const phoneNumberInputRef = useRef<InputRef>(null);
  const [initialFormValues, setInitialFormValues] = useState<TClientUpdateInfoRequest>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDisableSubmit, setDisableSubmit] = useState<boolean>(true);
  const cannotChanges = initialValue.statusConvert === EProfileStatus.INACTIVE;

  const handleResetFormData = () => {
    form.resetFields();
    setDisableSubmit(true);
  };

  const onFinish = async (values: TClientUpdateInfoRequest) => {
    setLoading(true);
    try {
      if (values.dob) {
        values.dob = dayjs(values.dob).utc(true).toDate();
      }
      const newValues = { ...initialFormValues, ...values };
      const response = await dispatch(updateClientGeneralInfo(newValues));
      if (response.meta.requestStatus === 'fulfilled') {
        setInitialFormValues(newValues);
        showSuccessToast('Update profile successfully!');
      } else {
        showErrorToast((response.payload as ResponseError).message);
      }
    } catch (error) {
      showErrorToast('Edit profile failed');
      throw error;
    } finally {
      setLoading(false);
      setDisableSubmit(true);
    }
  };

  const handleValuesChange = () => {
    setDisableSubmit(false);
  };

  useEffect(() => {
    form.setFieldsValue(initialValue);
    setInitialFormValues(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const triggerDisplayPhoneNumberInput = async () => {
      phoneNumberInputRef.current?.focus();
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          phoneNumberInputRef.current?.blur();
          resolve();
        }, 5);
      });
    };
    triggerDisplayPhoneNumberInput();
  }, [initialFormValues]);

  return (
    <Form
      name="ClientGeneralInfomationForm"
      className="ClientGeneralInfomationForm"
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={initialFormValues}
      onValuesChange={handleValuesChange}
    >
      <div className="ClientGeneralInfomationForm__title">
        <BaseText type="title">General infomation</BaseText>
      </div>
      <div className="ClientGeneralInfomationForm__row">
        <FormItem label="Title" name="title">
          <Input placeholder="Title" disabled={cannotChanges} />
        </FormItem>
        <FormItem
          label="First Name"
          name="firstName"
          rules={[
            { required: true, message: 'Please enter the first name' },
            { max: 50, message: 'Valid first name shouldn’t exceed 50 characters' },
            { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the first name' },
          ]}
        >
          <Input placeholder="First name" disabled={cannotChanges} />
        </FormItem>
        <FormItem
          label="Last Name"
          name="lastName"
          rules={[
            { required: true, message: 'Please enter the last name' },
            { max: 50, message: 'Valid last name shouldn’t exceed 50 characters' },
            { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the last name' },
          ]}
        >
          <Input placeholder="Last name" disabled={cannotChanges} />
        </FormItem>
      </div>

      <div className="ClientGeneralInfomationForm__row">
        <FormItem
          leftLabel="Age (D.O.B)"
          rightLabel="DD / MM / YYYY"
          name="dob"
          rules={[{ required: true, message: 'Please enter the age' }]}
          required
        >
          <DatePicker
            placeholder="-- / -- / ----"
            disabledDate={(date) => date.isAfter(new Date())}
            disabled={cannotChanges}
          />
        </FormItem>
        <FormItem
          label="Gender"
          name="gender"
          required={true}
          rules={[{ required: true, message: 'Please enter the gender' }]}
        >
          <Select options={GENDER_OPTIONS} placeholder="Gender" disabled={cannotChanges} />
        </FormItem>
        <FormItem
          label="Email"
          name="email"
          normalize={(value) => value.trim()}
          rules={[{ required: true, message: 'Please enter the email' }]}
        >
          <Input placeholder="Email" disabled />
        </FormItem>
      </div>
      <div className="ClientGeneralInfomationForm__row">
        <FormItem
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please enter the phone number' }, { validator: validatePhoneNumber }]}
        >
          <PhoneNumber mask="+61 000 000 000" disabled={cannotChanges} inputRef={phoneNumberInputRef} />
        </FormItem>
        <FormItem
          label="Occupational"
          name="occupation"
          rules={[
            { max: 100, message: 'Valid address shouldn’t exceed 100 characters' },
            { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the address' },
          ]}
        >
          <Input placeholder="Occupational" disabled={cannotChanges} />
        </FormItem>
        <FormItem
          label="Address"
          name="address"
          rules={[
            { required: true, message: 'Please enter the address' },
            { max: 255, message: 'Valid address shouldn’t exceed 255 characters' },
            { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the address' },
          ]}
        >
          <Input placeholder="Address" disabled={cannotChanges} />
        </FormItem>
      </div>

      {cannotChanges ? (
        <></>
      ) : (
        <div className="ClientGeneralInfomationForm__footer">
          <Button type="default" onClick={handleResetFormData} disabled={isDisableSubmit}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} disabled={isDisableSubmit}>
            Save changes
          </Button>
        </div>
      )}
    </Form>
  );
};

export default React.memo(ClientGeneralInfomation);
