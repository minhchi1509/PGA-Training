import { Form } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { UserInviteIcon } from 'src/assets/icons';
import Button from 'src/components/button';
import { CommonContent, Container } from 'src/components/containers';
import { SearchInput } from 'src/components/input';
import InviteModal, { TInviteFormValues } from 'src/components/invite';
import InviteSuccessModal from 'src/components/popup/inviteSuccess/InviteSuccess';
import { showErrorToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import { PractitionersTable } from 'src/containers/practitioners';
import { TCommonGetListParams } from 'src/interfaces/common-interface';
import { TTotalMember } from 'src/interfaces/owner-interface';
import { TPractitioner } from 'src/interfaces/practitioners-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { getTotalMember } from 'src/services/owner-service';
import { TRootState, useAppDispatch } from 'src/stores';
import { EPractitionersAction, getPractitioners, invitePractitioner } from 'src/stores/practitioners';
import { DEFAULT_GET_LIST_PARAMS, DEFAULT_PAGE } from 'src/variables/common';
import { EUserType } from 'src/variables/enum-variables';
import './PractitionersPage.scss';
import MaximumActivePractitionersModal from './practitioner-page-components/MaximumActivePractitionersModal';

const PractitionersPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [practitionerId, setPractitionerId] = useState<string>();
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
  const [practitionersParams, setPractitionersParams] = useState<TCommonGetListParams>(DEFAULT_GET_LIST_PARAMS);
  const [visibleInviteModal, setVisibleInviteModal] = useState<boolean>(false);
  const [visibleInviteSuccessModal, setVisibleInviteSuccessModal] = useState<boolean>(false);
  const [totalMember, setTotalMember] = useState<TTotalMember>();

  const { practitionerList } = useSelector((state: TRootState) => state.practitioners);
  const currentSubscription = useSelector((state: TRootState) => state.profile.currentSubscription);
  const { loading, inviting } = useSelector((state: TRootState) => ({
    loading: state.loading[EPractitionersAction.GET_PRACTITIONERS],
    inviting: state.loading[EPractitionersAction.INVITE_PRACTITIONER],
  }));
  const disabledInviteBtn = useMemo(() => {
    const isDisabledBtn = !totalMember || !currentSubscription;
    // min planAmount is 1, default Total Practitioner is 0.
    const isOver = Number(totalMember?.totalPractitioner ?? 0) >= Number(currentSubscription?.plan?.amount ?? 1);

    return {
      disabled: isDisabledBtn,
      isOver,
    };
  }, [totalMember, currentSubscription]);

  const onOpenInviteModal = () => {
    if (disabledInviteBtn.disabled) return;

    if (disabledInviteBtn.isOver) {
      setIsShowAlert(true);
      return;
    }

    setVisibleInviteModal(true);
  };

  const toggleInviteModal = () => {
    setVisibleInviteModal(!visibleInviteModal);
  };

  const toggleInviteSuccessModal = () => {
    setVisibleInviteSuccessModal(!visibleInviteSuccessModal);
  };

  const getPractitionerList = (params: TCommonGetListParams) => {
    dispatch(getPractitioners(params));
  };

  const handleInvitePractitioner = async (values: TInviteFormValues) => {
    const { payload: response } = await dispatch(invitePractitioner(values));

    if (response.id) {
      setPractitionerId(response.practitionerId);
      toggleInviteModal();
      form.resetFields();
      toggleInviteSuccessModal();
      getPractitionerList(practitionersParams);
      getMember();
      return;
    }

    if (response.errorType === 'overPlan') {
      toggleInviteModal();
      setIsShowAlert(true);
      return;
    }

    showErrorToast(response.message);
  };

  const handleSearchPractitioner = (keyword: string) => {
    const newParams = {
      ...practitionersParams,
      page: DEFAULT_PAGE,
      keyword,
    };

    setPractitionersParams(newParams);
  };

  const handleChangePage = (page: number) => {
    const newParams = {
      ...practitionersParams,
      page,
    };

    setPractitionersParams(newParams);
  };

  const handleClickRow = (practitioner: TPractitioner) => {
    navigate(RoutePaths.PRACTITIONER_DETAILS(practitioner.id || ''), {
      state: { practitioner },
    });
  };

  const getMember = async () => {
    const response = await getTotalMember();
    setTotalMember(response);
  };

  useEffect(() => {
    getPractitionerList(practitionersParams);
    getMember();
  }, [practitionersParams]);

  return (
    <Container className="PractitionersPage">
      <CommonContent
        title="Practitioners"
        action={
          <Button
            icon={<UserInviteIcon />}
            className="PractitionersPage__inviteBtn"
            size="small"
            noBorder
            onClick={onOpenInviteModal}
          >
            Invite practitioner
          </Button>
        }
      >
        <div className="PractitionersPage__header">
          <BaseText type="title">Practitioners</BaseText>
          <SearchInput width="320px" placeHolder="Search by name or email" onChange={handleSearchPractitioner} />
        </div>
        <PractitionersTable
          {...practitionerList}
          loading={loading}
          onChangePage={handleChangePage}
          onClickRow={handleClickRow}
        />
      </CommonContent>

      <InviteModal
        form={form}
        isOpen={visibleInviteModal}
        type={EUserType.CLINIC_OWNER}
        inviting={inviting}
        onClose={toggleInviteModal}
        onSubmit={handleInvitePractitioner}
      />

      <MaximumActivePractitionersModal
        open={isShowAlert}
        onCancelButton={() => setIsShowAlert(false)}
        onCancel={() => setIsShowAlert(false)}
      />

      <InviteSuccessModal
        isOpen={visibleInviteSuccessModal}
        type={EUserType.CLINIC_OWNER}
        userId={practitionerId ?? ''}
        onClose={toggleInviteSuccessModal}
      />
    </Container>
  );
};

export default PractitionersPage;
