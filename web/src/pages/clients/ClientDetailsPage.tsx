import { unwrapResult } from '@reduxjs/toolkit';
import { Dropdown, MenuProps, Space, Spin } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import dayjs from 'dayjs';
import { Location } from 'history';
import { Ref, useCallback, useEffect, useRef, useState } from 'react';
import { unstable_useBlocker, useBeforeUnload, useLocation, useNavigate, useParams } from 'react-router-dom';

import { DeleteIcon, DeleteUserIcon, ReactivateUserIcon } from 'src/assets/icons';
import Button from 'src/components/button';
import { CommonContent, Container } from 'src/components/containers';
import { ConfirmModal } from 'src/components/popup';
import StatusBox from 'src/components/status-box';
import Tabs from 'src/components/tabs';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import { HomeworkHistoryDetailsModal } from 'src/containers/homework';
import { PreviewFilesModal } from 'src/containers/modal';
import { TActivityData, TClientInfomationResponse, TTaskItemData } from 'src/interfaces/clients-interface';
import { TFile, TTabItem } from 'src/interfaces/common-interface';
import ResponseError from 'src/interfaces/error-response-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { useAppDispatch } from 'src/stores';
import {
  dischargeClient,
  getClientGeneralInfo,
  reactivateClient,
  resendClientInvitation,
  revokeClientInvitation,
} from 'src/stores/clients';
import { EProfileStatus } from 'src/variables/common';
import { EMessageError } from 'src/variables/enum-variables';
import { EConfirmModalType } from '../practitioners/practitioner-details-constants';
import './ClientDetailsPage.scss';
import { HomeworkTab } from './client-details-components';
import GeneralInfomation from './client-details-components/client-general-infomation/ClientGeneralInfomation';
import FileTab from './client-details-components/file-management/FileTab';
import InsightTab from './client-details-components/insight/InsightTab';
import MedicalProfile from './client-details-components/medical-profile/MedicalProfile';
import { CLIENT_DETAIL_TAB_LABEL, EClientDetailTabKey } from './client-details-page-constants';
import { IClientGeneralInformation } from './client-details-page-interface';

type TPreviewFilesModalState = {
  open: boolean;
  fileIndex: number;
  files: TFile[];
};

const ClientDetailsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { clientId } = useParams() as { clientId: string };
  const sliderRef: Ref<CarouselRef> = useRef(null);

  const [activeTabKey, setActiveTabKey] = useState<EClientDetailTabKey>(EClientDetailTabKey.GENERAL_INFO);
  const [homeworkHistoryDetailModalState, setHomeworkHistoryDetailModalState] = useState<{
    open: boolean;
    data?: TActivityData;
    historyData?: TTaskItemData;
  }>({
    open: false,
  });
  const [previewFilesModalState, setPreviewFilesModalState] = useState<TPreviewFilesModalState>({
    open: false,
    fileIndex: 0,
    files: [],
  });
  const [confirmModalType, setConfirmModalType] = useState<EConfirmModalType | null>(null);
  const [isConfirmHandling, setIsConfirmHandling] = useState<boolean>(false);
  const [clientGeneralInformation, setClientGeneralInformation] = useState<IClientGeneralInformation>({
    clientId: '',
    title: '',
    firstName: '',
    lastName: '',
    gender: '',
    phone: '',
    address: '',
    email: '',
    occupation: '',
    dischargeAt: null,
    status: EProfileStatus.ACTIVE,
    statusConvert: EProfileStatus.ACTIVE,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const [isOpenConfirmUnsaveModal, setIsOpenConfirmUnsaveModal] = useState(false);
  const nextLocationBlockRef = useRef<Location | null>(null);
  const nextTabBlockRef = useRef<EClientDetailTabKey | null>(null);

  const isBlockNavigateRef = useRef<boolean>(false);

  unstable_useBlocker((e) => {
    nextLocationBlockRef.current = e.nextLocation;
    if (isBlockNavigateRef.current) {
      setIsOpenConfirmUnsaveModal(true);
    }
    return isBlockNavigateRef.current;
  });

  useBeforeUnload(
    useCallback((e: BeforeUnloadEvent) => {
      if (isBlockNavigateRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    }, []),
  );

  const handleCloseUnsaveChangesModal = () => {
    nextLocationBlockRef.current = null;
    nextTabBlockRef.current = null;
    setIsOpenConfirmUnsaveModal(false);
  };

  const handleConfirmUnsaveChangesModal = () => {
    isBlockNavigateRef.current = false;
    if (nextLocationBlockRef.current) {
      navigate(nextLocationBlockRef.current.pathname);
    }
    if (nextTabBlockRef.current) {
      setActiveTabKey(nextTabBlockRef.current);
    }
    handleCloseUnsaveChangesModal();
  };

  const getClientInfo = async () => {
    setLoading(true);
    const result = await dispatch(getClientGeneralInfo(clientId));

    if (!result.payload.clientId) {
      const message = (result.payload as ResponseError).message;
      if (message === EMessageError.CLIENT_NOT_FOUND) navigate(RoutePaths.CLIENTS);
    }
    const data = result.payload as TClientInfomationResponse;

    const formValue = {
      ...data,
      clientId,
      ...(data.dob && { dob: dayjs(data.dob) }),
      ...(data.occupation && { occupation: data.occupation }),
    };

    setLoading(false);
    setClientGeneralInformation(formValue);
  };

  const handleOpenHomeworkHistoryDetailModal = (data: TActivityData) => {
    setHomeworkHistoryDetailModalState({ open: true, data, historyData: undefined });
  };

  const handleCloseHomeworkHistoryDetailModal = () => {
    setHomeworkHistoryDetailModalState({ open: false, data: undefined, historyData: undefined });
  };

  const handleClickAssignedHomeworkHistory = (item: TTaskItemData) => {
    setHomeworkHistoryDetailModalState({
      open: true,
      data: undefined,
      historyData: item,
    });
  };

  const items: TTabItem[] = Object.keys(CLIENT_DETAIL_TAB_LABEL).map((item) => {
    const tabItem = {
      key: item,
      label: CLIENT_DETAIL_TAB_LABEL[item],
      children: CLIENT_DETAIL_TAB_LABEL[item],
    };

    switch (item) {
      case EClientDetailTabKey.GENERAL_INFO:
        return {
          ...tabItem,
          children: <GeneralInfomation initialValue={clientGeneralInformation} />,
        };
      case EClientDetailTabKey.CARE_INFO:
        return {
          ...tabItem,
          children: <MedicalProfile status={clientGeneralInformation.statusConvert} />,
        };
      case EClientDetailTabKey.HOMEWORK:
        return {
          ...tabItem,
          children: (
            <HomeworkTab
              currentTabKey={activeTabKey}
              onClickHistoryItem={handleClickAssignedHomeworkHistory}
              onViewHomeworkHistoryDetails={handleOpenHomeworkHistoryDetailModal}
              clientGeneralInformation={clientGeneralInformation}
              isBlockNavigateRef={isBlockNavigateRef}
            />
          ),
        };
      case EClientDetailTabKey.INSIGHTS:
        return {
          ...tabItem,
          children: <InsightTab />,
        };
      case EClientDetailTabKey.FILES:
        return {
          ...tabItem,
          children: <FileTab />,
        };

      default:
        return tabItem;
    }
  });

  const handleChangeTab = (tabKey: string) => {
    if (isBlockNavigateRef.current) {
      setIsOpenConfirmUnsaveModal(true);
      nextTabBlockRef.current = tabKey as EClientDetailTabKey;
    } else {
      setActiveTabKey(tabKey as EClientDetailTabKey);
    }
  };

  const handleClosePreviewFilesModal = () => {
    setPreviewFilesModalState({
      open: false,
      fileIndex: 0,
      files: [],
    });
  };

  const handlePreviewFiles = (files: TFile[], fileIndex = 0) => {
    setPreviewFilesModalState({
      open: true,
      fileIndex,
      files,
    });
    sliderRef.current?.goTo(fileIndex);
  };

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
      switch (confirmModalType) {
        case EConfirmModalType.REVOKE: {
          unwrapResult(await dispatch(revokeClientInvitation(clientId)));
          showSuccessToast('The invitation has been revoked');
          setTimeout(() => {
            navigate(RoutePaths.CLIENTS);
          }, 500);
          break;
        }
        case EConfirmModalType.RESEND: {
          unwrapResult(await dispatch(resendClientInvitation(clientId)));
          showSuccessToast('The invitation has been resend');
          break;
        }
        case EConfirmModalType.DEACTIVATE: {
          unwrapResult(await dispatch(dischargeClient({ id: clientId })));
          showSuccessToast('This client has been deactivated successfully');
          getClientInfo();
          break;
        }
        case EConfirmModalType.REACTIVATE: {
          unwrapResult(await dispatch(reactivateClient(clientId)));
          showSuccessToast('This client has been reactivated successfully');
          getClientInfo();
          break;
        }
        default:
          break;
      }
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    } finally {
      setConfirmModalType(null);
      setIsConfirmHandling(false);
    }
  };

  useEffect(() => {
    getClientInfo();
  }, [clientId]);

  useEffect(() => {
    const isSameClient = clientGeneralInformation.clientId === clientId;

    if (location.state?.reload && isSameClient) {
      getClientInfo();
      window.history.replaceState(null, '');
    }
  }, [location.state]);

  return (
    <Container className="ClientDetailsPage">
      {loading ? (
        <Spin className="ClientDetailsPage__loading" />
      ) : (
        <>
          <CommonContent
            title={
              <Space size={16} className="ClientDetailsPage__title">
                <BaseText type="display1">
                  {clientGeneralInformation?.firstName} {clientGeneralInformation?.lastName}
                </BaseText>
                <StatusBox status={clientGeneralInformation?.statusConvert || ''} isShowDischarge />
              </Space>
            }
            className="ClientDetailsPage__wrapper"
            action={
              clientGeneralInformation.statusConvert === EProfileStatus.ACTIVE ? (
                <Button
                  icon={<DeleteUserIcon />}
                  noBorder
                  size="small"
                  onClick={() => setConfirmModalType(EConfirmModalType.DEACTIVATE)}
                  loading={loading}
                >
                  Discharge
                </Button>
              ) : clientGeneralInformation.statusConvert === EProfileStatus.INACTIVE ? (
                <Button
                  icon={<ReactivateUserIcon />}
                  noBorder
                  size="small"
                  onClick={() => setConfirmModalType(EConfirmModalType.REACTIVATE)}
                >
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
            haveBackButton
            onClickToBackButton={() => navigate(RoutePaths.CLIENTS)}
          >
            <Tabs
              items={items}
              activeKey={activeTabKey}
              defaultActiveKey={EClientDetailTabKey.GENERAL_INFO}
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
                ? 'Discharge client'
                : 'Reactivate this client'
            }
            txtBtnConfirm="Yes"
            txtBtnCancel="Cancel"
            danger={confirmModalType === EConfirmModalType.DEACTIVATE}
            icon={
              confirmModalType === EConfirmModalType.DEACTIVATE ? (
                <DeleteIcon />
              ) : confirmModalType === EConfirmModalType.REACTIVATE ? (
                <div className="ClientDetailsPage__confirmModal-reactivateIcon">
                  <ReactivateUserIcon width={24} height={24} />
                </div>
              ) : undefined
            }
            className="ClientDetailsPage__confirmModal"
          >
            <BaseText type="body1" className="ClientDetailsPage__confirmModal-description">
              {confirmModalType === EConfirmModalType.REVOKE
                ? 'Do you want to revoke the invitation of this client?'
                : confirmModalType === EConfirmModalType.RESEND
                ? 'Do you want to resend the invitation of this client?'
                : confirmModalType === EConfirmModalType.DEACTIVATE
                ? `Do you want to discharge this client? \nRemember to let the referrer know`
                : 'Do you want to reactivate account of this client ?'}
            </BaseText>
          </ConfirmModal>
          <HomeworkHistoryDetailsModal
            {...homeworkHistoryDetailModalState}
            onPreviewFiles={handlePreviewFiles}
            onClose={handleCloseHomeworkHistoryDetailModal}
          />

          <PreviewFilesModal {...previewFilesModalState} slideRef={sliderRef} onClose={handleClosePreviewFilesModal} />

          <ConfirmModal
            open={isOpenConfirmUnsaveModal}
            onCancelButton={handleCloseUnsaveChangesModal}
            onCancel={handleCloseUnsaveChangesModal}
            onsubmit={handleConfirmUnsaveChangesModal}
            txtBtnConfirm="Yes"
            txtBtnCancel="Cancel"
            danger
            className="ClientDetailsPage__ConfirmUnsaveChangesModal"
          >
            <BaseText type="body1" textAlign="center" className="ClientDetailsPage__ConfirmUnsaveChangesModal-text">
              Are you sure you want to leave the page without saving the assigned tasks to client
            </BaseText>
          </ConfirmModal>
        </>
      )}
    </Container>
  );
};

export default ClientDetailsPage;
