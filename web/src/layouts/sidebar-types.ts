export enum ESidebarItemLabel {
  PRACTITIONER = 'Practitioners',
  CLIENTS = 'Clients',
  MESSAGES = 'Messages',
  HOMEWORK = 'Homework',
  FILES = 'Files',
  REPORT = 'Report',
  HELP = 'Help',
  PSYCHOEDUCATION = 'Psychoeducation',
}

export type TSidebarItem = {
  icon: JSX.Element;
  activeIcon: JSX.Element;
  label: ESidebarItemLabel;
  path: string;
};
