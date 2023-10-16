import { ColumnsType } from 'antd/es/table';
import { FilterIcon } from 'src/assets/icons';
import StatusBox from 'src/components/status-box/StatusBox';

import Table from 'src/components/table';
import { BaseText } from 'src/components/typography';
import { TPagination } from 'src/interfaces/common-interface';
import { TPractitioner } from 'src/interfaces/practitioners-interface';
import './PractitionersTable.scss';

interface IProps extends TPagination {
  data: TPractitioner[];
  loading: boolean;
  onChangePage: (page: number) => void;
  onClickRow: (rowData: TPractitioner) => void;
}

const column: ColumnsType<TPractitioner> = [
  {
    title: 'Practitioners',
    key: 'firstName',
    render: (_, data) => (
      <div className="details_container">
        <div className="avatar">
          <img src={data.avatar} />
        </div>
        <BaseText type="body1">{`${data.firstName} ${data.lastName}`}</BaseText>
      </div>
    ),
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
  },
  {
    title: 'Total active clients',
    key: 'lastName',
    render: (_, data) => <span>{data.totalActiveClient ?? 0}</span>,
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    filters: [
      {
        text: 'Active',
        value: 'ACTIVE',
      },
      {
        text: 'Pending',
        value: 'PENDING',
      },
      {
        text: 'Inactive',
        value: 'INACTIVE',
      },
    ],
    onFilter: (value: string | number | boolean, record) => record.status.indexOf(value as string) === 0,
    render: (_, data) => <StatusBox status={data.status} />,
    filterIcon: () => <FilterIcon />,
  },
];

const PractitionersTable = ({
  data,
  loading,
  currentPage,
  totalPage,
  totalRecord,
  onClickRow,
  onChangePage,
}: IProps) => {
  const pagination = { currentPage, totalPage, totalRecord };

  return (
    <Table
      className="PractitionersTable"
      dataSource={data}
      columns={column}
      loading={loading}
      pagination={pagination}
      onChangePage={onChangePage}
      onClickRow={onClickRow}
      rowKey={'id'}
    />
  );
};

export default PractitionersTable;
