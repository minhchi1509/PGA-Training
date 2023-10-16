import { CommonContent } from 'src/components/containers';
import './SummaryComponent.scss';
import TasksAssignedImg from 'src/assets/images/tasks-assigned.png';
import TasksCompletedImg from 'src/assets/images/tasks-completed.png';

import { BaseText } from 'src/components/typography';
import { getOwnerSummaryAssignTask, getPractitionerSummaryAssignTask } from 'src/stores/practitioners';
import ResponseError from 'src/interfaces/error-response-interface';
import { showErrorToast } from 'src/components/toast/Toast';
import { unwrapResult } from '@reduxjs/toolkit';
import { TRootState, useAppDispatch } from 'src/stores';
import { useEffect, useState } from 'react';
import { TSummaryAssignTask } from 'src/interfaces/practitioners-interface';
import { useSelector } from 'react-redux';
import { EUserType } from 'src/variables/enum-variables';

const SummaryComponent = () => {
  const dispatch = useAppDispatch();
  const profile = useSelector((state: TRootState) => state.user.profile);
  const role = profile?.role;
  const [summaryAssignTask, setSummaryAssignTask] = useState<TSummaryAssignTask>({
    totalAssignTasks: 0,
    totalCompletedTasks: 0,
  });

  const totalSummaryAssignTask = async () => {
    try {
      let result;
      if (role === EUserType.OWNER) {
        result = unwrapResult(await dispatch(getOwnerSummaryAssignTask()));
      } else {
        result = unwrapResult(await dispatch(getPractitionerSummaryAssignTask()));
      }
      if (result) {
        setSummaryAssignTask({ ...summaryAssignTask, ...result });
      }
    } catch (error) {
      const { message } = error as ResponseError;
      showErrorToast(message);
    }
  };

  useEffect(() => {
    if (role) {
      totalSummaryAssignTask();
    }
  }, [role]);

  return (
    <CommonContent title="Summary for last week" className="SummaryComponent">
      <div className="SummaryComponent__content">
        <div className="SummaryComponent__content-card">
          <div className="SummaryComponent__content-card-head">
            <BaseText type="xl" className="total-number">
              {summaryAssignTask.totalAssignTasks}
            </BaseText>
            <BaseText type="subHeading">Total assigned tasks</BaseText>
          </div>
          <div className="SummaryComponent__content__card-img">
            <img src={TasksAssignedImg} />
          </div>
        </div>
        <div className="SummaryComponent__content-card">
          <div className="SummaryComponent__content-card-head">
            <BaseText type="xl" className="total-number">
              {summaryAssignTask.totalCompletedTasks}
            </BaseText>
            <BaseText type="subHeading">Total completed tasks</BaseText>
          </div>
          <div className="SummaryComponent__content-card-img">
            {' '}
            <img src={TasksCompletedImg} />
          </div>
        </div>
      </div>
    </CommonContent>
  );
};

export default SummaryComponent;
