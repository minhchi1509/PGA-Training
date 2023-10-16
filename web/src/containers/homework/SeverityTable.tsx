import { ColumnsType } from 'antd/es/table';

import Table from 'src/components/table';
import { TSeverityColumnData, THomeworkSeverity } from 'src/interfaces/clients-interface';

interface IProps {
  data: THomeworkSeverity;
}

const sortKeys = ['Normal', 'Mild', 'Moderate', 'Severe', 'Extremely Severe'];

const convertRangeValueToString = ({ from, to }: { from: number; to: number | null }) =>
  `${from}${to ? `-${to}` : '+'}`;

const columns: ColumnsType<TSeverityColumnData> = [
  {
    title: '',
    render: (_value, record) => record.name,
  },
  {
    title: 'Depression',
    render: (_value, record) => record.depression,
  },
  {
    title: 'Anxiety',
    render: (_value, record) => record.anxiety,
  },
  {
    title: 'Stress',
    render: (_value, record) => record.stress,
  },
];

const SeverityTable = ({ data }: IProps) => {
  const formattedData: TSeverityColumnData[] = sortKeys.map((key) => ({
    name: key,
    depression: convertRangeValueToString(data?.[key]?.Depression),
    anxiety: convertRangeValueToString(data?.[key]?.Anxiety),
    stress: convertRangeValueToString(data?.[key]?.Stress),
  }));

  return <Table className="SeverityTable" columns={columns} dataSource={formattedData} />;
};

export default SeverityTable;
