import { CommonContent, Container } from 'src/components/containers';

import Button from 'src/components/button';
import { MenuProps, Space } from 'antd';
import { BaseText } from 'src/components/typography';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons';
import Tabs from 'src/components/tabs';
import { TCommonGetListParams, TTabItem } from 'src/interfaces/common-interface';
import { FILES_TAB_LABEL } from './files-page-constants';
import { useEffect, useState } from 'react';
import './FilesPage.scss';
import { SearchInput } from 'src/components/input';
import FileTable from 'src/components/file-table/FileTable';
import { DEFAULT_GET_LIST_FILE_MANAGEMENT_PARAMS } from 'src/variables/common';
import { EClientFileSortBy, ESortType, EUserType, FileMode, FileType } from 'src/variables/enum-variables';
import { DEFAULT_PAGE } from 'src/variables/common';
import { downloadFileManagement } from 'src/utils/common-utils';
import { TRootState, useAppDispatch } from 'src/stores';
import Dropdown from 'src/components/dropdown';
import { FolderIcon, IconDelete, UploadFileIcon, UploadIcon } from 'src/assets/icons';
import { ConfirmModal } from 'src/components/popup';
import UploadModal from 'src/components/upload-modal/UploadModal';
import { unwrapResult } from '@reduxjs/toolkit';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import ResponseError from 'src/interfaces/error-response-interface';
import NewFolderModal from './new-folder/NewFolderModal';
import {
  TFile,
  TGetListFilesResponse,
  TNewFolderRequest,
  TUploadFileManagementRequest,
} from 'src/interfaces/files-interface';
import { useSelector } from 'react-redux';
import {
  createFolder,
  deleteFileManagement,
  getListFileByFolder,
  getListFiles,
  uploadFileManagement,
} from 'src/stores/files';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from 'src/routes/routes-constants';

const FilesPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { folderId } = useParams() as { folderId: string };
  const currentProfile = useSelector((state: TRootState) => state.user.profile);
  const currentProfileRole = currentProfile?.role;
  const [activeTabKey, setActiveTabKey] = useState<FileMode>(FileMode.PRIVATE);
  const [filesParams, setFilesParams] = useState<TCommonGetListParams>(DEFAULT_GET_LIST_FILE_MANAGEMENT_PARAMS);
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [selectedFileType, setSelectedFileType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<TFile>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenNewFileModal, setIsOpenNewFileModal] = useState<boolean>(false);
  const [isOpenNewFolderModal, setIsOpenNewFolderModal] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>();
  const [sortBy, setSortBy] = useState<string>();
  const [listFile, setListFiles] = useState<TGetListFilesResponse>({
    data: [],
    currentPage: 1,
    totalPage: 1,
    totalRecord: 0,
  });

  const tabLabel =
    currentProfileRole === EUserType.SOLO_PRACTITIONER
      ? Object.keys(FILES_TAB_LABEL).filter((item) => item === FileMode.PRIVATE)
      : Object.keys(FILES_TAB_LABEL);

  const items: TTabItem[] = tabLabel.map((item) => {
    const tabItem = {
      key: item,
      label: FILES_TAB_LABEL[item],
      children: FILES_TAB_LABEL[item],
    };

    switch (item) {
      case FileMode.PRIVATE:
        return {
          ...tabItem,
          children: <></>,
        };
      case FileMode.PUBLIC:
        return {
          ...tabItem,
          children: <></>,
        };

      default:
        return tabItem;
    }
  });

  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Upload',
      icon: <UploadFileIcon height={20} width={20} />,
      onClick: () => setIsOpenNewFileModal(true),
    },
    {
      key: '2',
      label: 'Folder',
      icon: <FolderIcon height={20} width={20} />,
      onClick: () => setIsOpenNewFolderModal(true),
    },
  ];

  const changeActiveTab = () => {
    navigate(RoutePaths.FILES);
  };

  useEffect(() => {
    changeActiveTab();
  }, [activeTabKey]);

  const getListFileData = async (params: TCommonGetListParams) => {
    setIsLoading(true);
    try {
      const response = unwrapResult(await dispatch(getListFiles({ mode: activeTabKey, filter: params })));
      setListFiles({ ...listFile, ...response });
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getListFileInFolder = async (params: TCommonGetListParams, folderId: string) => {
    setIsLoading(true);
    try {
      const response = unwrapResult(
        await dispatch(getListFileByFolder({ mode: activeTabKey, filter: params, folderId })),
      );
      setListFiles({ ...response });
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = () => {
    if (folderId) {
      getListFileInFolder(filesParams, folderId);
    } else {
      getListFileData(filesParams);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filesParams, activeTabKey, folderId]);

  const handleChangeTab = (tabKey: string) => {
    setActiveTabKey(tabKey as FileMode);
  };

  const showConfirmDelete = (fileId: string, fileType?: string) => {
    setIsConfirmDelete(true);
    setSelectedFileId(fileId);
    setSelectedFileType(fileType ? fileType : '');
  };

  const handleChangePage = (page: number) => {
    const newParams = {
      ...filesParams,
      page,
    };
    setFilesParams(newParams);
  };

  const handleFilter = (values: { sortBy: EClientFileSortBy; sortType: ESortType }) => {
    const newParams = {
      ...filesParams,
      ...values,
      page: DEFAULT_PAGE,
    };
    setSortBy(values.sortBy);
    setSortType(!values.sortType || values.sortType === ESortType.DESC ? ESortType.ASC : ESortType.DESC);
    setFilesParams(newParams);
  };

  const handleClickRow = (file: TFile) => {
    if (file.type === FileType.FOLDER) setSelectedFile(file);
    if (file.type === FileType.FILE) {
      const originalname = file?.originalname?.split('.');
      const fileExtension = file?.originalname?.split('.')[originalname?.length - 1];
      handleDownloadFile({ fileId: file.id, fileName: file.name, fileExtension });
    } else {
      navigate(`${RoutePaths.FILES}/${file.id}`);
    }
  };

  const handleDownloadFile = ({
    fileId,
    fileName,
    fileExtension,
  }: {
    fileId: string;
    fileName?: string;
    fileExtension?: string;
  }) => {
    downloadFileManagement(
      {
        fileId,
        fileName,
        fileExtension,
      },
      dispatch,
    );
  };

  const handleSubmitUploadFile = async (values: TUploadFileManagementRequest) => {
    try {
      values.mode = activeTabKey;
      if (folderId) values.folderId = folderId;
      if (values.name) values.description = values.name;
      const result = unwrapResult(await dispatch(uploadFileManagement(values)));
      if (result.id) {
        showSuccessToast('File has been uploaded successfully');
        fetchData();
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

  const handleSubmitNewFolderModal = async (values: TNewFolderRequest) => {
    try {
      values.mode = activeTabKey;
      const result = unwrapResult(await dispatch(createFolder(values)));
      if (result.id) {
        showSuccessToast('Folder has been created successfully');
        fetchData();
        return result;
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

  const handleSearchClient = (keyword: string) => {
    const newParams = {
      ...filesParams,
      page: DEFAULT_PAGE,
      keyword,
    };
    setFilesParams(newParams);
  };

  const handleDelete = async () => {
    try {
      const res = await dispatch(deleteFileManagement({ id: selectedFileId }));
      if (res.meta.requestStatus === 'fulfilled') {
        fetchData();
      }
      showSuccessToast(
        ` This ${selectedFileType && selectedFileType.toLocaleLowerCase()} has been removed successfully`,
      );
      setIsConfirmDelete(false);
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container className="ClientsPage">
      <CommonContent title="Files" className="ClientDetailsPage__wrapper">
        <Tabs items={items} activeKey={activeTabKey} defaultActiveKey={FileMode.PRIVATE} onChange={handleChangeTab} />
        <div className="FilesPage__container">
          <div className="FilesPage__header">
            <div className="FilesPage__header-left">
              {folderId && <LeftOutlined onClick={handleBack} className="Content__header-back" />}
              <BaseText type="title" textAlign="left">
                {folderId ? selectedFile?.name : FILES_TAB_LABEL[`${activeTabKey}`]}
              </BaseText>
            </div>
            {currentProfileRole === EUserType.PRACTITIONER && activeTabKey === FileMode.PUBLIC ? (
              <></>
            ) : folderId ? (
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
            ) : (
              <div className="FilesPage__btnUpload">
                <Space size={10} className="FilesPage__header-action">
                  <BaseText inline type="caption">
                    Create new
                  </BaseText>
                  <Dropdown menu={{ items: dropdownItems }} className="FilesPage__dropdown-btn" placement="bottomRight">
                    <Button
                      noBorder
                      icon={<PlusOutlined color="#48ABE2" />}
                      shape="circle"
                      className="FilesPage__header-action-btn"
                    />
                  </Dropdown>
                </Space>
              </div>
            )}
          </div>
          <SearchInput placeHolder="Search" width="100%" onChange={handleSearchClient} />
          <div>
            <FileTable
              loading={isLoading}
              columnName="Name"
              {...listFile}
              onDelete={showConfirmDelete}
              onChangePage={handleChangePage}
              onSort={handleFilter}
              sortType={sortType}
              sortBy={sortBy}
              onClickRow={handleClickRow}
              activeTabKey={activeTabKey}
              profileRole={currentProfileRole}
            />
          </div>
        </div>
      </CommonContent>

      <UploadModal
        open={isOpenNewFileModal}
        acceptFile=".jpg, .jpeg, .png, .docx, .xlsx, .csv, .pdf, .mov, .mp4"
        onClose={() => {
          setIsOpenNewFileModal(false);
        }}
        onSubmit={handleSubmitUploadFile}
      />

      <NewFolderModal
        open={isOpenNewFolderModal}
        onSubmit={handleSubmitNewFolderModal}
        closable={false}
        onClose={() => {
          setIsOpenNewFolderModal(false);
        }}
      />

      <ConfirmModal
        icon={<IconDelete />}
        open={isConfirmDelete}
        onCancelButton={() => setIsConfirmDelete(false)}
        onsubmit={() => {
          handleDelete();
        }}
        titleModal={selectedFileType === FileType.FOLDER ? 'Delete Folder' : 'Delete file'}
        txtBtnCancel="Cancel"
        txtBtnConfirm="Delete"
        className="btn-delete-color"
      >
        <BaseText type="body1" textAlign="center" className="ClientFiles__removeDescription">
          {`Do you want delete this ${selectedFileType && selectedFileType.toLocaleLowerCase()}?`}
        </BaseText>
      </ConfirmModal>
    </Container>
  );
};

export default FilesPage;
