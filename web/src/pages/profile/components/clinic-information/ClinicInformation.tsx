import { Form } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { STRING_NOT_ONLY_SPACE_REGEX } from 'src/variables/constants';
import './ClinicInformation.scss';
import { BaseText } from 'src/components/typography';
import { PhoneNumber } from 'src/components/phone-number';
import { validatePhoneNumber } from 'src/utils/validate-utils';
import Button from 'src/components/button';
import { useForm } from 'antd/es/form/Form';
import { TRootState, useAppDispatch } from 'src/stores';
import { getClinicDetail, updateClinicDetail } from 'src/stores/profile';
import { useSelector } from 'react-redux';
import { EUserType } from 'src/variables/enum-variables';
import { unwrapResult } from '@reduxjs/toolkit';
import { TGetClinicDetailResponse } from 'src/interfaces/profile-interface';
import { TClinicInformationForm } from './clinic-information-types';

const ClinicInformation = () => {
  const dispatch = useAppDispatch();
  const profile = useSelector((state: TRootState) => state.user.profile);
  const [form] = useForm();
  const [disableButtons, setDisableButtons] = useState(true);
  const [loading, setLoading] = useState(false);
  const clinicDetailInitialValue = useRef<TGetClinicDetailResponse>();
  const [forceRenderPhoneInput, setForceRenderPhoneInput] = useState(true);

  const phoneInputKey = useMemo(() => {
    return Math.random();
  }, [forceRenderPhoneInput]);

  const getClinicInformation = async () => {
    if (profile?.clinic && profile.role === EUserType.OWNER) {
      const res = unwrapResult(await dispatch(getClinicDetail({ clinicId: profile?.clinic.id })));
      form.setFieldsValue(res.data);
      clinicDetailInitialValue.current = res.data;
      setForceRenderPhoneInput(!forceRenderPhoneInput);
    }
  };

  const handleChangeForm = () => {
    setDisableButtons(false);
  };

  const handleResetChanges = () => {
    setDisableButtons(true);
    form.setFieldsValue(clinicDetailInitialValue.current);
  };

  const handleUpdateClinicInformation = async (values: TClinicInformationForm) => {
    if (clinicDetailInitialValue.current) {
      setLoading(true);
      const res = unwrapResult(
        await dispatch(
          updateClinicDetail({
            abn: values.abn,
            clinicAddress: values.address,
            clinicEmail: values.email,
            clinicId: clinicDetailInitialValue.current.id,
            clinicPhone: values.phone,
            clinicPracticeName: values.name,
          }),
        ),
      );

      if (res.data.id) {
        form.setFieldsValue(res.data);
        clinicDetailInitialValue.current = res.data;
        setDisableButtons(true);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getClinicInformation();

    return () => {
      form.resetFields();
    };
  }, []);

  return (
    <div className="ClinicInformation">
      <BaseText type="headline" className="ClinicInformation__section-title">
        Clinic Information
      </BaseText>
      <Form
        name="ClinicInformation"
        className="ClinicInformationForm"
        form={form}
        onFinish={handleUpdateClinicInformation}
        layout="vertical"
        onValuesChange={handleChangeForm}
      >
        <div className="ClinicInformationForm__row">
          <FormItem
            label="Name of Clinic/Practice"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please enter Clinic/Practice name',
              },
              { max: 50, message: 'Valid clinic/practitioner name shouldn’t exceed 50 characters' },
            ]}
          >
            <Input placeholder="Clinic/Practice name" />
          </FormItem>

          <FormItem
            label="ABN / ACN"
            name="abn"
            rules={[
              { required: true, message: 'Please enter the ABN / ACN' },
              { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the ABN / ACN' },
            ]}
          >
            <Input placeholder="ABN / ACN" />
          </FormItem>
          <FormItem
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter the phone number' }, { validator: validatePhoneNumber }]}
          >
            <PhoneNumber mask="+61 000 000 000" key={phoneInputKey} />
          </FormItem>
        </div>

        <div className="ClinicInformationForm__row">
          <FormItem
            label="Email"
            name="email"
            required={true}
            rules={[
              { required: true, message: 'Please enter the email address' },
              { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the email address' },
              { max: 100, message: 'Valid email shouldn’t exceed 100 characters' },
              { type: 'email', message: 'Invalid input. Please enter a valid email address' },
            ]}
          >
            <Input placeholder="Email" />
          </FormItem>
        </div>

        <div className="ClinicInformationForm__row">
          <FormItem
            label="Address"
            name="address"
            rules={[
              { required: true, message: 'Please enter the address' },
              { max: 255, message: 'Valid address shouldn’t exceed 255 characters' },
              { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the address' },
            ]}
          >
            <Input placeholder="Address" />
          </FormItem>
        </div>

        <div className="ClinicInformationForm__buttons">
          <Button type="default" onClick={handleResetChanges} disabled={disableButtons}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} disabled={disableButtons}>
            Save changes
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ClinicInformation;
