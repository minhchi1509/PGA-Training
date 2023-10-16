import { Pagination as AntPagination } from 'antd';

import { TPagination } from 'src/interfaces/common-interface';
import { DEFAULT_PAGE_SIZE } from 'src/variables/common';
import './Pagination.scss';

interface IProps extends TPagination {
  pageSize?: number;
  onChangePage?: (page: number) => void;
}

const Pagination = ({ currentPage, totalRecord, pageSize = DEFAULT_PAGE_SIZE, onChangePage }: IProps) => {
  return (
    <AntPagination
      className="Pagination"
      current={currentPage}
      total={totalRecord}
      pageSize={pageSize}
      onChange={onChangePage}
    />
  );
};

export default Pagination;
