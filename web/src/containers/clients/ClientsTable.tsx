import { ColumnsType } from 'antd/es/table';

import Table from 'src/components/table';
import Button from 'src/components/button';
import StatusBox from 'src/components/status-box';
import { FilterIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import { TFilterValues, TPagination } from 'src/interfaces/common-interface';
import { EProfileStatus } from 'src/variables/common';
import './ClientsTable.scss';
import { TClient } from 'src/interfaces/clients-interface';

interface IProps extends TPagination {
  data: TClient[];
  loading: boolean;
  onChangePage: (page: number) => void;
  onDischarge: (clientId: string) => void;
  onClickRow: (rowData: TClient) => void;
  onFilter: (values: TFilterValues) => void;
}

const ClientsTable = ({
  data,
  loading,
  currentPage,
  totalPage,
  totalRecord,
  onChangePage,
  onDischarge,
  onClickRow,
  onFilter,
}: IProps) => {
  const pagination = { currentPage, totalPage, totalRecord };

  const column: ColumnsType<TClient> = [
    {
      title: 'Clients name',
      key: 'firstName',
      render: (_, data) => (
        <div className="details_container">
          <div className="avatar">
            <img src={data.avatar} />
          </div>
          <BaseText type="body1">
            {data.firstName} {data.lastName}
          </BaseText>
        </div>
      ),
    },
    {
      title: 'Client email',
      key: 'email',
      dataIndex: 'email',
    },

    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      width: 160,
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
          text: 'Discharged',
          value: 'INACTIVE',
        },
      ],
      render: (_, data) => <StatusBox status={data.statusConvert} isShowDischarge={true} />,
      filterIcon: () => (
        <div className="filter_custom">
          <FilterIcon />
        </div>
      ),
    },
    {
      title: '-',
      key: 'action',
      width: 160,
      render: (_, data) => {
        const clickable = data.statusConvert === EProfileStatus.ACTIVE;

        return (
          <Button
            type="primary"
            className="ClientsTable__dischargeBtn"
            disabled={!clickable}
            danger
            onClick={(e) => {
              e.stopPropagation();
              onDischarge(data.clientId);
            }}
          >
            Discharge
          </Button>
        );
      },
    },
  ];

  return (
    <Table
      className="ClientsTable"
      dataSource={data}
      columns={column}
      loading={loading}
      pagination={pagination}
      onFilter={onFilter}
      onClickRow={onClickRow}
      onChangePage={onChangePage}
      rowKey={(record) => record.id}
    />
  );
};

export default ClientsTable;
