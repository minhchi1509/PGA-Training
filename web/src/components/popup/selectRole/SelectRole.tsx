import { Modal, Row, Space } from 'antd';

import { useSelector } from 'react-redux';
import { CircleCheckIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import { RoutePaths } from 'src/routes/routes-constants';
import { TRootState } from 'src/stores';
import { changeCurrentProfileId, getItem } from 'src/utils/storage-utils';
import { getDisplayName } from 'src/utils/user-utils';
import { EUserProfile } from 'src/variables/storage';
import './SelectRole.scss';

interface ISelectRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelectRoleModal = (props: ISelectRoleModalProps): JSX.Element => {
  const { isOpen, onClose } = props;

  const profiles = useSelector((state: TRootState) => state.user.profiles);
  const profile = useSelector((state: TRootState) => state.user.profile);
  const currentProfileId = getItem(EUserProfile.PROFILE_ID);

  const handleChangeProfile = (profileId: string) => {
    if (profile?.id === profileId) {
      return;
    }

    changeCurrentProfileId(profileId);
    onClose();
    setTimeout(() => {
      window.location.replace(RoutePaths.HOME);
    }, 500);
  };

  return (
    <Modal open={isOpen} onCancel={onClose} centered closable={false} footer={null} width={392}>
      <Space direction="vertical" className="SelectRole" style={{ width: '100%' }}>
        <BaseText type="display1" className="SelectRole__title">
          Choose a clinic
        </BaseText>
        <Row className="SelectRole__box">
          {profiles.map((profile) => (
            <SelectRoleItem
              key={profile.id}
              name={getDisplayName(profile)}
              fullName={`${profile.firstName} ${profile.lastName}`}
              isActive={currentProfileId === profile.id}
              avatar={profile.avatar}
              onClick={() => handleChangeProfile(profile.id)}
            />
          ))}
        </Row>
      </Space>
    </Modal>
  );
};

interface ISelectRoleItemProps {
  name: string;
  avatar: string;
  fullName: string;
  isActive?: boolean;
  onClick: () => void;
}

const SelectRoleItem = ({ name, isActive, avatar, fullName, onClick }: ISelectRoleItemProps) => {
  return (
    <div className="SelectRole__btn" onClick={onClick}>
      <div className="SelectRole__avatar-container">
        <img src={avatar} className="SelectRole__avatar" />
        {isActive ? <CircleCheckIcon className="SelectRole__check" /> : null}
      </div>
      <div>
        <BaseText type="body2">{fullName}</BaseText>
        <BaseText type="body1">{name}</BaseText>
      </div>
    </div>
  );
};

export default SelectRoleModal;
