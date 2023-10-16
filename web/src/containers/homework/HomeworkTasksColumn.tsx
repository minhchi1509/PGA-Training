import { useSelector } from 'react-redux';

import Collapse from 'src/components/collapse';
import { SearchInput } from 'src/components/input';
import { BaseText } from 'src/components/typography';
import { THomework, TTaskItemData } from 'src/interfaces/clients-interface';
import { THomeworkTopic } from 'src/interfaces/homework-topics';
import { EDragDropColumnId } from 'src/pages/clients/client-details-page-constants';
import { TRootState } from 'src/stores';
import { SEPARATE_TYPE_HOMEWORK } from 'src/variables/client';
import DragDropTasksColumn from './DragDropTasksColumn';
import './HomeworkTasksColumn.scss';

interface IProps {
  className?: string;
  selectedTopic: THomeworkTopic;
  selectedHomeworkIds: string[];
  searchValue: string;
  onLoadMore: (page: number, type?: EDragDropColumnId) => void;
  onSearchHomework: (keyword: string) => void;
  onClickHomework: (item: TTaskItemData) => void;
}

const HomeworkTasksColumn = ({
  className,
  selectedTopic,
  selectedHomeworkIds,
  searchValue,
  onLoadMore,
  onClickHomework,
  onSearchHomework,
}: IProps) => {
  const homework = useSelector((state: TRootState) => state.homeworkTopics.homework);

  const isSeparateHomeworkList = SEPARATE_TYPE_HOMEWORK.includes(selectedTopic?.homeworkType);
  const allHomework = homework[selectedTopic?.id];
  const ownerHomework = isSeparateHomeworkList ? homework[`${selectedTopic?.id}-owner`] : undefined;
  const generalHomework = isSeparateHomeworkList ? homework[`${selectedTopic?.id}-general`] : undefined;

  const convertHomework = (homework?: THomework[]): TTaskItemData[] => {
    return (
      homework?.map((homework) => ({
        id: homework.id,
        title: homework.title,
        type: homework.type,
        videoUrl: homework.videoLink ?? '',
        description: homework.description,
        remindAtFormat: homework.reminderAtFormat ? { ...homework.reminderAtFormat } : undefined,
        showPreviewImg: true,
        timezone: homework.timezone,
      })) ?? []
    );
  };

  return (
    <div className={`HomeworkTasksColumn ${className ?? ''}`}>
      <BaseText type="title">{selectedTopic?.name}</BaseText>
      <SearchInput className="HomeworkTasksColumn__search" value={searchValue} onChange={onSearchHomework} />
      <BaseText type="caption" className="HomeworkTasksColumn__note">
        Drag to assign homework tasks to the customer
      </BaseText>

      {isSeparateHomeworkList && (
        <Collapse
          className="HomeworkTasksColumn__collapse"
          items={[
            {
              key: 'general',
              header: 'General tasks',
              content: (
                <DragDropTasksColumn
                  className="HomeworkTasksColumn__list"
                  itemClassName="HomeworkTasksColumn__item"
                  columnId={EDragDropColumnId.GENERAL}
                  items={convertHomework(generalHomework?.data)}
                  selectedItemIds={selectedHomeworkIds}
                  hasMore={(generalHomework?.currentPage ?? 0) < (generalHomework?.totalPage ?? 0)}
                  onLoadMore={() => onLoadMore(Number(generalHomework?.currentPage) + 1, EDragDropColumnId.GENERAL)}
                  onClick={onClickHomework}
                />
              ),
            },
            {
              key: 'my owner',
              header: 'My own tasks',
              content: (
                <DragDropTasksColumn
                  className="HomeworkTasksColumn__list"
                  itemClassName="HomeworkTasksColumn__item"
                  columnId={EDragDropColumnId.OWN}
                  items={convertHomework(ownerHomework?.data)}
                  selectedItemIds={selectedHomeworkIds}
                  hasMore={(ownerHomework?.currentPage ?? 0) < (ownerHomework?.totalPage ?? 0)}
                  onLoadMore={() => onLoadMore(Number(ownerHomework?.currentPage) + 1, EDragDropColumnId.OWN)}
                  onClick={onClickHomework}
                />
              ),
            },
          ]}
        />
      )}

      {!isSeparateHomeworkList && (
        <DragDropTasksColumn
          className="HomeworkTasksColumn__list all"
          itemClassName="HomeworkTasksColumn__item"
          columnId={EDragDropColumnId.ALL}
          items={convertHomework(allHomework?.data)}
          selectedItemIds={selectedHomeworkIds}
          hasMore={allHomework?.currentPage < allHomework?.totalPage}
          onLoadMore={() => onLoadMore(Number(allHomework?.currentPage) + 1)}
          onClick={onClickHomework}
        />
      )}
    </div>
  );
};

export default HomeworkTasksColumn;
