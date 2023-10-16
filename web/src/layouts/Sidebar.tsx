import { Layout, Space } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  ActiveClientIcon,
  ActiveFileIcon,
  ActiveHelpIcon,
  ActiveHomeworkIcon,
  ActiveMessageIcon,
  ActivePractitionerIcon,
  ActivePsyIcon,
  ActiveReportIcon,
  AntsaLogo,
  ClientIcon,
  FileIcon,
  FullAntsaLogo,
  HelpIcon,
  HomeworkIcon,
  MessageIcon,
  PractitionerIcon,
  PsyIcon,
  ReportIcon,
} from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import { RoutePaths } from 'src/routes/routes-constants';
import { TRootState } from 'src/stores';
import { EUserType } from 'src/variables/enum-variables';
import { SIDEBAR_ITEMS_BY_TYPE } from './sidebar-constants';
import { ESidebarItemLabel, TSidebarItem } from './sidebar-types';
import './Sidebar.scss';

const { Sider } = Layout;

interface IProps {
  className?: string;
  isShow: boolean;
}

export const SIDEBAR_ITEMS: { [key: string]: TSidebarItem } = {
  [ESidebarItemLabel.PRACTITIONER]: {
    icon: <PractitionerIcon />,
    activeIcon: <ActivePractitionerIcon />,
    label: ESidebarItemLabel.PRACTITIONER,
    path: RoutePaths.PRACTITIONER,
  },
  [ESidebarItemLabel.MESSAGES]: {
    icon: <MessageIcon />,
    activeIcon: <ActiveMessageIcon />,
    label: ESidebarItemLabel.MESSAGES,
    path: RoutePaths.MESSAGES,
  },
  [ESidebarItemLabel.CLIENTS]: {
    icon: <ClientIcon />,
    activeIcon: <ActiveClientIcon />,
    label: ESidebarItemLabel.CLIENTS,
    path: RoutePaths.CLIENTS,
  },
  [ESidebarItemLabel.HOMEWORK]: {
    icon: <HomeworkIcon />,
    activeIcon: <ActiveHomeworkIcon />,
    label: ESidebarItemLabel.HOMEWORK,
    path: RoutePaths.HOMEWORK,
  },
  [ESidebarItemLabel.FILES]: {
    icon: <FileIcon />,
    activeIcon: <ActiveFileIcon />,
    label: ESidebarItemLabel.FILES,
    path: RoutePaths.FILES,
  },
  [ESidebarItemLabel.REPORT]: {
    icon: <ReportIcon />,
    activeIcon: <ActiveReportIcon />,
    label: ESidebarItemLabel.REPORT,
    path: RoutePaths.REPORT,
  },
  [ESidebarItemLabel.HELP]: {
    icon: <HelpIcon />,
    activeIcon: <ActiveHelpIcon />,
    label: ESidebarItemLabel.HELP,
    path: RoutePaths.HELP,
  },
  [ESidebarItemLabel.PSYCHOEDUCATION]: {
    icon: <PsyIcon />,
    activeIcon: <ActivePsyIcon />,
    label: ESidebarItemLabel.PSYCHOEDUCATION,
    path: RoutePaths.PSYCHOEDUCATION,
  },
};

const Sidebar = ({ className, isShow }: IProps) => {
  if (!isShow) {
    return null;
  }

  const navigate = useNavigate();
  const location = useLocation();
  const currentProfile = useSelector((state: TRootState) => state.user.profile);
  const currentProfileType = currentProfile?.role ?? EUserType.CLINIC_OWNER;
  const menuItems = SIDEBAR_ITEMS_BY_TYPE[currentProfileType]?.map((item) => SIDEBAR_ITEMS[item]) || [];
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const handleCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <Sider
      className={`Sidebar ${className ?? ''}`}
      theme="light"
      width={340}
      collapsedWidth={96}
      collapsed={collapsed}
      onCollapse={handleCollapse}
      onMouseEnter={() => {
        if (collapsed) setCollapsed(!collapsed);
      }}
      onMouseLeave={() => {
        setCollapsed(!collapsed);
      }}
    >
      <Space className="Sidebar__logo" size={15} onClick={() => navigate(RoutePaths.HOME)}>
        <AntsaLogo />
        <FullAntsaLogo />
      </Space>
      <div className="Sidebar__menu">
        {menuItems.map((menu: TSidebarItem, index: number) => (
          <SidebarItem item={menu} key={index} isActive={location.pathname === menu.path} />
        ))}
      </div>
    </Sider>
  );
};

interface ISidebarItem {
  isActive?: boolean;
  item: TSidebarItem;
}
const SidebarItem = ({ item, isActive }: ISidebarItem) => {
  const { label, icon, activeIcon, path } = item;
  return (
    <Link to={path} replace>
      <div className={`SidebarItem ${isActive ? 'active' : ''}`}>
        <span className="active-icon">{activeIcon}</span>
        <span className="icon">{icon}</span>
        <BaseText className="SidebarItem__label" type="subHeading">
          {label}
        </BaseText>
      </div>
    </Link>
  );
};

export default Sidebar;

export { SidebarItem };
