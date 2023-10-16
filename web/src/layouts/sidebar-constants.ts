import { EUserType } from 'src/variables/enum-variables';
import { ESidebarItemLabel } from './sidebar-types';

export const CLINIC_OWNER_SIDEBAR_ITEMS = [
  ESidebarItemLabel.PRACTITIONER,
  ESidebarItemLabel.MESSAGES,
  ESidebarItemLabel.FILES,
  ESidebarItemLabel.REPORT,
];

export const SOLO_SIDEBAR_ITEMS = [
  ESidebarItemLabel.CLIENTS,
  ESidebarItemLabel.MESSAGES,
  ESidebarItemLabel.HOMEWORK,
  ESidebarItemLabel.FILES,
  ESidebarItemLabel.PSYCHOEDUCATION,
  ESidebarItemLabel.REPORT,
];

export const PRACTITIONER_SIDEBAR_ITEMS = [
  ESidebarItemLabel.CLIENTS,
  ESidebarItemLabel.MESSAGES,
  ESidebarItemLabel.HOMEWORK,
  ESidebarItemLabel.FILES,
  ESidebarItemLabel.PSYCHOEDUCATION,
  ESidebarItemLabel.REPORT,
];

export const SIDEBAR_ITEMS_BY_TYPE: { [key: string]: string[] } = {
  [EUserType.SOLO_PRACTITIONER]: SOLO_SIDEBAR_ITEMS,
  [EUserType.PRACTITIONER]: PRACTITIONER_SIDEBAR_ITEMS,
  [EUserType.OWNER]: CLINIC_OWNER_SIDEBAR_ITEMS,
};
