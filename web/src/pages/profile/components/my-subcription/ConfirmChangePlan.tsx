import dayjs from 'dayjs';
import { useState } from 'react';

import { ConfirmModal } from 'src/components/popup';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import ResponseError from 'src/interfaces/error-response-interface';
import { TCurrentPayment, TNewSubscriptionPlan } from 'src/interfaces/profile-interface';
import { updateSubscription } from 'src/services/payment-service';
import { EPaymentStatus } from 'src/variables/enum-variables';
interface ConfirmChangePlanModal {
  onCloseConfirmChangePlanModal: () => void;
  openConfirmUpdateModal: boolean;
  handleDone: () => void;
  currentSubscription: TCurrentPayment;
  newSubscription: TNewSubscriptionPlan;
}

const ConfirmChangePlan = ({
  onCloseConfirmChangePlanModal,
  openConfirmUpdateModal,
  handleDone,
  currentSubscription,
  newSubscription,
}: ConfirmChangePlanModal) => {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const hasExtraPayment = currentSubscription.plan.price < newSubscription.price;
  const remainingDay = dayjs(currentSubscription.nextPaymentAt).endOf('day').diff(dayjs().startOf('day'), 'day');
  const extraAmount = newSubscription.amount - currentSubscription.plan.amount;
  const totalDay = remainingDay > 30 ? 31 : 30;
  const isTrial = currentSubscription.status === EPaymentStatus.TRIALING;
  const currentPlanPrice = isTrial ? currentSubscription.plan.price : currentSubscription.plan.oldPrice;
  const extraPrice = newSubscription.price - currentPlanPrice;
  const extraPayment = isTrial ? extraPrice : (extraPrice * remainingDay) / totalDay;

  const onSubmit = async () => {
    try {
      setIsSubmiting(true);
      await updateSubscription({
        planId: newSubscription.value,
      });

      showSuccessToast('Your pricing package has been updated!');
      handleDone();
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <ConfirmModal
      titleModal="Change your plan"
      onCancelButton={onCloseConfirmChangePlanModal}
      open={openConfirmUpdateModal}
      onsubmit={onSubmit}
      loading={isSubmiting}
      txtBtnConfirm={hasExtraPayment ? 'Make payment' : 'Confirm'}
    >
      {hasExtraPayment ? (
        <BaseText type="body1" textAlign="center" className="ConfirmUpdateModal__body">
          As you are using the plan of {currentSubscription.plan.amount} licenses, you need to pay an additional fee to
          upgrade your plan to {newSubscription.amount} licenses in this billing cycle <br /> Extra fee for&nbsp;
          {extraAmount} license
          {extraAmount > 1 ? 's ' : ' '}is ${extraPayment?.toFixed(2)}
        </BaseText>
      ) : (
        <BaseText type="body1" textAlign="center" className="ConfirmUpdateModal__body">
          Your new plan will be applied straightaway
        </BaseText>
      )}
    </ConfirmModal>
  );
};

export default ConfirmChangePlan;
