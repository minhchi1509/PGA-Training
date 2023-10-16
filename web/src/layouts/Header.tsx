import { useState } from 'react';
import { Layout, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './Header.scss';
import { TRootState } from 'src/stores';
import { logout as logoutService } from 'src/services/auth-service';
import { changeCurrentProfileId, setItem } from 'src/utils/storage-utils';
import { BaseText } from 'src/components/typography';
import { RoutePaths } from 'src/routes/routes-constants';
import { getDisplayName } from 'src/utils/user-utils';
import { EPaymentStatus, EUserType } from 'src/variables/enum-variables';
import { EAuthToken, EUserProfile } from 'src/variables/storage';
import ConfirmModal from 'src/components/popup/confirmModal/ConfirmModal';
import { LogoutIcon, ProfileIcon, SwitchRoleIcon, CheckIcon } from 'src/assets/icons';
import Notifications from './notifications/Notifications';

const HeaderAntd = Layout.Header;

interface IHeader {
  username: string;
  avatar?: string;
}

const Header = ({ username, avatar }: IHeader) => {
  const profiles = useSelector((state: TRootState) => state.user.profiles);
  const profile = useSelector((state: TRootState) => state.user.profile);
  const isCanceled = profile?.clinic?.paymentStatus === EPaymentStatus.CANCELED;

  const [isConfirmLogout, setIsConfirmLogout] = useState<boolean>(false);

  const logout = async () => {
    await logoutService();
    setIsConfirmLogout(false);
    setItem(EAuthToken.ACCESS_TOKEN, '');
    setItem(EUserProfile.PROFILE_ID, '');
    window.location.replace(RoutePaths.SIGN_IN);
  };

  const onChangeRole = (profileId?: string) => {
    if (!profileId || profile?.id === profileId) {
      return;
    }

    changeCurrentProfileId(profileId);
    setTimeout(() => {
      window.location.replace(RoutePaths.HOME);
    }, 500);
  };

  let items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link to={RoutePaths.PROFILE} className="Menu__item">
          <ProfileIcon />
          <BaseText type="body1" inline={true} className="Menu__item-title">
            My Profile
          </BaseText>
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <div className="Menu__item">
          <SwitchRoleIcon />
          <BaseText type="body1" inline={true} className="Menu__item-title">
            Switch role
          </BaseText>
        </div>
      ),
      children: profiles.map((item) => ({
        key: item.id,
        label: (
          <RoleItem
            title={getDisplayName(item)}
            isActive={item.id === profile?.id}
            onPress={() => onChangeRole(item.id)}
          />
        ),
      })),
    },
    {
      key: '3',
      label: (
        <div className="Menu__item" onClick={() => setIsConfirmLogout(true)}>
          <LogoutIcon />
          <BaseText type="body1" inline={true} className="Menu__item-title">
            Logout
          </BaseText>
        </div>
      ),
    },
  ];

  if (isCanceled) items.shift();

  if (profile?.role === EUserType.OWNER) {
    items = items.filter((item) => item?.key !== '2');
  }

  return (
    <HeaderAntd className="Header">
      <div className="Header__right">
        <BaseText type="body1" inline={false}>
          {username}
        </BaseText>
        {!isCanceled && <Notifications />}
        <Dropdown menu={{ items }}>
          <div className="Header__avatar">
            <img src={avatar} alt={username} />
          </div>
        </Dropdown>
      </div>
      <ConfirmModal
        open={isConfirmLogout}
        onCancelButton={() => setIsConfirmLogout(false)}
        onsubmit={logout}
        titleModal="Confirm"
      >
        <div className="LogoutModal">
          <BaseText type="body1">Are you sure to logout?</BaseText>
        </div>
      </ConfirmModal>
    </HeaderAntd>
  );
};

interface IRoleItem {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

const RoleItem = ({ title, isActive, onPress }: IRoleItem) => {
  return (
    <div className="Menu__item-role" onClick={onPress}>
      {isActive ? <CheckIcon className="Menu__item-role-icon" /> : null}
      <BaseText type="body1" inline={true}>
        {title}
      </BaseText>
    </div>
  );
};

export default Header;
