import { Spin } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { showErrorToast } from 'src/components/toast/Toast';
import { TCommonGetDashboardParams, TGetDashboardResponse } from 'src/interfaces/common-interface';
import ResponseError from 'src/interfaces/error-response-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { getOwnerDashboard } from 'src/services/owner-service';
import { getTrialTime } from 'src/services/payment-service';
import { getPractitionerDashboard } from 'src/services/practitioner-service';
import { TRootState } from 'src/stores';
import { getCurrentTimezone } from 'src/utils/common-utils';
import { EUserType } from 'src/variables/enum-variables';
import { EProfileTabKey } from '../profile/profile-page-constants';
import Dashboard from './components/Dashboard';
import ExpireTrialModal from './components/ExpireTrialModal';
import './Home.scss';

const Home = () => {
  const navigate = useNavigate();
  const profile = useSelector((state: TRootState) => state.user.profile);
  const isOwnerRole = profile?.role && profile?.role === EUserType.OWNER;
  const requestDashboardParams: TCommonGetDashboardParams = {
    timezome: getCurrentTimezone(),
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openExpireTrialModal, setOpenExpireTrialModal] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [dashboardDetail, setDashboardDetail] = useState<TGetDashboardResponse>();

  const fetchTrialTime = async () => {
    try {
      const trial = await getTrialTime();
      if (trial.trialEnd) {
        const remainingTrialTime = dayjs(trial.trialEnd).diff(dayjs(), 'd') + 1;

        if (remainingTrialTime <= 3) {
          setCount(remainingTrialTime);
          setOpenExpireTrialModal(true);
        }
      }
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    }
  };

  const handleSubmitExpireTrialModal = () => {
    navigate(RoutePaths.PROFILE, { state: { activeTab: EProfileTabKey.SUBSCRIPTION } });
  };

  const fetchOwnerDashboard = useCallback(async () => {
    try {
      const response = await getOwnerDashboard(requestDashboardParams);
      setDashboardDetail(response);
    } catch (error) {
      showErrorToast('Get owner dashboard faield!');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPractitionerDashboard = useCallback(async () => {
    try {
      const response = await getPractitionerDashboard(requestDashboardParams);
      setDashboardDetail(response);
    } catch (error) {
      showErrorToast('Get practitioner dashboard failed!');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profile?.role === EUserType.OWNER || profile?.role === EUserType.SOLO_PRACTITIONER) fetchTrialTime();
  }, [profile]);

  useEffect(() => {
    if (isOwnerRole !== undefined) {
      isOwnerRole ? fetchOwnerDashboard() : fetchPractitionerDashboard();
    }
  }, [isOwnerRole]);

  return (
    <div className="Home">
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Dashboard dashboardDetail={dashboardDetail as TGetDashboardResponse} />
          <ExpireTrialModal
            open={openExpireTrialModal}
            onCancel={() => setOpenExpireTrialModal(false)}
            handleSubmit={handleSubmitExpireTrialModal}
            count={count}
          />
        </>
      )}
    </div>
  );
};

export default Home;
