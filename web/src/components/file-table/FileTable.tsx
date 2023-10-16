import { ColumnsType } from 'antd/es/table';

import Table from 'src/components/table';
import { DocumentIcon, FolderItemIcon, HomeworkDeleteIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import { TFilterValues, TPagination } from 'src/interfaces/common-interface';
import './FileTable.scss';
import { TClientFile } from 'src/interfaces/clients-interface';
import dayjs from 'dayjs';
import { DownOutlined, DownloadOutlined, UpOutlined } from '@ant-design/icons';
import { EClientFileSortBy, ESortType, EUserType, FileMode, FileType } from 'src/variables/enum-variables';
import { useParams } from 'react-router-dom';
import { getFileFromPath } from 'src/utils/common-utils';
import { TFile } from 'src/interfaces/files-interface';

export interface RecordType extends TClientFile, TFile {}

interface IProps extends TPagination {
  data?: TClientFile[];
  loading?: boolean;
  sortType?: string | ESortType;
  sortBy?: string | EClientFileSortBy;
  onChangePage?: (page: number) => void;
  onDelete?: (id: string, typeFile?: string) => void;
  onClickRow?: (rowData: RecordType) => void;
  onFilter?: (values: TFilterValues) => void;
  onSort?: (values: { sortBy: EClientFileSortBy; sortType: ESortType }) => void;
  onDownload?: ({
    clientId,
    fileId,
    fileName,
    fileExtension,
  }: {
    clientId?: string;
    fileId: string;
    fileName: string;
    fileExtension?: string;
  }) => void;
  columnName?: string;
  activeTabKey?: string;
  profileRole?: string;
}

const ClientFiles = ({
  data,
  loading,
  currentPage,
  totalPage,
  totalRecord,
  onChangePage,
  onDelete,
  onClickRow,
  onFilter,
  onSort,
  onDownload,
  sortType,
  sortBy,
  columnName,
  activeTabKey,
  profileRole,
}: IProps) => {
  const pagination = { currentPage, totalPage, totalRecord };
  const { clientId } = useParams() as { clientId: string };

  const column: ColumnsType<RecordType> = [
    {
      title: () => {
        return (
          <div className="title">
            <BaseText>{columnName ?? 'File name'}</BaseText>
            {!sortType || (sortBy === EClientFileSortBy.NAME && sortType === ESortType.DESC) ? (
              <UpOutlined
                style={{ color: '#8A8A8A' }}
                onClick={() => {
                  if (onSort) onSort({ sortBy: EClientFileSortBy.NAME, sortType: ESortType.DESC });
                }}
              />
            ) : (
              <DownOutlined
                style={{ color: '#8A8A8A' }}
                onClick={() => {
                  if (onSort) onSort({ sortBy: EClientFileSortBy.NAME, sortType: ESortType.ASC });
                }}
              />
            )}
          </div>
        );
      },
      key: 'fileName',
      width: 296,
      render: (_, data) => (
        <div className="details_container">
          {data.type === FileType.FOLDER ? <FolderItemIcon /> : <DocumentIcon />}
          <BaseText type="body1">{data.name}</BaseText>
        </div>
      ),
    },
    {
      title: () => {
        return (
          <div className="title">
            <BaseText>Modified</BaseText>
            {sortBy === EClientFileSortBy.CREATED_AT && sortType === ESortType.DESC ? (
              <UpOutlined
                style={{ color: '#8A8A8A' }}
                onClick={() => {
                  if (onSort) onSort({ sortBy: EClientFileSortBy.CREATED_AT, sortType: ESortType.DESC });
                }}
              />
            ) : (
              <DownOutlined
                style={{ color: '#8A8A8A' }}
                onClick={() => {
                  if (onSort) onSort({ sortBy: EClientFileSortBy.CREATED_AT, sortType: ESortType.ASC });
                }}
              />
            )}
          </div>
        );
      },
      key: 'modified',
      dataIndex: 'modified',
      width: 296,
      render: (_, data) => (
        <div className="filter_custom">
          <BaseText type="body1">{dayjs(data.createdAt).format('MMMM D, YYYY')}</BaseText>
        </div>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_, data) => {
        return (
          <div className="row-action">
            {!onDownload ? (
              <></>
            ) : (
              <DownloadOutlined
                className="row-action__icons"
                onClick={(e) => {
                  e.stopPropagation();
                  const extension = getFileFromPath(data.fileExtension ? data.fileExtension : data.fileExt);
                  onDownload({ clientId, fileId: data.id, fileName: data.name, fileExtension: extension });
                }}
              />
            )}
            {profileRole === EUserType.PRACTITIONER && activeTabKey === FileMode.PUBLIC ? (
              <></>
            ) : (
              <HomeworkDeleteIcon
                className="row-action__icons"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete) onDelete(data.id, data.type);
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      className="FileTable"
      dataSource={data}
      columns={column}
      loading={loading}
      pagination={pagination}
      onFilter={onFilter}
      onClickRow={onClickRow}
      onChangePage={onChangePage}
      rowKey={(data) => data.id}
    />
  );
};

export default ClientFiles;
