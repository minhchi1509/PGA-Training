import dayjs, { Dayjs } from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Empty, Skeleton } from 'antd';
import DatePicker from 'src/components/date-picker';
import { BaseText } from 'src/components/typography';
import HomeworkHistoriesByDate from 'src/containers/homework/HomeworkHistoriesByDate';
import { TGetHomeworkHistoryListResponse, TTaskItemData } from 'src/interfaces/clients-interface';
import { TRangeDate } from 'src/interfaces/common-interface';
import './HomeworkHistory.scss';

interface IProps {
  className?: string;
  rangeDate: TRangeDate;
  loading?: boolean;
  homeworkHistoryList: TGetHomeworkHistoryListResponse;
  onLoadMore: () => void;
  onClickItem: (item: TTaskItemData) => void;
  onChangeRangeDate: (range: TRangeDate) => void;
}

const HomeworkHistory = ({
  className,
  loading,
  rangeDate,
  homeworkHistoryList,
  onLoadMore,
  onClickItem,
  onChangeRangeDate,
}: IProps) => {
  const handleChangeDate = (date: Dayjs | null, isStartDate?: boolean) => {
    const newRange = { ...rangeDate, ...(isStartDate ? { fromDate: date } : { toDate: date }) };
    onChangeRangeDate(newRange);
  };

  const disableDate = (date: Dayjs | null, isStartDate?: boolean): boolean => {
    if (isStartDate) {
      return date ? date > dayjs(rangeDate.toDate).endOf('day') : false;
    }

    return date ? date < dayjs(rangeDate.fromDate).startOf('day') : false;
  };

  return (
    <div className={`HomeworkHistory ${className ?? ''}`}>
      <BaseText type="title">Homework history</BaseText>

      <div className="HomeworkHistory__range">
        <DatePicker
          value={rangeDate.fromDate}
          allowClear={false}
          disabledDate={(date) => disableDate(date, true)}
          onChange={(date) => handleChangeDate(date, true)}
        />
        -
        <DatePicker
          value={rangeDate.toDate}
          allowClear={false}
          disabledDate={(date) => disableDate(date, false)}
          onChange={(date) => handleChangeDate(date, false)}
        />
      </div>
      <div className="HomeworkHistory__list" id="homework-history-list-scroll">
        {loading ? (
          <Skeleton />
        ) : !homeworkHistoryList?.data?.length ? (
          <Empty description="No homework history" />
        ) : (
          <InfiniteScroll
            scrollableTarget="homework-history-list-scroll"
            height={580}
            scrollThreshold={1}
            dataLength={homeworkHistoryList.currentPage * (homeworkHistoryList?.pageSize ?? 10)}
            loader={<Skeleton.Input style={{ marginTop: 6 }} block active />}
            hasMore={homeworkHistoryList.currentPage < homeworkHistoryList.totalPage}
            next={onLoadMore}
          >
            {homeworkHistoryList.data.map((item) => (
              <HomeworkHistoriesByDate
                key={item.id}
                date={item.id}
                historyItems={item.historyItems}
                onClickItem={onClickItem}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default HomeworkHistory;
