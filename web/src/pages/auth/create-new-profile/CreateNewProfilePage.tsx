import { unwrapResult } from '@reduxjs/toolkit';
import { Form } from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { GalleryIcon } from 'src/assets/icons';
import Logo from 'src/assets/images/logo.png';
import Avatar from 'src/components/avatar';
import Button from 'src/components/button';
import Card from 'src/components/card';
import DatePicker from 'src/components/date-picker';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { PhoneNumber } from 'src/components/phone-number';
import Select from 'src/components/select';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import Upload from 'src/components/upload';
import ResponseError from 'src/interfaces/error-response-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { TRootState, useAppDispatch } from 'src/stores';
import { getPractitionerTypes, updateClinicOwnerProfile, updatePractitionerProfile } from 'src/stores/profile';
import { getUserProfile } from 'src/stores/user';
import { asyncDelay, getBase64 } from 'src/utils/common-utils';
import { validatePhoneNumber, validateSizeImage, validateTypeImage } from 'src/utils/validate-utils';
import { GENDER_OPTIONS, TITLE_OPTIONS } from 'src/variables/common';
import { STRING_NOT_ONLY_SPACE_REGEX } from 'src/variables/constants';
import { EUserType, EUserTypeDisplay } from 'src/variables/enum-variables';
import { ICreateClinicOwnerProfileValues, ICreatePractitionerProfileValues } from './create-new-profile-types';
import './CreateNewProfilePage.scss';

const MAX_SIZE = 5;

const CreateNewProfilePage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const profile = useSelector((state: TRootState) => state.user.profile);
  const userType = params?.userType;
  const isClinicOwner = userType === EUserTypeDisplay.CLINIC_OWNER;
  const isInvitedPractitioner = userType === EUserTypeDisplay.PRACTITIONER;

  const [form] = Form.useForm<ICreateClinicOwnerProfileValues | ICreatePractitionerProfileValues>();
  const [forceRenderPractitionerPhoneInput, setForceRenderPractitionerPhoneInput] = useState(true);

  const practitionerPhoneInputKey = useMemo(() => {
    return Math.random();
  }, [forceRenderPractitionerPhoneInput]);

  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>('');
  const [logoError, setLogoError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [practitionerTypes, setPractitionerTypes] = useState<{ value: string; label: string }[]>([]);
  const [isShowOtherType, setIsShowOtherType] = useState<boolean>(false);

  const handleChangeFile: UploadProps['onChange'] = async ({ file }) => {
    const validFileSize = file.size && validateSizeImage(file.size, MAX_SIZE);
    if (!validFileSize) {
      setLogoError(`The logo should not exceed ${MAX_SIZE}MB`);
      return;
    }

    const validFileType = validateTypeImage(file.type);
    if (!validFileType) {
      setLogoError(`This format is not supported`);
      return;
    }

    const previewUrl = await getBase64(file as RcFile);
    setPreviewUrl(previewUrl);
    setLogoError('');
    form.setFieldsValue({ avatar: file });
    setForceRenderPractitionerPhoneInput(!forceRenderPractitionerPhoneInput);
  };

  const handleChangePractitionerType = (value: string) => {
    const isSelectedOther = practitionerTypes.some((type) => type.value === value && type.label === 'Other');
    if (isSelectedOther !== isShowOtherType) {
      setIsShowOtherType(isSelectedOther);
    }
  };

  const onFinish = async (values: ICreateClinicOwnerProfileValues | ICreatePractitionerProfileValues) => {
    setIsLoading(true);
    try {
      if (isClinicOwner) {
        const result = await dispatch(updateClinicOwnerProfile(values as ICreateClinicOwnerProfileValues));
        unwrapResult(result);
      } else {
        const payload = { ...values, role: profile?.role };
        const result = await dispatch(updatePractitionerProfile(payload as ICreatePractitionerProfileValues));
        unwrapResult(result);
      }

      await dispatch(getUserProfile());
      if (profile?.role !== EUserType.PRACTITIONER) {
        showSuccessToast('Your profile has been completed');
        navigate(RoutePaths.PRICING_PACKAGE);
      } else {
        showSuccessToast(
          <>
            Congratulations! You have successfully created an account.
            <br /> You will be redirected to the homepage in 5 seconds
          </>,
        );
        await asyncDelay(5000);
        navigate(RoutePaths.HOME);
      }
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPractitionerTypes = async () => {
    const types = await dispatch(getPractitionerTypes());
    const practitionerTypes = types.payload.data.map((type: { id: string; name: string }) => ({
      value: type.id,
      label: type.name,
    }));

    setPractitionerTypes(practitionerTypes);
  };

  useEffect(() => {
    form.setFieldsValue({ clinicPracticeName: profile?.clinic?.name });
    if (profile?.role === EUserType.PRACTITIONER) {
      form.setFieldsValue({
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        address: profile?.address,
        phone: profile?.phone,
      });
      setForceRenderPractitionerPhoneInput(!forceRenderPractitionerPhoneInput);
    }
  }, [profile]);

  useEffect(() => {
    if (!isClinicOwner) {
      fetchPractitionerTypes();
    }
  }, []);

  return (
    <div className="CreateNewProfilePage">
      <header className="CreateNewProfilePage__header">
        <img src={Logo} alt="Logo" className="CreateNewProfilePage__header-logo" />
        {isClinicOwner ? (
          <BaseText type="display1">
            Enter your personal and clinic information <br /> to start setting up account
          </BaseText>
        ) : (
          <BaseText type="display1">
            Enter your personal information to start setting up <br /> account
          </BaseText>
        )}
      </header>

      <Form
        form={form}
        onFinish={onFinish}
        className="CreateNewProfilePage__form"
        name="Create new profile form"
        scrollToFirstError={true}
        layout="vertical"
      >
        <Card className="CreateNewProfilePage__form-upload" title={<BaseText type="headline">Upload avatar</BaseText>}>
          <Avatar icon={<GalleryIcon />} className="CreateNewProfilePage__form-upload-avt" src={previewUrl} />
          <FormItem name="avatar" showRequiredMark={false}>
            <Upload
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleChangeFile}
              textButton={isClinicOwner ? 'Upload clinic avatar' : 'Upload avatar'}
            />
          </FormItem>
          {logoError && (
            <BaseText type="subHeading" className="error">
              {logoError}
            </BaseText>
          )}
          <BaseText type="caption">Maximum file size: {MAX_SIZE}MB. Allowed file types: JPG, PNG, JPEG.</BaseText>
        </Card>

        <Card
          className="CreateNewProfilePage__form-clinicOwner"
          title={
            <BaseText type="headline">
              {isClinicOwner ? 'Clinic owner information' : 'Practitioner information'}
            </BaseText>
          }
        >
          <div className="CreateNewProfilePage__form-clinicOwner-wrapper">
            <FormItem label="Title" name="title" showRequiredMark={false}>
              <Select options={TITLE_OPTIONS} placeholder="Title" />
            </FormItem>
            <FormItem
              label="First Name"
              name="firstName"
              required={true}
              rules={[
                { required: true, message: 'Please enter the first name' },
                { max: 50, message: 'Valid first name shouldn’t exceed 50 characters' },
                { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the first name' },
              ]}
            >
              <Input placeholder="First name" />
            </FormItem>
            <FormItem
              label="Last Name"
              name="lastName"
              required={true}
              rules={[
                { required: true, message: 'Please enter the last name' },
                { max: 50, message: 'Valid last name shouldn’t exceed 50 characters' },
                { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the last name' },
              ]}
            >
              <Input placeholder="Last name" />
            </FormItem>
          </div>

          <div className="CreateNewProfilePage__form-clinicOwner-wrapper">
            <FormItem
              label="Gender"
              name="gender"
              required={true}
              rules={[{ required: true, message: 'Please enter the gender' }]}
            >
              <Select options={GENDER_OPTIONS} placeholder="Gender" />
            </FormItem>
            <FormItem
              leftLabel="Age (D.O.B)"
              rightLabel="DD / MM / YYYY"
              name="dob"
              valuePropName="dob"
              showRequiredMark={false}
              normalize={(date) => date.format('MM/DD/YYYY')}
            >
              <DatePicker placeholder="-- / -- / ----" disabledDate={(date) => date.isAfter(new Date())} />
            </FormItem>
            <FormItem
              label="Phone"
              name="phone"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Please enter the phone number',
                },
                { validator: validatePhoneNumber },
              ]}
            >
              <PhoneNumber mask="+61 000 000 000" key={practitionerPhoneInputKey} />
            </FormItem>
          </div>

          {!isClinicOwner && (
            <div className="CreateNewProfilePage__form-clinicOwner-wrapper">
              <FormItem
                label="Clinic/Practice name"
                name="clinicPracticeName"
                rules={[
                  {
                    required: userType === EUserTypeDisplay.CLINIC_OWNER || isInvitedPractitioner,
                    message: 'Please enter Clinic/Practice name',
                  },
                  { max: 50, message: 'Valid clinic/practitioner name shouldn’t exceed 50 characters' },
                ]}
              >
                <Input placeholder="Clinic/Practice name" disabled={Boolean(profile?.clinic?.name)} />
              </FormItem>
              {userType === EUserTypeDisplay.SOLO_PRACTITIONER ? (
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
              ) : (
                <FormItem
                  label="Provider Number/ABN"
                  name="provideNumber"
                  rules={[
                    { required: true, message: 'Please enter Provider Number/ABN' },
                    { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter Provider Number/ABN' },
                  ]}
                >
                  <Input placeholder="Provider Number/ABN" />
                </FormItem>
              )}
              <FormItem
                label="Type of Practitioner"
                name="practitionerType"
                required={true}
                rules={[{ required: true, message: 'Please select the type of practitioner' }]}
              >
                <Select
                  options={practitionerTypes}
                  placeholder="Practitioner Type"
                  onChange={handleChangePractitionerType}
                />
              </FormItem>
              {isShowOtherType && (
                <FormItem label="Other Type" name="practitionerTypeOther" showRequiredMark={false}>
                  <Input placeholder="Write in" />
                </FormItem>
              )}
            </div>
          )}

          <div className="CreateNewProfilePage__form-clinicOwner-wrapper">
            <FormItem
              label="Address"
              name="address"
              required={true}
              rules={[
                { required: true, message: 'Please enter the address' },
                { max: 255, message: 'Valid address shouldn’t exceed 255 characters' },
                { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the address' },
              ]}
            >
              <Input placeholder="Select" />
            </FormItem>
          </div>
        </Card>

        {isClinicOwner && (
          <Card
            className="CreateNewProfilePage__form-clinicInfo"
            title={<BaseText type="headline">Clinic information</BaseText>}
          >
            <div className="CreateNewProfilePage__form-clinicInfo-wrapper">
              <FormItem
                label="Clinic/Practice name"
                name="clinicPracticeName"
                required={true}
                rules={[
                  { required: true, message: 'Please enter the clinic/practice name' },
                  { max: 50, message: 'Valid clinic/practitioner name shouldn’t exceed 50 characters' },
                  { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the clinic/practice name' },
                ]}
              >
                <Input placeholder="Clinic/Practice name" />
              </FormItem>
              <FormItem
                label="ABN / ACN"
                name="abn"
                required={true}
                rules={[
                  { required: true, message: 'Please enter the ABN / ACN' },
                  { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the ABN / ACN' },
                ]}
              >
                <Input placeholder="ABN / ACN" />
              </FormItem>
            </div>

            <div className="CreateNewProfilePage__form-clinicInfo-wrapper">
              <FormItem
                label="Phone"
                name="clinicPhone"
                required={true}
                rules={[
                  { required: true, message: 'Please enter the phone number' },
                  { validator: validatePhoneNumber },
                ]}
              >
                <PhoneNumber mask="+61 000 000 000" />
              </FormItem>
              <FormItem
                label="Email"
                name="clinicEmail"
                normalize={(value) => value.trim()}
                required={true}
                rules={[
                  { required: true, message: 'Please enter the email address' },
                  { type: 'email', message: 'Invalid input. Please enter a valid email address' },
                ]}
              >
                <Input placeholder="Email" />
              </FormItem>
            </div>

            <div className="CreateNewProfilePage__form-clinicInfo-wrapper">
              <FormItem
                label="Address"
                name="clinicAddress"
                required={true}
                rules={[
                  { required: true, message: 'Please enter the address' },
                  { max: 255, message: 'Valid address shouldn’t exceed 255 characters' },
                  { pattern: STRING_NOT_ONLY_SPACE_REGEX, message: 'Please enter the address' },
                ]}
              >
                <Input placeholder="Select" />
              </FormItem>
            </div>
          </Card>
        )}

        <Button
          type="primary"
          htmlType="submit"
          className="CreateNewProfilePage__form-submit-button"
          loading={isLoading}
          disabled={isLoading}
          style={{ marginRight: userType === EUserTypeDisplay.PRACTITIONER ? 'auto' : '0' }}
        >
          {userType === EUserTypeDisplay.PRACTITIONER ? 'Submit' : 'Next'}
        </Button>
      </Form>
    </div>
  );
};

export default CreateNewProfilePage;
