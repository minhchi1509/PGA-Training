import { BaseText } from 'src/components/typography';
import './FileTab.scss';
import { SearchInput } from 'src/components/input';
import ClientFiles from 'src/components/file-table/FileTable';
import { IconDelete, UploadIcon } from 'src/assets/icons';
import { ConfirmModal } from 'src/components/popup';
import { useEffect, useState } from 'react';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import UploadModal from 'src/components/upload-modal/UploadModal';
import { clientUploadFile, deleteClientFile } from 'src/stores/clients';
import { TClientFile, TClientUploadFileRequest, TGetClientFilesResponse } from 'src/interfaces/clients-interface';
import { useAppDispatch } from 'src/stores';
import { unwrapResult } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import { TCommonGetListParams } from 'src/interfaces/common-interface';
import { DEFAULT_GET_LIST_PARAMS, DEFAULT_PAGE } from 'src/variables/common';
import { getClientFiles } from 'src/stores/clients/clients-actions';
import { EClientFileSortBy, ESortType } from 'src/variables/enum-variables';
import { downloadClientFile } from 'src/utils/common-utils';
import ResponseError from 'src/interfaces/error-response-interface';

const FileTab = () => {
  const dispatch = useAppDispatch();
  const { clientId } = useParams() as { clientId: string };
  const [isOpenNewFileModal, setIsOpenNewFileModal] = useState<boolean>(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [clientsParams, setClientsParams] = useState<TCommonGetListParams>(DEFAULT_GET_LIST_PARAMS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortType, setSortType] = useState<ESortType>();
  const [sortBy, setSortBy] = useState<EClientFileSortBy>();
  const [clientFiles, setClientFiles] = useState<TGetClientFilesResponse>({
    data: [],
    currentPage: 1,
    totalPage: 1,
    totalRecord: 0,
  });

  const showConfirmDelete = (fileId: string) => {
    setIsConfirmDelete(true);
    setSelectedFileId(fileId);
  };

  const handleDelete = async () => {
    try {
      const res = await dispatch(deleteClientFile({ clientId, fileId: selectedFileId }));
      if (res.meta.requestStatus === 'fulfilled') {
        getClientListFile(clientsParams);
      }
      showSuccessToast('This file has been removed successfully');
      setIsConfirmDelete(false);
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
      throw error;
    }
  };

  const getClientListFile = async (params: TCommonGetListParams) => {
    setIsLoading(true);
    try {
      const response = unwrapResult(await dispatch(getClientFiles({ clientId, filter: params })));
      setClientFiles({ ...clientFiles, ...response });
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (page: number) => {
    const newParams = {
      ...clientsParams,
      page,
    };
    setClientsParams(newParams);
  };

  const handleSearchClient = (keyword: string) => {
    const newParams = {
      ...clientsParams,
      page: DEFAULT_PAGE,
      keyword,
    };
    setClientsParams(newParams);
  };

  const handleClickRow = (client: TClientFile) => {
    window.open(client.url || '', '__self');
  };

  const handleDownloadFile = ({
    clientId,
    fileId,
    fileName,
    fileExtension,
  }: {
    clientId?: string;
    fileId: string;
    fileName?: string;
    fileExtension?: string;
  }) => {
    downloadClientFile(
      {
        clientId,
        fileId,
        fileName,
        fileExtension,
      },
      dispatch,
    );
  };

  useEffect(() => {
    getClientListFile(clientsParams);
  }, [clientsParams]);

  const handleSubmitUploadFile = async (values: TClientUploadFileRequest) => {
    setIsLoading(true);
    try {
      values.clientId = clientId;
      const result = unwrapResult(await dispatch(clientUploadFile(values)));
      if (result.id) {
        showSuccessToast('Upload file successfully');
        getClientListFile(clientsParams);
        return result;
      } else {
        showErrorToast(result.message);
      }
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (values: { sortBy: EClientFileSortBy; sortType: ESortType }) => {
    const newParams = {
      ...clientsParams,
      ...values,
      page: DEFAULT_PAGE,
    };
    setSortBy(values.sortBy);
    setSortType(!values.sortType || values.sortType === ESortType.DESC ? ESortType.ASC : ESortType.DESC);
    setClientsParams(newParams);
  };

  return (
    <div className="ClientFiles">
      <div className="ClientFiles__header">
        <BaseText type="title" textAlign="left">
          Files
        </BaseText>
        <div
          className="ClientFiles__btnUpload"
          onClick={() => {
            setIsOpenNewFileModal(true);
          }}
        >
          <UploadIcon />
          <BaseText type="small" className="textBtn">
            Upload a new file
          </BaseText>
        </div>
      </div>
      <SearchInput placeHolder="Search" width="100%" onChange={handleSearchClient} />
      <ClientFiles
        loading={isLoading}
        {...clientFiles}
        onDelete={showConfirmDelete}
        onChangePage={handleChangePage}
        onSort={handleFilter}
        sortType={sortType}
        sortBy={sortBy}
        onClickRow={handleClickRow}
        onDownload={handleDownloadFile}
      />
      <ConfirmModal
        icon={<IconDelete />}
        open={isConfirmDelete}
        onCancelButton={() => setIsConfirmDelete(false)}
        onsubmit={() => {
          handleDelete();
        }}
        titleModal="Remove this file?"
        txtBtnCancel="Cancel"
        txtBtnConfirm="Yes"
        className="btn-delete-color"
      >
        <BaseText type="body1" textAlign="center" className="ClientFiles__removeDescription">
          Do you want to remove this file from this client’s folder?
        </BaseText>
      </ConfirmModal>

      <UploadModal
        open={isOpenNewFileModal}
        onClose={() => {
          setIsOpenNewFileModal(false);
        }}
        onSubmit={handleSubmitUploadFile}
      />
    </div>
  );
};

export default FileTab;
