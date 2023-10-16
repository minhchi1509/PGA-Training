import { Avatar, Form, UploadProps } from 'antd';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { STRING_NOT_ONLY_SPACE_REGEX } from 'src/variables/constants';
import DatePicker from 'src/components/date-picker';
import { PhoneNumber } from 'src/components/phone-number';
import { validatePhoneNumber, validateSizeImage } from 'src/utils/validate-utils';
import Button from 'src/components/button';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { unwrapResult } from '@reduxjs/toolkit';
import './GeneralInformation.scss';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { TRootState, useAppDispatch } from 'src/stores';
import { BaseText } from 'src/components/typography';
import { GENDER_OPTIONS, TITLE_OPTIONS } from 'src/variables/common';
import Select from 'src/components/select';
import { GalleryIcon } from 'src/assets/icons';
import Upload from 'src/components/upload';
import { validateTypeImage } from 'src/utils/validate-utils';
import { getBase64 } from 'src/utils/common-utils';
import { RcFile } from 'antd/es/upload';
import ChangePasswordModal from '../change-password-modal/ChangePasswordModal';
import { useSelector } from 'react-redux';
import { EUserType } from 'src/variables/enum-variables';
import { getPractitionerTypes, getProfileDetail } from 'src/stores/profile';
import { TGetProfileDetailResponse, TUpdateProfileDetailRequest } from 'src/interfaces/profile-interface';
import { updateProfileDetail } from 'src/stores/profile/profile-actions';
import ResponseError from 'src/interfaces/error-response-interface';

const MAX_SIZE = 5;

const GeneralInformation = () => {
  const dispatch = useAppDispatch();
  const profile = useSelector((state: TRootState) => state.user.profile);
  const [formPersonalInformation] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDisableSubmit, setDisableSubmit] = useState<boolean>(true);
  const [isOpenChangePasswordModal, setIsOpenChangePasswordModal] = useState<boolean>(false);
  const [practitionerTypes, setPractitionerTypes] = useState<{ value: string; label: string }[]>([]);
  const [isShowOtherType, setIsShowOtherType] = useState<boolean>(false);
  const [initialPersonalInformation, setInitialPersonalInformation] = useState<TGetProfileDetailResponse>();

  const [previewUrl, setPreviewUrl] = useState<string | undefined>('');
  const [logoError, setLogoError] = useState<string>('');

  const [forceRenderDobInput, setForceRenderDobInput] = useState(true);
  const [forceRenderPhoneInput, setForceRenderPhoneInput] = useState(true);

  const dobInputKey = useMemo(() => {
    return Math.random();
  }, [forceRenderDobInput]);

  const phoneInputKey = useMemo(() => {
    return Math.random();
  }, [forceRenderPhoneInput]);

  const handleChangePractitionerType = (value: string) => {
    const isSelectedOther = practitionerTypes.some((type) => type.value === value && type.label === 'Other');
    if (isSelectedOther !== isShowOtherType) {
      setIsShowOtherType(isSelectedOther);
    }
  };

  const getProfile = async () => {
    const res = unwrapResult(await dispatch(getProfileDetail()));
    formPersonalInformation.setFieldsValue(res.data);
    if (res.data.practitionerType) {
      formPersonalInformation.setFieldValue('practitionerType', res.data.practitionerType.id);
    }

    setForceRenderDobInput(!forceRenderDobInput);
    setForceRenderPhoneInput(!forceRenderPhoneInput);
    setInitialPersonalInformation(res.data);
    setPreviewUrl(res.data.avatar);
  };

  const onFinish = async (values: TUpdateProfileDetailRequest) => {
    setLoading(true);
    try {
      const res = unwrapResult(
        await dispatch(
          updateProfileDetail({
            ...(values.title && { title: values.title }),
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            dob: values.dob,
            phone: values.phone,
            address: values.address,
            ...(typeof values.avatar !== 'string' && { avatar: values.avatar }),
            ...(values.provideNumber && { provideNumber: values.provideNumber }),
            ...(values.practitionerType && { practitionerType: values.practitionerType }),
            ...(values.practitionerTypeOther && { practitionerTypeOther: values.practitionerTypeOther }),
          }),
        ),
      );

      if (res.data) {
        getProfile();
        showSuccessToast('Personal information has been updated successfully');
        setDisableSubmit(true);
      }
    } catch (err) {
      const message = (err as ResponseError).message;
      showErrorToast(message);
    }

    setLoading(false);
  };

  const fetchPractitionerTypes = async () => {
    const types = await dispatch(getPractitionerTypes());
    const practitionerTypes = types.payload.data.map((type: { id: string; name: string }) => ({
      value: type.id,
      label: type.name,
    }));

    setPractitionerTypes(practitionerTypes);
  };

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
    formPersonalInformation.setFieldsValue({ avatar: file });
  };

  const handleCloseChangePasswordModal = () => {
    setIsOpenChangePasswordModal(false);
  };

  const handleResetChanges = () => {
    setDisableSubmit(true);
    formPersonalInformation.setFieldsValue(initialPersonalInformation);
    formPersonalInformation.setFieldValue('practitionerType', initialPersonalInformation?.practitionerType?.id);
    setPreviewUrl(initialPersonalInformation?.avatar);
    handleChangePractitionerType(initialPersonalInformation?.practitionerType?.id || '');
  };

  const handleChangeFormValues = () => {
    setDisableSubmit(false);
  };

  useEffect(() => {
    fetchPractitionerTypes();
    getProfile();
  }, []);

  useEffect(() => {
    if (initialPersonalInformation?.practitionerType) {
      handleChangePractitionerType(initialPersonalInformation.practitionerType.id);
    }
  }, [initialPersonalInformation, practitionerTypes]);

  return (
    <div className="ProfileGeneralInformation">
      <Form
        name="ProfileGeneralInformationForm"
        className="ProfileGeneralInformationForm"
        form={formPersonalInformation}
        onFinish={onFinish}
        layout="vertical"
        onValuesChange={handleChangeFormValues}
      >
        <div className="ProfileGeneralInformation__section ProfileGeneralInformation__upload-avatar">
          <BaseText type="headline" className="ProfileGeneralInformation__section-title">
            Upload avatar
          </BaseText>
          <Avatar icon={<GalleryIcon />} className="ProfileGeneralInformation__preview-avatar" src={previewUrl} />
          <FormItem name="avatar" showRequiredMark={false}>
            <Upload
              accept="image/png, image/jpeg, image/jpg, mp4"
              onChange={handleChangeFile}
              textButton="Upload avatar"
            />
          </FormItem>
          {logoError && (
            <BaseText type="subHeading" className="error">
              {logoError}
            </BaseText>
          )}
          <BaseText type="caption" className="ProfileGeneralInformation__file-requirement">
            Maximum file size: {MAX_SIZE}MB. Allowed file types: JPG, PNG, JPEG.
          </BaseText>
        </div>

        <div className="ProfileGeneralInformation__section ProfileGeneralInformation__section-personal-information">
          <BaseText type="title" className="ProfileGeneralInformation__section-title">
            Personal information
          </BaseText>
          <div className="ProfileGeneralInformationForm__row">
            <FormItem label="Title" name="title">
              <Select options={TITLE_OPTIONS} placeholder="Title" />
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
              <Input placeholder="First name" />
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
              <Input placeholder="Last name" />
            </FormItem>
          </div>

          <div className="ProfileGeneralInformationForm__row">
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
                key={dobInputKey}
                {...(formPersonalInformation.getFieldValue('dob') && {
                  defaultValue: dayjs(formPersonalInformation.getFieldValue('dob')),
                })}
              />
            </FormItem>

            <FormItem label="Gender" name="gender" rules={[{ required: true, message: 'Please enter the gender' }]}>
              <Select options={GENDER_OPTIONS} placeholder="Gender" />
            </FormItem>

            <FormItem
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please enter the phone number' }, { validator: validatePhoneNumber }]}
            >
              <PhoneNumber mask="+61 000 000 000" key={phoneInputKey} />
            </FormItem>
          </div>

          <div className="ProfileGeneralInformationForm__row">
            {(profile?.role === EUserType.PRACTITIONER || profile?.role === EUserType.SOLO_PRACTITIONER) && (
              <>
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
              </>
            )}

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
          </div>

          <div className="ProfileGeneralInformationForm__row">
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

          <div className="ProfileGeneralInformationForm__footer">
            <Button type="default" onClick={handleResetChanges} disabled={isDisableSubmit}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} disabled={isDisableSubmit}>
              Save changes
            </Button>
          </div>
        </div>
      </Form>

      <div className="ProfileGeneralInformation__section">
        <BaseText type="title" className="ProfileGeneralInformation__section-title">
          My account
        </BaseText>
        <BaseText type="small" className="ProfileGeneralInformation__my-account-email">
          Email: {initialPersonalInformation?.email}
        </BaseText>
        <Button type="primary" htmlType="submit" onClick={() => setIsOpenChangePasswordModal(true)}>
          Change password
        </Button>
      </div>

      <ChangePasswordModal
        open={isOpenChangePasswordModal}
        onCancel={handleCloseChangePasswordModal}
        email={initialPersonalInformation?.email || ''}
      />
    </div>
  );
};

export default GeneralInformation;
