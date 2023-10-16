import { ComponentProps } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from 'src/components/popup';
import { BaseText } from 'src/components/typography';
import { RoutePaths } from 'src/routes/routes-constants';

const MaximumActivePractitionersModal = (props: ComponentProps<typeof ConfirmModal>) => {
  const navigate = useNavigate();

  return (
    <ConfirmModal
      txtBtnConfirm="Upgrade"
      txtBtnCancel="Cancel"
      closable={false}
      onsubmit={() => {
        navigate(RoutePaths.PROFILE);
      }}
      {...props}
    >
      <BaseText type="body1" className="PractitionersPage__error">
        {`You've reached the maximum number of active practitioners. Upgrade your plan and invite more practitioners to your clinic`}
      </BaseText>
    </ConfirmModal>
  );
};

export default MaximumActivePractitionersModal;
