import { PlusOutlined } from '@ant-design/icons';
import { Skeleton, Space } from 'antd';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import './AllAssignedTasks.scss';
import Button from 'src/components/button';
import { SearchInput } from 'src/components/input';
import { TabsHeader } from 'src/components/tabs';
import { BaseText } from 'src/components/typography';
import { TTaskItemData } from 'src/interfaces/clients-interface';
import { TRootState } from 'src/stores';
import { EClientsAction } from 'src/stores/clients';
import { EProfileStatus } from 'src/variables/common';
import { EFrequencyType } from 'src/variables/enum-variables';
import { ALL_ASSIGNED_TASKS_TABS } from '../../client-details-page-constants';
import AssignedTaskList from './AssignedTaskList';
import { IClientGeneralInformation } from '../../client-details-page-interface';
import dayjs from 'dayjs';

interface IProps {
  className?: string;
  activeTabKey: string;
  searchKey: string;
  clientGeneralInformation: IClientGeneralInformation;
  onSearch: (keyword: string) => void;
  onClickAssignHomework: () => void;
  onClickRemoveTask: (id: string) => void;
  onChangeTab: (tabKey: string) => void;
  onLoadMore: () => void;
  onClick: (item: TTaskItemData) => void;
}

const AllAssignedTasks = ({
  className,
  activeTabKey,
  searchKey,
  clientGeneralInformation,
  onClick,
  onSearch,
  onChangeTab,
  onLoadMore,
  onClickAssignHomework,
  onClickRemoveTask,
}: IProps) => {
  const { assignedHomework, totalHomework, loading } = useSelector((state: TRootState) => ({
    assignedHomework: state.clients.assignedHomework,
    totalHomework: state.clients.totalHomework,
    loading: state.loading[EClientsAction.GET_CLIENT_HOMEWORK],
  }));

  const formattedHomework = useMemo(() => {
    const formatted: TTaskItemData[] = assignedHomework.data.map((homework) => ({
      id: homework.id,
      title: homework.homeworkTitle,
      assigned: true,
      repeat: homework.frequency === EFrequencyType.CUSTOM,
      startDate: dayjs(new Date(homework.startDate)).tz(homework.timezone),
      endDate: homework.frequency === EFrequencyType.CUSTOM ? new Date(homework.endDate ?? '') : undefined,
      type: homework.homeworkType,
      showPreviewImg: false,
      status: homework.status,
      timezone: homework.timezone,
    }));

    return formatted;
  }, [assignedHomework]);

  const handleRemoveTask = (task: TTaskItemData) => {
    onClickRemoveTask(task.id);
  };

  return (
    <div className={`AllAssignedTasks ${className ?? ''}`}>
      <div className="AllAssignedTasks__header">
        <Space size={10}>
          <BaseText type="title">All assigned homework tasks</BaseText>
          <BaseText inline className="AllAssignedTasks__header-total">
            {totalHomework}
          </BaseText>
        </Space>
        <Space size={10} className="AllAssignedTasks__header-action">
          <BaseText inline type="caption">
            Assign homework
          </BaseText>
          <Button
            noBorder
            icon={<PlusOutlined color="#48ABE2" />}
            shape="circle"
            className="AllAssignedTasks__header-action-btn"
            disabled={clientGeneralInformation.statusConvert === EProfileStatus.INACTIVE}
            onClick={onClickAssignHomework}
          />
        </Space>
      </div>
      <div className="AllAssignedTasks__tabs">
        <TabsHeader
          className="AllAssignedTasks__tabs-header"
          items={ALL_ASSIGNED_TASKS_TABS}
          activeKey={activeTabKey as string}
          secondaryHeader
          onChangeTab={onChangeTab}
        />

        <SearchInput placeHolder="Search" value={searchKey} onChange={onSearch} />

        {loading ? (
          <Skeleton />
        ) : (
          <>
            <AssignedTaskList
              hasMore={assignedHomework?.currentPage < assignedHomework?.totalPage}
              items={formattedHomework}
              clientStatus={clientGeneralInformation.statusConvert}
              onClick={onClick}
              onLoadMore={onLoadMore}
              onRemove={handleRemoveTask}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AllAssignedTasks;
