import { TUserProfile } from 'src/stores/user/user-constants';
import { EUserType } from 'src/variables/enum-variables';

export const getDisplayName = (profile: TUserProfile | undefined): string => {
  if (!profile) {
    return '';
  }

  if (profile.role === EUserType.OWNER) {
    return `Owner in Clinic ${profile.clinic.name}`;
  } else if (profile.role === EUserType.PRACTITIONER) {
    return `Practitioner in Clinic ${profile.clinic.name}`;
  } else {
    return 'Solo Practitioner';
  }
};
