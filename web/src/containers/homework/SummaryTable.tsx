import { ColumnsType } from 'antd/es/table';

import Table from 'src/components/table';
import { THomeworkSummaryScore, TSummaryScoreColumnData } from 'src/interfaces/clients-interface';
import { capitalizeFirstLetter } from 'src/utils/common-utils';

interface IProps {
  data: THomeworkSummaryScore;
}

const sortKeys = ['total', 'Depression', 'Anxiety', 'Stress'];

const columns: ColumnsType<TSummaryScoreColumnData> = [
  {
    title: '',
    render: (_value, record) => record.name,
  },
  {
    title: 'Raw score',
    render: (_value, record) => record.score,
  },
  {
    title: 'Category',
    render: (_value, record) => record.category,
  },
];

const SummaryTable = ({ data }: IProps) => {
  const formattedData = sortKeys.map((key) => ({
    name: capitalizeFirstLetter(key),
    score: typeof data[key] === 'number' ? data[key] : data[key].score,
    category: typeof data[key] !== 'number' ? data[key].category : '-',
  }));

  return <Table className="SummaryTable" columns={columns} dataSource={formattedData} />;
};

export default SummaryTable;
