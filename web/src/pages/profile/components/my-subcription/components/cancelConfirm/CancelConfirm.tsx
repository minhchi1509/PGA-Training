import dayjs from 'dayjs';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import './CancelConfirm.scss';
import { TRootState } from 'src/stores';
import { ConfirmModal } from 'src/components/popup';
import { BaseText } from 'src/components/typography';
import CancelReason from '../cancelReason/CancelReason';
import { TTotalMember } from 'src/interfaces/owner-interface';
import { EUserType } from 'src/variables/enum-variables';

interface CancelSubcription {
  onClose: () => void;
  isOpen: boolean;
  isCallingCancel: boolean;
  totalMember?: TTotalMember;
  onSubmit: (values: { reason: string[]; comment: '' }) => Promise<void>;
  dueDate?: string;
}

const CancelConfirm = ({ onClose, isOpen, isCallingCancel, onSubmit, totalMember, dueDate }: CancelSubcription) => {
  const [isShowReasonModal, setIsShowReasonModal] = useState<boolean>(false);
  const profile = useSelector((state: TRootState) => state.user.profile);
  const isOwner = profile?.role === EUserType.OWNER;

  const onToggleOpenReasonModal = () => {
    onClose();
    setIsShowReasonModal(!isShowReasonModal);
  };

  const handleSubmit = async (values: { reason: string[]; comment: '' }) => {
    await onSubmit(values);
    setIsShowReasonModal(false);
  };

  const renderHeader = () => {
    const unitClient = Number(totalMember?.totalClient) > 1 ? 'clients' : 'client';
    const unitPactitioner = Number(totalMember?.totalPractitioner) > 1 ? 'practitioners' : 'practitioner';

    if (isOwner) {
      if (totalMember?.totalPractitioner) {
        if (totalMember.totalClient) {
          return (
            <BaseText type="body1" textAlign="left" className="CancelSubcription-content__body">
              You still have {totalMember?.totalPractitioner} {unitPactitioner} and {totalMember?.totalClient}{' '}
              {unitClient}
              in ANTSA. Are you sure you want to cancel?
            </BaseText>
          );
        } else {
          return (
            <BaseText type="body1" textAlign="left" className="CancelSubcription-content__body">
              You still have {totalMember?.totalPractitioner} {unitPactitioner} in ANTSA. Are you sure you want to
              cancel?
            </BaseText>
          );
        }
      }
    } else {
      if (totalMember?.totalClient) {
        return (
          <BaseText type="body1" textAlign="left" className="CancelSubcription-content__body">
            You still have {totalMember?.totalClient} {unitClient} in ANTSA. Are you sure you want to cancel?
          </BaseText>
        );
      }
    }

    return null;
  };

  return (
    <>
      <ConfirmModal
        titleModal="Are you sure you want to cancel?"
        onCancelButton={onClose}
        open={isOpen}
        onsubmit={onToggleOpenReasonModal}
        txtBtnConfirm="Continue Cancellation"
        className="CancelSubcription"
        loading={isCallingCancel}
        onCancel={onClose}
      >
        <div className="CancelSubcription-content">
          {renderHeader()}
          <BaseText type="body1" textAlign="left" className="CancelSubcription-content__body">
            If you cancel your subscription today, you and your practitioners and clients will be able to continue
            accessing the ANTSA system until {dayjs(dueDate).format('MMM DD YYYY')}
          </BaseText>
          <BaseText type="body1" textAlign="left" className="CancelSubcription-content__body">
            If you&apos;re unsure about cancelling your account, we&apos;re here to help. Contact us
          </BaseText>
        </div>
      </ConfirmModal>
      <CancelReason
        open={isShowReasonModal}
        onCancel={onToggleOpenReasonModal}
        onSubmit={handleSubmit}
        loading={isCallingCancel}
      />
    </>
  );
};

export default CancelConfirm;
