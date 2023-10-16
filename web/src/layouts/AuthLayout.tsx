import { unwrapResult } from '@reduxjs/toolkit';
import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import { isIOS } from 'react-device-detect';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { Navigate, Outlet } from 'react-router-dom';

import { showErrorToast } from 'src/components/toast/Toast';
import { requestPermission } from 'src/configs/firebase-config';
import { getSocket } from 'src/configs/socket-config';
import { TRoomMessage } from 'src/interfaces/chat-interface';
import ResponseError from 'src/interfaces/error-response-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { TRootState, useAppDispatch } from 'src/stores';
import { getRoomsAction } from 'src/stores/chat';
import { getCurrentSubscriptionAction } from 'src/stores/profile';
import { getUserProfile, setCurrentProfile, startApp } from 'src/stores/user';
import { TUserProfile } from 'src/stores/user/user-constants';
import { changeCurrentProfileId, getItem } from 'src/utils/storage-utils';
import { getDisplayName } from 'src/utils/user-utils';
import { DEFAULT_GET_LIST_PARAMS } from 'src/variables/common';
import { EPaymentStatus, EUserType, EUserTypeDisplay } from 'src/variables/enum-variables';
import { EAuthToken, EUserProfile } from 'src/variables/storage';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

export type TSocket = {
  connect: () => void;
  leaveRoomChat: (roomId: string) => Promise<void>;
  joinRoomChat: (roomId: string, cb: (message: TRoomMessage) => void) => void;
  listenMessageOnProfile: (cb: () => void) => void;
  offMessageOnProfile: () => void;
  listenCreateRoom: (cb: () => void) => void;
  offCreateRoom: () => void;
};
interface IProps {
  children?: (socket?: TSocket) => React.ReactNode;
}

const ORIGINAL_PAYMENT_PATH = RoutePaths.PAYMENT().split(':packageId')[0];
const ORIGINAL_CREATE_PROFILE_PATH = RoutePaths.CREATE_CLINIC_PROFILE().split(':userType')[0];
const HIDE_SIDE_BAR_ROUTES = [RoutePaths.PRICING_PACKAGE, ORIGINAL_PAYMENT_PATH, ORIGINAL_CREATE_PROFILE_PATH];

const AuthLayout = ({ children }: IProps) => {
  const accessToken = getItem(EAuthToken.ACCESS_TOKEN);
  const isAuthenticated = !!accessToken;
  const location = useLocation();
  const [isShowSidebar, setIsShowSidebar] = useState<boolean>(true);
  if (!isAuthenticated) return <Navigate to={RoutePaths.SIGN_IN} />;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state: TRootState) => state.user.profile);
  const isMessagePage = location.pathname.includes(RoutePaths.MESSAGES);
  const socket = isMessagePage ? getSocket() : undefined;

  const fetchProfile = async () => {
    try {
      const result = unwrapResult(await dispatch(getUserProfile()));
      const currentProfileId = getItem(EUserProfile.PROFILE_ID);
      let profile = null;

      if (!currentProfileId) {
        profile = result.profiles[0];
      } else {
        profile =
          result.profiles.find((profile: TUserProfile) => profile.id === currentProfileId) || result.profiles[0];
      }

      dispatch(setCurrentProfile(profile));
      changeCurrentProfileId(profile.id);

      const isOwner = profile.role === EUserType.OWNER;
      const isSoloPractitioner = profile.role === EUserType.SOLO_PRACTITIONER;

      if (!profile.isCompleted) {
        const role =
          profile.role === EUserType.OWNER
            ? EUserTypeDisplay.CLINIC_OWNER
            : profile.role === EUserType.PRACTITIONER
            ? EUserTypeDisplay.PRACTITIONER
            : EUserTypeDisplay.SOLO_PRACTITIONER;
        navigate(RoutePaths.CREATE_CLINIC_PROFILE(role));
        return;
      }

      if (
        (!profile.clinic.paymentStatus || profile.clinic.paymentStatus === EPaymentStatus.CANCELED) &&
        (isSoloPractitioner || isOwner)
      ) {
        navigate(RoutePaths.PRICING_PACKAGE);
        return;
      }
      if (profile.role === EUserType.OWNER || profile.role === EUserType.SOLO_PRACTITIONER) {
        await dispatch(getCurrentSubscriptionAction()).unwrap();
      }
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    }
  };

  const startUsingApp = async () => {
    try {
      unwrapResult(await dispatch(startApp()));
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    }
  };

  useEffect(() => {
    if (location.pathname.includes(RoutePaths.MESSAGES) && socket) {
      socket?.joinRoomNotification();
      setTimeout(() => {
        socket?.listenMessageOnProfile(() => dispatch(getRoomsAction(DEFAULT_GET_LIST_PARAMS)));
      }, 500);
    } else {
      socket?.leaveRoomNotification();
    }

    const hideSidebar = HIDE_SIDE_BAR_ROUTES.some((route: string) => location.pathname.includes(route));
    setIsShowSidebar(!hideSidebar);
  }, [location]);

  useEffect(() => {
    fetchProfile();
    socket?.connect();
    !isIOS && requestPermission();
    startUsingApp();
  }, []);

  return (
    <Layout hasSider style={{ minHeight: '100%' }}>
      <Header username={getDisplayName(profile)} avatar={profile?.avatar} />
      <Layout>
        <Sidebar isShow={isShowSidebar} />
        <Content style={{ marginTop: 64, marginLeft: isShowSidebar ? 96 : 0 }}>
          {children?.(socket)}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AuthLayout;
