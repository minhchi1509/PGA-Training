import { unwrapResult } from '@reduxjs/toolkit';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { DeleteIcon, UserInviteIcon } from 'src/assets/icons';
import Button from 'src/components/button';
import { CommonContent, Container } from 'src/components/containers';
import { SearchInput } from 'src/components/input';
import InviteModal from 'src/components/invite';
import { TInviteFormValues } from 'src/components/invite/invite-types';
import { ConfirmModal as DischargeClientModal } from 'src/components/popup';
import InviteSuccessModal from 'src/components/popup/inviteSuccess/InviteSuccess';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import { ClientsTable } from 'src/containers/clients';
import { TClient } from 'src/interfaces/clients-interface';
import { TCommonGetListParams, TFilterValues } from 'src/interfaces/common-interface';
import ResponseError from 'src/interfaces/error-response-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { TRootState, useAppDispatch } from 'src/stores';
import { dischargeClient, EClientsAction, getClients, inviteClient } from 'src/stores/clients';
import { DEFAULT_GET_LIST_PARAMS, DEFAULT_PAGE } from 'src/variables/common';
import { EUserType } from 'src/variables/enum-variables';

import './ClientsPage.scss';

const ClientsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [clientId, setClientId] = useState<string>();
  const [clientsParams, setClientsParams] = useState<TCommonGetListParams>(DEFAULT_GET_LIST_PARAMS);
  const [visibleInviteModal, setVisibleInviteModal] = useState<boolean>(false);
  const [visibleInviteSuccessModal, setVisibleInviteSuccessModal] = useState<boolean>(false);
  const [visibleDischargeClientModal, setVisibleDischargeClientModal] = useState<boolean>(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  const { clientList } = useSelector((state: TRootState) => state.clients);
  const { loading, inviting, discharging } = useSelector((state: TRootState) => ({
    loading: state.loading[EClientsAction.GET_CLIENTS],
    inviting: state.loading[EClientsAction.INVITE_CLIENT],
    discharging: state.loading[EClientsAction.DISCHARGE_CLIENT],
  }));

  const toggleInviteModal = () => {
    setVisibleInviteModal(!visibleInviteModal);
  };

  const toggleInviteSuccessModal = () => {
    setVisibleInviteSuccessModal(!visibleInviteSuccessModal);
  };

  const toggleDischargeClientModal = () => {
    setVisibleDischargeClientModal(!visibleDischargeClientModal);
  };

  const getClientList = (params: TCommonGetListParams) => {
    dispatch(getClients(params));
  };

  const handleInviteClient = async (values: TInviteFormValues) => {
    const { payload: response } = await dispatch(inviteClient(values));

    if (response.id) {
      setClientId(response.clientId);
      toggleInviteModal();
      form.resetFields();
      toggleInviteSuccessModal();
      getClientList(clientsParams);
      return;
    }

    showErrorToast(response.message);
  };

  const handleDischargeClient = async () => {
    try {
      unwrapResult(await dispatch(dischargeClient({ id: selectedClientId })));
      showSuccessToast('This client has been discharged successfully');
      toggleDischargeClientModal();
      getClientList(clientsParams);
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
      throw error;
    }
  };

  const handleSearchClient = (keyword: string) => {
    const newParams = {
      ...clientsParams,
      page: DEFAULT_PAGE,
      keyword,
    };

    setClientsParams(newParams);
  };

  const handleChangePage = (page: number) => {
    const newParams = {
      ...clientsParams,
      page,
    };

    setClientsParams(newParams);
  };

  const handleClickDischarge = (clientId: string) => {
    setSelectedClientId(clientId);
    toggleDischargeClientModal();
  };

  const handleClickRow = (client: TClient) => {
    navigate(RoutePaths.CLIENT_DETAILS(client.clientId || ''));
  };

  const handleFilter = (values: TFilterValues) => {
    const filterStatus = values.status?.join(',');
    const newParams = {
      ...clientsParams,
      page: DEFAULT_PAGE,
      status: filterStatus,
    };

    setClientsParams(newParams);
  };

  useEffect(() => {
    getClientList(clientsParams);
  }, [clientsParams]);

  return (
    <Container className="ClientsPage">
      <CommonContent
        title="Clients"
        action={
          <Button
            icon={<UserInviteIcon />}
            noBorder
            className="ClientsPage__inviteBtn"
            size="small"
            onClick={toggleInviteModal}
          >
            Create new client
          </Button>
        }
      >
        <div className="ClientsPage__header">
          <BaseText type="title">Clients</BaseText>
          <SearchInput placeHolder="Search by name or email" width="320px" onChange={handleSearchClient} />
        </div>
        <ClientsTable
          {...clientList}
          loading={loading}
          onChangePage={handleChangePage}
          onDischarge={handleClickDischarge}
          onClickRow={handleClickRow}
          onFilter={handleFilter}
        />
      </CommonContent>

      <InviteModal
        form={form}
        isOpen={visibleInviteModal}
        type={EUserType.SOLO_PRACTITIONER}
        inviting={inviting}
        onClose={toggleInviteModal}
        onSubmit={handleInviteClient}
      />

      <InviteSuccessModal
        isOpen={visibleInviteSuccessModal}
        type={EUserType.SOLO_PRACTITIONER}
        onClose={toggleInviteSuccessModal}
        userId={clientId ?? ''}
      />

      <DischargeClientModal
        open={visibleDischargeClientModal}
        icon={<DeleteIcon width={48} height={48} />}
        className="ClientsPage__dischargeModal"
        titleModal="Discharge client"
        txtBtnCancel="Cancel"
        txtBtnConfirm="Yes"
        loading={discharging}
        danger
        onsubmit={handleDischargeClient}
        onCancelButton={toggleDischargeClientModal}
      >
        <BaseText type="small" className="ClientsPage__dischargeModal-confirm-text">
          Do you want to discharge this client? <br />
          Remember to let the referrer know!
        </BaseText>
      </DischargeClientModal>
    </Container>
  );
};

export default ClientsPage;
