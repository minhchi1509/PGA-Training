import { useState } from 'react';

import { IconCancel, IconSuccess } from 'src/assets/icons';
import Button from 'src/components/button';
import { AlertModal } from 'src/components/popup';
import { showErrorToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import ResponseError from 'src/interfaces/error-response-interface';
import { TTotalMember } from 'src/interfaces/owner-interface';
import { TCurrentPayment } from 'src/interfaces/profile-interface';
import { cancelSubscription } from 'src/services/payment-service';
import CancelConfirm from '../cancelConfirm/CancelConfirm';
import './CancelSubscription.scss';

interface ICancelSubscriptionProps {
  totalMember?: TTotalMember;
  currentSubscription?: TCurrentPayment;
}

const CancelSubscription = ({ totalMember, currentSubscription }: ICancelSubscriptionProps) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);

  const onToggleOpenModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const onCloseCancelConfirmModal = () => setIsOpenModal(false);

  const handleCancel = async (values: { reason: string[]; comment: '' }) => {
    try {
      setIsLoading(true);
      const reasons = values.reason.map((reason, index) => ({
        key: reason === 'Other' ? 'Other' : index.toString(),
        value: reason === 'Other' ? values.comment : reason,
      }));

      await cancelSubscription({
        reasons,
      });

      setIsOpenModal(false);
      setIsOpenSuccessModal(true);
    } catch (e) {
      const message = (e as ResponseError).message;
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  const goToPricing = () => {
    setIsOpenSuccessModal(false);
    location.reload();
  };

  if (currentSubscription?.cancelAt) return null;

  return (
    <>
      <div className="btn Cancel__btn">
        <IconCancel />
        <Button type="link" className="btn cancel" onClick={onToggleOpenModal}>
          Cancel my subscription
        </Button>
      </div>
      <CancelConfirm
        onClose={onCloseCancelConfirmModal}
        isOpen={isOpenModal}
        onSubmit={handleCancel}
        isCallingCancel={isLoading}
        totalMember={totalMember}
        dueDate={currentSubscription?.nextPaymentAt}
      />
      <AlertModal
        open={isOpenSuccessModal}
        txtBtnOk="Close"
        onOk={goToPricing}
        title={
          <BaseText type="headline" textAlign="center">
            Thanks for your feedback
          </BaseText>
        }
        closable={false}
        icon={<IconSuccess width={48} />}
        content={
          <BaseText type="body1" className="Cancel__success--title">
            Your subscription has been cancelled and you will not be billed for the upcoming billing cycle. To
            reactivate your subscription, <span className="Cancel__success--contact">Contact</span> ANTSA team.
          </BaseText>
        }
      />
    </>
  );
};

export default CancelSubscription;
