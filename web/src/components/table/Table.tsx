/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table as TableAnt, TableProps } from 'antd';
import { TFilterValues, TPagination } from 'src/interfaces/common-interface';
import Pagination from '../pagination';

import './Table.scss';

interface IProps extends Omit<TableProps<any>, 'pagination'> {
  pagination?: TPagination;
  onFilter?: (values: TFilterValues) => void;
  onChangePage?: (page: number) => void;
  onClickRow?: (record: any, index?: number, event?: React.MouseEvent<any, MouseEvent>) => void;
}

const Table = ({ className, pagination, onFilter, onChangePage, onClickRow, ...rest }: IProps) => {
  const showPagination = pagination?.totalPage && pagination?.totalPage > 1;

  return (
    <div className="Table__wrapper">
      <TableAnt
        className={`Table ${className ?? ''}`}
        {...rest}
        pagination={false}
        sticky
        onRow={(record, index) => ({
          onClick: (event) => {
            event.stopPropagation();
            onClickRow?.(record, index, event);
          },
        })}
        onChange={(_pagination, filters) => {
          onFilter?.(filters);
        }}
      />
      {!!showPagination && <Pagination {...pagination} onChangePage={onChangePage} />}
    </div>
  );
};

export default Table;
