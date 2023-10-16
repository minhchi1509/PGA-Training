import { unwrapResult } from '@reduxjs/toolkit';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from 'src/components/button';
import DatePicker from 'src/components/date-picker';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { PhoneNumber } from 'src/components/phone-number';
import Select from 'src/components/select';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { TSelectOption } from 'src/interfaces/common-interface';
import { TPractitionersProfileRequest } from 'src/interfaces/practitioners-interface';
import { useAppDispatch } from 'src/stores';
import { updateProPractitioners } from 'src/stores/practitioners/practitioners-actions';
import { getPractitionerProfileById, getPractitionerTypes } from 'src/stores/profile';
import { validatePhoneNumber } from 'src/utils/validate-utils';
import { EProfileStatus, TITLE_OPTIONS } from 'src/variables/common';
import { STRING_NOT_ONLY_SPACE_REGEX } from 'src/variables/constants';
import './GeneralInfomation.scss';

const GeneralInfomation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const param = useParams();
  const practitionerProfileId = param.practitionerId as string;
  const [form] = Form.useForm<TPractitionersProfileRequest>();
  const [practitionerTypes, setPractitionerTypes] = useState<TSelectOption[]>([]);
  const [isShowOtherType, setIsShowOtherType] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDisableSubmit, setDisableSubmit] = useState<boolean>(true);
  const [initialFormValues, setInitialFormValues] = useState<TPractitionersProfileRequest>();
  const [loading, setLoading] = useState<boolean>(false);

  const getPractitionerProfile = async () => {
    const result = await dispatch(getPractitionerProfileById(practitionerProfileId));
    const data = result.payload as TPractitionersProfileRequest;
    const formValue = {
      title: data.title,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
      role: data.role,
      ...(data.dob && { dob: dayjs(data.dob).toDate() }),
      provideNumber: data.provideNumber,
      practitionerType: data.practitionerTypeId ? data.practitionerTypeId : '',
      practitionerTypeOther: data.practitionerTypeOther || '',
      practitionerId: data.practitionerId,
      email: data.email,
      status: data.status,
    };

    form.setFieldsValue(formValue);
    setInitialFormValues(formValue);
  };

  useEffect(() => {
    if (initialFormValues?.practitionerType && practitionerTypes) {
      const isSelectedOther = practitionerTypes.some(
        (type) => type.value === initialFormValues.practitionerType && type.label === 'Other',
      );
      if (isSelectedOther !== isShowOtherType) {
        setIsShowOtherType(isSelectedOther);
      }
    }
  }, [initialFormValues, practitionerTypes]);

  const handleChangePractitionerType = (value: string) => {
    const isSelectedOther = practitionerTypes.some((type) => type.value === value && type.label === 'Other');
    if (isSelectedOther !== isShowOtherType) {
      setIsShowOtherType(isSelectedOther);
    }
  };

  const handleResetFormData = () => {
    form.resetFields();
    setDisableSubmit(true);
  };

  const fetchPractitionerTypes = async () => {
    const types = await dispatch(getPractitionerTypes());
    const practitionerTypes = types.payload.data.map((type: { id: string; name: string }) => ({
      value: type.id,
      label: type.name,
    }));

    setPractitionerTypes(practitionerTypes);
  };

  const handleValuesChange = (values: TPractitionersProfileRequest) => {
    const key = Object.keys(values)[0];
    if (initialFormValues && isEqual(values[key], initialFormValues[key])) {
      setDisableSubmit(true);
    } else {
      setDisableSubmit(false);
    }
  };

  const onFinish = async (values: TPractitionersProfileRequest) => {
    setLoading(true);
    try {
      values.practitionerId = practitionerProfileId;
      if (values.dob) {
        values.dob = dayjs(values.dob).utc(true).toDate();
      }
      unwrapResult(await dispatch(updateProPractitioners({ ...initialFormValues, ...values })));
      showSuccessToast('Update profile successfully!');
    } catch (error) {
      showErrorToast('Update Failed');
      throw error;
    } finally {
      navigate(-1);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPractitionerProfile();
    fetchPractitionerTypes();
  }, [practitionerProfileId]);

  useEffect(() => form.resetFields(), [initialFormValues]);

  return (
    <Form
      name="GeneralInfomationForm"
      className="GeneralInfomationForm"
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={initialFormValues}
      onValuesChange={handleValuesChange}
    >
      <div className="GeneralInfomationForm__row">
        <FormItem label="Title" name="title">
          <Select
            options={TITLE_OPTIONS}
            placeholder="Title"
            disabled={EProfileStatus.INACTIVE === initialFormValues?.status}
          />
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
          <Input placeholder="First name" disabled={EProfileStatus.INACTIVE === initialFormValues?.status} />
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
          <Input placeholder="Last name" disabled={EProfileStatus.INACTIVE === initialFormValues?.status} />
        </FormItem>
      </div>

      <div className="GeneralInfomationForm__row">
        <FormItem
          leftLabel="Age (D.O.B)"
          rightLabel="DD / MM / YYYY"
          name="dob"
          valuePropName="dob"
          normalize={(date) => date && date.format('MM/DD/YYYY')}
        >
          <DatePicker
            placeholder="-- / -- / ----"
            disabledDate={(date) => date.isAfter(new Date())}
            {...(form.getFieldValue('dob') && { defaultValue: dayjs(form.getFieldValue('dob')) })}
            disabled={EProfileStatus.INACTIVE === initialFormValues?.status}
          />
        </FormItem>
        <FormItem
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please enter the phone number' }, { validator: validatePhoneNumber }]}
        >
          <PhoneNumber mask="+61 000 000 000" disabled={EProfileStatus.INACTIVE === initialFormValues?.status} />
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
      <div>
        <FormItem
          label="Address"
          name="address"
          rules={[
            { required: true, message: 'Please enter the address' },
            { max: 255, message: 'Valid address shouldn’t exceed 255 characters' },
            { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the address' },
          ]}
        >
          <Input placeholder="Address" disabled={EProfileStatus.INACTIVE === initialFormValues?.status} />
        </FormItem>
      </div>

      <div className="GeneralInfomationForm__row">
        <FormItem
          label="Type of Practitioner"
          name="practitionerType"
          rules={[{ required: true, message: 'Please select the type of practitioner' }]}
        >
          <Select
            options={practitionerTypes}
            placeholder="Practitioner Type"
            onChange={handleChangePractitionerType}
            disabled={EProfileStatus.INACTIVE === initialFormValues?.status}
          />
        </FormItem>
        {isShowOtherType && (
          <FormItem label="Other Type" name="practitionerTypeOther" showRequiredMark={false}>
            <Input placeholder="Write in" disabled={EProfileStatus.INACTIVE === initialFormValues?.status} />
          </FormItem>
        )}

        <FormItem
          label="Provider Number/ABN"
          name="provideNumber"
          rules={[
            { required: true, message: 'Please enter Provider Number/ABN' },
            { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter Provider Number/ABN' },
          ]}
        >
          <Input placeholder="Provider Number/ABN" disabled={EProfileStatus.INACTIVE === initialFormValues?.status} />
        </FormItem>

        {!isShowOtherType && <FormItem />}
      </div>

      <div className="GeneralInfomationForm__footer">
        <Button type="default" onClick={handleResetFormData} disabled={isDisableSubmit}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading} disabled={isDisableSubmit}>
          Save changes
        </Button>
      </div>
    </Form>
  );
};

export default GeneralInfomation;
