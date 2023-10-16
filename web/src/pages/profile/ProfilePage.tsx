import { Space } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './ProfilePage.scss';
import Term from './components/term/Term';
import Privacy from './components/privacy/Privacy';
import { TRootState } from 'src/stores';
import StatusBox from 'src/components/status-box';
import Tabs from 'src/components/tabs';
import { BaseText } from 'src/components/typography';
import { TTabItem } from 'src/interfaces/common-interface';
import { PaymentMethod, MySubcription } from './components';
import { EUserType } from 'src/variables/enum-variables';
import GeneralInformation from './components/general-information/GeneralInformation';
import ClinicInformation from './components/clinic-information/ClinicInformation';
import { CommonContent, Container } from 'src/components/containers';
import {
  EProfileTabKey,
  OWNER_PROFILE_TAB_LABEL,
  PRACTITIONER_LABEL,
  SOLO_PROFILE_TAB_LABEL,
} from './profile-page-constants';
import Notification from './components/notification/Notification';
import ContactHelp from './components/contact-help/ContactHelp';

const ProfilePage = () => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const profile = useSelector((state: TRootState) => state.user.profile);
  const [activeTabKey, setActiveTabKey] = useState<EProfileTabKey>();
  let profileTabLabel = PRACTITIONER_LABEL;
  if (profile?.role === EUserType.OWNER) {
    profileTabLabel = OWNER_PROFILE_TAB_LABEL;
  } else if (profile?.role === EUserType.SOLO_PRACTITIONER) {
    profileTabLabel = SOLO_PROFILE_TAB_LABEL;
  }

  useEffect(() => {
    if (searchParams && searchParams.get('tab') && searchParams.get('tab') === EProfileTabKey.SUBSCRIPTION) {
      setActiveTabKey(EProfileTabKey.SUBSCRIPTION);
    }
  }, []);

  const items: TTabItem[] = Object.keys(profileTabLabel).map((item) => {
    const tabItem = {
      key: item,
      label: profileTabLabel[item],
      children: profileTabLabel[item],
    };

    switch (item) {
      case EProfileTabKey.GENERAL_INFOMATION:
        return {
          ...tabItem,
          children: <GeneralInformation />,
        };

      case EProfileTabKey.CLINIC_INFORMATION:
        return {
          ...tabItem,
          children: <ClinicInformation />,
        };

      case EProfileTabKey.PAYMENT_METHOD:
        return {
          ...tabItem,
          children: <PaymentMethod />,
        };

      case EProfileTabKey.SUBSCRIPTION:
        return {
          ...tabItem,
          children: <MySubcription />,
        };

      case EProfileTabKey.NOTIFICATION:
        return {
          ...tabItem,
          children: <Notification />,
        };
      case EProfileTabKey.CONTACT_HELP:
        return {
          ...tabItem,
          children: <ContactHelp />,
        };
      case EProfileTabKey.TERM:
        return {
          ...tabItem,
          children: <Term />,
        };
      case EProfileTabKey.PRIVACY:
        return {
          ...tabItem,
          children: <Privacy />,
        };
      default:
        return tabItem;
    }
  });

  const handleChangeTab = (tabKey: string) => {
    setActiveTabKey(tabKey as EProfileTabKey);
  };

  return (
    <Container className="ProfilePage">
      <CommonContent
        title={
          <Space size={16} className="ProfilePage__title">
            <BaseText type="display1">My account</BaseText>
            <StatusBox status={state?.client?.status} isShowDischarge />
          </Space>
        }
        className="ProfilePage__wrapper"
      >
        <div className="TabContainer">
          <Tabs
            items={items}
            activeKey={activeTabKey}
            defaultActiveKey={state?.activeTab ?? EProfileTabKey.GENERAL_INFOMATION}
            onChange={handleChangeTab}
          />
        </div>
      </CommonContent>
    </Container>
  );
};

export default ProfilePage;
