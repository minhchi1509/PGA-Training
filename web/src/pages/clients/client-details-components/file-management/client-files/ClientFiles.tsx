import { ColumnsType } from 'antd/es/table';

import Table from 'src/components/table';
import { DocumentIcon, HomeworkDeleteIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import { TFilterValues, TPagination } from 'src/interfaces/common-interface';
import './ClientFiles.scss';
import { TClientFile } from 'src/interfaces/clients-interface';
import dayjs from 'dayjs';
import { DownOutlined, DownloadOutlined, UpOutlined } from '@ant-design/icons';
import { EClientFileSortBy, ESortType } from 'src/variables/enum-variables';
import { useParams } from 'react-router-dom';
import { getFileFromPath } from 'src/utils/common-utils';

interface IProps extends TPagination {
  data?: TClientFile[];
  loading?: boolean;
  sortType?: ESortType;
  sortBy?: EClientFileSortBy;
  onChangePage?: (page: number) => void;
  onDelete?: (id: string) => void;
  onClickRow?: (rowData: TClientFile) => void;
  onFilter?: (values: TFilterValues) => void;
  onSort?: (values: { sortBy: EClientFileSortBy; sortType: ESortType }) => void;
  onDownload?: (clientId: string, fileId: string, fileName: string, fileExtension?: string) => void;
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
}: IProps) => {
  const pagination = { currentPage, totalPage, totalRecord };
  const { clientId } = useParams() as { clientId: string };

  const column: ColumnsType<TClientFile> = [
    {
      title: () => {
        return (
          <div className="title">
            <BaseText>File name</BaseText>
            {sortBy === EClientFileSortBy.NAME && sortType === ESortType.DESC ? (
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
          <DocumentIcon />
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
            <DownloadOutlined
              className="row-action__icons"
              onClick={(e) => {
                e.stopPropagation();
                const extension = getFileFromPath(data.fileExtension ?? '');
                if (onDownload) onDownload(clientId, data.id, data.name, extension);
              }}
            />
            <HomeworkDeleteIcon
              className="row-action__icons"
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete(data.id);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Table
      className="ClientsFiles"
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
