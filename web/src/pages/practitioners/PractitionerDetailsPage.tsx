import { unwrapResult } from '@reduxjs/toolkit';
import { MenuProps, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { ChevronLeftIcon, DeleteIcon, DeleteUserIcon, ReactivateUserIcon } from 'src/assets/icons';
import Button from 'src/components/button';
import { CommonContent, Container } from 'src/components/containers';
import Dropdown from 'src/components/dropdown/Dropdown';
import { ConfirmModal } from 'src/components/popup';
import StatusBox from 'src/components/status-box';
import Tabs from 'src/components/tabs';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import { TTabItem } from 'src/interfaces/common-interface';
import ResponseError from 'src/interfaces/error-response-interface';
import { TDetailStatisticResponse, TPractitionerLite } from 'src/interfaces/practitioners-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { TRootState, useAppDispatch } from 'src/stores';
import {
  deactivePractitioner,
  getDetailStatisticPractitioner,
  getListLitePractitioner,
  reactivePractitioner,
  resendInvitationPractitioner,
  revokeInvitationPractitioner,
} from 'src/stores/practitioners/practitioners-actions';
import { getPractitionerProfileById } from 'src/stores/profile';
import { EProfileStatus } from 'src/variables/common';
import './PractitionerDetailsPage.scss';
import { AssignClientsModal, DetailedStatistics, GeneralInfomation } from './practitioner-details-components';
import {
  EConfirmModalType,
  EPractitionerDetailTabKey,
  PRACTITIONER_DETAIL_TAB_LABEL,
} from './practitioner-details-constants';
import MaximumActivePractitionersModal from './practitioner-page-components/MaximumActivePractitionersModal';
import { TTotalMember } from 'src/interfaces/owner-interface';
import { getTotalMember } from 'src/services/owner-service';

const PractitionerDetailsPage = () => {
  const navigate = useNavigate();
  const [statistic, setStatistic] = useState<TDetailStatisticResponse>();
  const { practitionerId } = useParams() as { practitionerId: string };
  const dispatch = useAppDispatch();

  const [activeTabKey, setActiveTabKey] = useState<EPractitionerDetailTabKey>(EPractitionerDetailTabKey.GENERAL_INFO);
  const [confirmModalType, setConfirmModalType] = useState<EConfirmModalType | null>(null);
  const [isAssignClientsModalOpen, setAssignClientsModalOpen] = useState<boolean>(false);
  const [isDeactiving, setIsDeactiving] = useState<boolean>(false);
  const [isConfirmHandling, setIsConfirmHandling] = useState<boolean>(false);
  const [listPractitioner, setListPractitioner] = useState<TPractitionerLite[]>([]);
  const [isShowAlertMaximumPractitionerModal, setIsShowAlertMaximumPractitionerModal] = useState<boolean>(false);
  const [totalMember, setTotalMember] = useState<TTotalMember>();
  const practitioner = useSelector((state: TRootState) => state.profile.practitioner);
  const currentSubscription = useSelector((state: TRootState) => state.profile.currentSubscription);

  useEffect(() => {
    getMember();
    getStatisticData();
    dispatch(getPractitionerProfileById(practitionerId));
  }, [practitionerId]);

  useEffect(() => {
    getListPractitioner();
  }, []);

  const getMember = async () => {
    const response = await getTotalMember();
    setTotalMember(response);
  };

  const getStatisticData = async () => {
    try {
      const res = unwrapResult(await dispatch(getDetailStatisticPractitioner({ id: practitionerId })));
      setStatistic(res);
    } catch (error) {
      showErrorToast('Get detail statistic faield!');
      throw error;
    }
  };

  const getListPractitioner = async () => {
    const { data } = unwrapResult(await dispatch(getListLitePractitioner()));
    setListPractitioner(data);
  };

  const tabItems: TTabItem[] = Object.keys(PRACTITIONER_DETAIL_TAB_LABEL).map((item) => {
    const tabItem = {
      key: item,
      label: PRACTITIONER_DETAIL_TAB_LABEL[item],
      children: PRACTITIONER_DETAIL_TAB_LABEL[item],
    };

    switch (item) {
      case EPractitionerDetailTabKey.GENERAL_INFO:
        return {
          ...tabItem,
          children: <GeneralInfomation />,
        };

      case EPractitionerDetailTabKey.DETAILED_STATISTICS:
        return {
          ...tabItem,
          children: <DetailedStatistics statistic={statistic} />,
        };

      default:
        return tabItem;
    }
  });

  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Revoke',
      onClick: () => setConfirmModalType(EConfirmModalType.REVOKE),
    },
    {
      key: '2',
      label: 'Resend',
      onClick: () => setConfirmModalType(EConfirmModalType.RESEND),
    },
  ];

  const handleSubmitConfirmModal = async () => {
    try {
      setIsConfirmHandling(true);
      if (confirmModalType === EConfirmModalType.REVOKE) {
        unwrapResult(await dispatch(revokeInvitationPractitioner({ practitionerId })));
        showSuccessToast('The invitation has been revoked');
        setTimeout(() => {
          navigate(RoutePaths.PRACTITIONER);
        }, 500);
      } else if (confirmModalType === EConfirmModalType.RESEND) {
        unwrapResult(await dispatch(resendInvitationPractitioner({ practitionerId })));
        showSuccessToast('The invitation has been resend');
      } else if (confirmModalType === EConfirmModalType.DEACTIVATE) {
        if ((statistic?.activeClient || 0) + (statistic?.pendingClient || 0) > 0) {
          setAssignClientsModalOpen(true);
        } else {
          await handleDeactivatePractitioner({
            deactive: true,
            practitionerRellocate: '',
          });
        }
      } else {
        unwrapResult(await dispatch(reactivePractitioner({ practitionerId })));
        getMember();
        dispatch(getPractitionerProfileById(practitionerId));
        showSuccessToast('This practitioner has been successfully reactivated');
      }
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    } finally {
      setConfirmModalType(null);
      setIsConfirmHandling(false);
    }
  };

  const handleDeactivatePractitioner = async (values: { practitionerRellocate: string; deactive: boolean }) => {
    try {
      setIsDeactiving(true);
      await dispatch(
        deactivePractitioner({
          practitionerId: practitionerId,
          deactiveClient: values.deactive,
          reallocateProfileId: values.practitionerRellocate,
        }),
      );
      getMember();
      getStatisticData();
      dispatch(getPractitionerProfileById(practitionerId));
      showSuccessToast('This practitioner has been successfully deactivated');
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    } finally {
      setIsDeactiving(false);
      setAssignClientsModalOpen(false);
    }
  };

  const handleChangeTab = (tabKey: string) => {
    setActiveTabKey(tabKey as EPractitionerDetailTabKey);
  };

  const handleOnBack = () => {
    navigate(RoutePaths.PRACTITIONER);
  };

  const onOpenReactivateModal = () => {
    if (!totalMember || !currentSubscription) return;

    if (totalMember?.totalPractitioner >= currentSubscription?.plan.amount) {
      setIsShowAlertMaximumPractitionerModal(true);
    } else {
      setConfirmModalType(EConfirmModalType.REACTIVATE);
    }
  };

  return (
    <Container className="PractitionerDetailsPage">
      <CommonContent
        title={
          <Space size={16} className="PractitionerDetailsPage__title">
            <BaseText type="display1">
              <ChevronLeftIcon onClick={handleOnBack} cursor="pointer" style={{ marginRight: 16 }} />
              {practitioner?.firstName} {practitioner?.lastName}
            </BaseText>
            <StatusBox status={practitioner?.status ?? ''} />
          </Space>
        }
        className="PractitionerDetailsPage__wrapper"
        action={
          practitioner?.status === EProfileStatus.ACTIVE ? (
            <Button
              icon={<DeleteUserIcon />}
              noBorder
              size="small"
              onClick={() => setConfirmModalType(EConfirmModalType.DEACTIVATE)}
            >
              Deactivate
            </Button>
          ) : practitioner?.status === EProfileStatus.INACTIVE ? (
            <Button icon={<ReactivateUserIcon />} noBorder size="small" onClick={onOpenReactivateModal}>
              Reactivate
            </Button>
          ) : (
            <Dropdown menu={{ items: dropdownItems }}>
              <Button noBorder size="small">
                Invitation
              </Button>
            </Dropdown>
          )
        }
      >
        <Tabs
          items={tabItems}
          activeKey={activeTabKey}
          defaultActiveKey={EPractitionerDetailTabKey.GENERAL_INFO}
          onChange={handleChangeTab}
        />
      </CommonContent>

      <ConfirmModal
        open={Boolean(confirmModalType)}
        onCancelButton={() => setConfirmModalType(null)}
        onsubmit={handleSubmitConfirmModal}
        loading={isConfirmHandling}
        titleModal={
          confirmModalType === EConfirmModalType.REVOKE
            ? 'Revoke invitation'
            : confirmModalType === EConfirmModalType.RESEND
            ? 'Resend invitation'
            : confirmModalType === EConfirmModalType.DEACTIVATE
            ? 'Deactivate?'
            : 'Reactivate?'
        }
        txtBtnConfirm="Yes"
        txtBtnCancel="Cancel"
        danger={confirmModalType === EConfirmModalType.DEACTIVATE}
        icon={
          confirmModalType === EConfirmModalType.DEACTIVATE ? (
            <DeleteIcon />
          ) : confirmModalType === EConfirmModalType.REACTIVATE ? (
            <div className="PractitionerDetailsPage__confirmModal-reactivateIcon">
              <ReactivateUserIcon width={24} height={24} />
            </div>
          ) : undefined
        }
        className="PractitionerDetailsPage__confirmModal"
      >
        <BaseText type="body1" className="PractitionerDetailsPage__confirmModal-description">
          {confirmModalType === EConfirmModalType.REVOKE
            ? 'Do you want to revoke the invitation of this practitioner?'
            : confirmModalType === EConfirmModalType.RESEND
            ? 'Do you want to resend the invitation of this practitioner?'
            : confirmModalType === EConfirmModalType.DEACTIVATE
            ? 'Do you want to deactivate this practitioner from now on? The clients of this practitioner will be deactivated/reallocated as well'
            : 'Do you want to reactivate this practitioner from now on?'}
        </BaseText>
      </ConfirmModal>
      <AssignClientsModal
        totalActiveClient={statistic?.activeClient}
        open={isAssignClientsModalOpen}
        onCancel={() => setAssignClientsModalOpen(false)}
        onSubmit={handleDeactivatePractitioner}
        listPractitioner={listPractitioner}
        practitionerId={practitionerId}
        loading={isDeactiving}
        totalClient={(statistic?.activeClient || 0) + (statistic?.pendingClient || 0)}
      />
      <MaximumActivePractitionersModal
        open={isShowAlertMaximumPractitionerModal}
        onCancelButton={() => setIsShowAlertMaximumPractitionerModal(false)}
        onCancel={() => setIsShowAlertMaximumPractitionerModal(false)}
      />
    </Container>
  );
};

export default PractitionerDetailsPage;
