import { Card, Divider, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Badge from 'src/components/badge/Badge';
import Button from 'src/components/button';
import { PricingLayout } from 'src/components/layout';
import { ConfirmModal } from 'src/components/popup';
import { PackageDescriptionRow, PackageTooltip } from 'src/components/pricing-package';
import SelectButton from 'src/components/selectButton';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import ResponseError from 'src/interfaces/error-response-interface';
import { TGetListCardResponse, TPaymentPackage } from 'src/interfaces/profile-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { createSubscription, getListPaymentPackage } from 'src/services/payment-service';
import { TRootState, useAppDispatch } from 'src/stores';
import { getCurrentSubscriptionAction, getListCard, startTrial } from 'src/stores/profile';
import { getUserProfile } from 'src/stores/user';
import { EPaymentStatus, EUserType } from 'src/variables/enum-variables';
import LearnMoreClinic from '../profile/components/my-subcription/components/learnMore/LearnMoreClinic';
import LearnMoreSoloPractitioner from '../profile/components/my-subcription/components/learnMore/LearnMoreSoloPractitioner';
import { asyncDelay } from 'src/utils/common-utils';
import './PricingPackage.scss';

interface IPlan {
  label: string;
  practitioner: number;
  price: number;
  value: string;
}

const PricingPackage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<IPlan>();
  const [isLoadingClinic, setIsLoadingClinic] = useState<boolean>(false);
  const [isLoadingSolo, setIsLoadingSolo] = useState<boolean>(false);
  const [isShowFreeTrialModel, setIsShowFreeTrialModel] = useState<boolean>(false);
  const [packages, setPackages] = useState<TPaymentPackage[]>([]);
  const profile = useSelector((state: TRootState) => state.user.profile);
  const isCanceledSubscription = profile?.clinic?.paymentStatus === EPaymentStatus.CANCELED;
  const isOwner = profile?.role === EUserType.OWNER;
  const soloPackage = packages.find((p) => p.type === 'SOLO');
  const ownerPackage = packages.find((p) => p.type === 'CLINIC');

  const onTrial = async () => {
    if (isOwner) {
      setIsLoadingClinic(true);
    } else {
      setIsLoadingSolo(true);
    }

    const planId = isOwner ? selectedPlan?.value : soloPackage?.plans[0].id;
    await dispatch(startTrial({ planId: planId || '' }));
    await dispatch(getUserProfile());

    if (isOwner) {
      setIsLoadingClinic(false);
    } else {
      setIsLoadingSolo(false);
    }
    dispatch(getCurrentSubscriptionAction());
    navigate(RoutePaths.HOME);
  };

  const onPay = () => {
    const planId = isOwner ? selectedPlan?.value : soloPackage?.plans[0].id;
    navigate(RoutePaths.PAYMENT(planId));
  };

  const getListPackage = async () => {
    try {
      const response = await getListPaymentPackage();
      setPackages(response);
      const ownerPackage = response.find((p) => p.type === 'CLINIC');
      if (ownerPackage?.plans && ownerPackage.plans.length) {
        const plan = ownerPackage.plans[0];
        setSelectedPlan({
          label: `${plan.price} - ${plan.amount} practitioner license (+G.S.T.)`,
          practitioner: plan.amount,
          price: plan.price,
          value: plan.id,
        });
      }
    } catch (e) {
      const message = (e as ResponseError).message;
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionTextPricingPlan = (solo?: boolean) => {
    let text = '';
    const myPackage = solo ? soloPackage : ownerPackage;
    const defaultText = `Start ${myPackage?.trialDay ?? '14'}-day Free Trial`;
    const myText = isCanceledSubscription ? 'Resume my subscription' : defaultText;

    if (solo) {
      text = isOwner ? defaultText : myText;
    } else {
      text = isOwner ? myText : defaultText;
    }
    return text;
  };

  const handleClickAction = async () => {
    if (!isCanceledSubscription) {
      setIsShowFreeTrialModel(true);
      return;
    }

    try {
      isOwner ? setIsLoadingClinic(true) : setIsLoadingSolo(true);
      const planId = isOwner ? selectedPlan?.value : soloPackage?.plans[0].id;
      const listCard: TGetListCardResponse = await dispatch(getListCard()).unwrap();
      const isEmptyCard = listCard.cards.length === 0;

      if (isEmptyCard) {
        navigate(RoutePaths.PAYMENT(planId));
        return;
      }
      planId && (await createSubscription({ planId }));
      showSuccessToast('Your subscription has been resumed successfully');
      await asyncDelay(2500);
      location.replace(RoutePaths.HOME);
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    } finally {
      isOwner ? setIsLoadingClinic(false) : setIsLoadingSolo(false);
    }
  };

  useEffect(() => {
    getListPackage();
  }, []);

  return (
    <PricingLayout headerText="Pricing package">
      <BaseText inline={false} type="small" textAlign="center">
        We offer two pricing packages for our platform - Solo Practitioner or Clinic Owner. Both packages allow you to
        add an UNLIMITED number of clients to your system.
      </BaseText>

      {isLoading ? (
        <Row className="pricing-loading">
          <Spin size="large" />
        </Row>
      ) : (
        <div className="pricing-cards">
          <Card className={`card ${!isOwner ? 'active' : ''}`}>
            <BaseText type="subHeading" className="package-name">
              {soloPackage?.name}
            </BaseText>
            <div className="package-price">
              <BaseText type="xl">${soloPackage?.plans[0].price}</BaseText>
              <div>
                <div>
                  <BaseText inline={false} type="headline" className="currency">
                    AUD
                  </BaseText>
                  <BaseText type="small">(plus GST) /month</BaseText>
                </div>
              </div>
            </div>
            <BaseText className="license">1 practitioner license</BaseText>
            <Divider className="divider" />
            <Badge color="violet" text="Solo practitioner" />
            <div className="package-description">
              {JSON.parse(soloPackage?.description ?? '').map((text: string, index: number) => (
                <PackageDescriptionRow text={text} key={index} />
              ))}
              <Row className="learn-more">
                <LearnMoreSoloPractitioner />
              </Row>
            </div>
            <Button
              className={`button ${isOwner ? 'disable' : 'active'}`}
              disabled={isOwner}
              loading={isLoadingSolo}
              onClick={handleClickAction}
            >
              <BaseText inline={true}>{getActionTextPricingPlan(true)}</BaseText>
            </Button>
          </Card>

          <Card className={`card ${isOwner ? 'active' : ''}`}>
            <BaseText type="subHeading" className="package-name" inline={false}>
              {ownerPackage?.name}
            </BaseText>
            <div className="package-price">
              <BaseText type="xl" inline={false}>
                ${selectedPlan?.price}
              </BaseText>
              <div>
                <BaseText inline={false} type="headline" className="currency">
                  AUD
                </BaseText>
                <BaseText type="small">(plus GST) /month</BaseText>
              </div>
            </div>
            <BaseText className="license">
              {selectedPlan?.practitioner} practitioner {(selectedPlan?.practitioner || 0) > 1 ? 'licenses' : 'license'}{' '}
            </BaseText>
            <Divider className="divider" />
            <div className="test">
              <Badge color="green" text="Clinic owner" />
              <div className="package-description">
                {JSON.parse(ownerPackage?.description ?? '').map((text: string, index: number) => (
                  <PackageDescriptionRow text={text} key={index} />
                ))}
                <Row className="learn-more">
                  <LearnMoreClinic />
                </Row>
              </div>
              <div className="plan-container">
                <div className="plan-select-text">
                  <BaseText type="caption">Select plan</BaseText>
                  <PackageTooltip />
                </div>
                <SelectButton
                  data={ownerPackage?.plans?.map((plan) => ({
                    label: `$${plan.price} - ${plan.amount} practitioner ${
                      plan.amount > 1 ? 'licenses' : 'license'
                    } (+G.S.T.)`,
                    practitioner: plan.amount,
                    price: plan.price,
                    value: plan.id,
                  }))}
                  defaultValue={`$${ownerPackage?.plans[0].price} - ${ownerPackage?.plans[0].amount} practitioner ${
                    ownerPackage?.plans[0].amount && ownerPackage?.plans[0].amount > 1 ? 'licenses' : 'license'
                  }  (+G.S.T.)`}
                  onChange={(value, option) => setSelectedPlan(option as IPlan)}
                  style={{ marginTop: '4px' }}
                />
              </div>
              <Button
                className={`button ${isOwner ? 'active' : 'disable'}`}
                disabled={!isOwner}
                loading={isLoadingClinic}
                onClick={handleClickAction}
              >
                <BaseText inline={true}>{getActionTextPricingPlan()}</BaseText>
              </Button>
            </div>
          </Card>
        </div>
      )}

      <ConfirmModal
        open={isShowFreeTrialModel}
        onCancelButton={onTrial}
        onsubmit={onPay}
        titleModal="Free trial started"
        txtBtnCancel="Go to Dashboard"
        txtBtnConfirm="Pay now"
        className="PricingPackage__modal"
        cancelLoading={isOwner ? isLoadingClinic : isLoadingSolo}
        closable={false}
        onCancel={() => setIsShowFreeTrialModel(false)}
      >
        <div className="PricingPackage__trail-text">
          <BaseText type="body1">
            Try ANTSA for FREE for {isOwner ? ownerPackage?.trialDay : soloPackage?.trialDay} days.
            <br />
            Get full access to all of our services and resources.
            <br />
            No risk. No credit card required.
          </BaseText>
          <br />
          <BaseText type="body1">
            If you want to skip {isOwner ? ownerPackage?.trialDay : soloPackage?.trialDay}-day trial period, go straight
            <br />
            to the Payment screen to purchase the
            <br />
            subscription by clicking “Pay now”
          </BaseText>
        </div>
      </ConfirmModal>
    </PricingLayout>
  );
};

export default PricingPackage;
