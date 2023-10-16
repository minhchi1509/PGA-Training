import { Card, Divider, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Badge from 'src/components/badge/Badge';
import Button from 'src/components/button';
import { ConfirmModal } from 'src/components/popup';
import { PackageDescriptionRow } from 'src/components/pricing-package';
import SelectButton from 'src/components/selectButton';
import StatusBox from 'src/components/status-box';
import { showErrorToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import ResponseError from 'src/interfaces/error-response-interface';
import { TTotalMember } from 'src/interfaces/owner-interface';
import { TNewSubscriptionPlan, TPaymentPackage } from 'src/interfaces/profile-interface';
import { getTotalMember } from 'src/services/owner-service';
import { getListPaymentPackage } from 'src/services/payment-service';
import { TRootState, useAppDispatch } from 'src/stores';
import { EPractitionersAction, getPractitioners } from 'src/stores/practitioners';
import { getCurrentSubscriptionAction } from 'src/stores/profile';
import { EPaymentStatus, EUserType } from 'src/variables/enum-variables';
import ConfirmChangePlan from './ConfirmChangePlan';
import './MySubcription.scss';
import { RemovePractitionerModal } from './components';
import CanceSubscription from './components/cancelSubscription/CancelSubscription';
import Footer from './components/footer/Footer';
import LearnMoreClinic from './components/learnMore/LearnMoreClinic';
import LearnMoreSoloPractitioner from './components/learnMore/LearnMoreSoloPractitioner';
import PackageTooltip from 'src/components/pricing-package/PackageTooltip';
import dayjs from 'dayjs';

const PricingPackage = () => {
  const dispatch = useAppDispatch();
  const profile = useSelector((state: TRootState) => state.user.profile);
  const practitioners = useSelector((state: TRootState) => state.practitioners.practitionerList.data);
  const loadingPractitioners = useSelector(
    (state: TRootState) => state.loading[EPractitionersAction.GET_PRACTITIONERS],
  );
  const currentSubscription = useSelector((state: TRootState) => state.profile.currentSubscription);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<TNewSubscriptionPlan>();
  const [packages, setPackages] = useState<TPaymentPackage[]>([]);
  const [totalMember, setTotalMember] = useState<TTotalMember>();
  const [isShowChangePlanModal, setIsShowChangePlanModal] = useState<boolean>(false);
  const [isShowConfirmChangePlanModal, setIsShowConfirmChangePlanModal] = useState<boolean>(false);
  const [isShowRemovePractitionerModal, setShowRemovePractitionerModal] = useState<boolean>(false);

  const isOwner = profile?.role === EUserType.OWNER;
  const isCancel = !!currentSubscription?.cancelAt && currentSubscription?.status !== EPaymentStatus.CANCELED;
  const isDisabledSoloAction = isOwner || (isCancel && !isOwner);
  const isDisabledOwnerAction = !isOwner || (isOwner && isCancel);
  const soloPackage = packages.find((p) => p.type === 'SOLO');
  const ownerPackage = packages.find((p) => p.type === 'CLINIC');
  const ownerPlanPrice = isOwner ? currentSubscription?.plan?.price : ownerPackage?.plans[0]?.price;
  const ownerPlanAmount = isOwner ? currentSubscription?.plan?.amount : ownerPackage?.plans[0]?.amount;

  const handleSubmitChangePlan = async () => {
    if (currentSubscription && selectedPlan) {
      if (selectedPlan?.value === currentSubscription?.plan.id) {
        handleCloseChangePlanModal();
        return;
      }
      if (
        selectedPlan?.price < currentSubscription?.plan.price &&
        Number(totalMember?.totalPractitioner) > selectedPlan.amount
      ) {
        await handleOpenRemovePractitionerModal();
        return;
      }
    }
    handleOpenConfirmChangePlanModal();
  };

  const handleOpenConfirmChangePlanModal = () => {
    setIsShowConfirmChangePlanModal(true);
    setIsShowChangePlanModal(false);
  };

  const handleCloseConfirmChangePlanModal = () => {
    setIsShowConfirmChangePlanModal(false);
  };

  const handleOpenChangePlanModal = () => {
    setIsShowChangePlanModal(true);
  };

  const handleCloseChangePlanModal = () => {
    setIsShowChangePlanModal(false);
  };

  const handleOpenRemovePractitionerModal = async () => {
    try {
      await dispatch(getPractitioners({ page: 1, size: 100, isWorking: true })).unwrap();
      setShowRemovePractitionerModal(true);
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
      handleCloseRemovePractitionerModal();
    }
  };

  const handleCloseRemovePractitionerModal = () => {
    setShowRemovePractitionerModal(false);
  };

  const handleDoneRemovePractitionerModal = async () => {
    handleCloseChangePlanModal();
    handleCloseConfirmChangePlanModal();
    await loadData();
  };

  const getActionTextPricingPlan = (cancelled: boolean, solo?: boolean) => {
    let text = '';
    const myPackage = !isOwner ? ownerPackage : soloPackage;
    const otherPackageText = `Start ${myPackage?.trialDay ?? '14'}-day Free Trial`;
    const currentPackageText = cancelled ? 'Resume my subscription' : 'Your plan';

    if (solo) {
      isOwner ? (text = otherPackageText) : (text = currentPackageText);
    } else {
      isOwner ? (text = currentPackageText) : (text = otherPackageText);
    }

    return text;
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const currentPackageResponse = await dispatch(getCurrentSubscriptionAction()).unwrap();
      const responseListPackage = await getListPaymentPackage();
      setPackages(responseListPackage);
      const responseTotalMember = await getTotalMember();
      setTotalMember(responseTotalMember);

      const ownerPackage = responseListPackage.find((p) => p.type === 'CLINIC');
      if (ownerPackage?.plans && ownerPackage.plans.length) {
        const plan = ownerPackage?.plans.find((p) => p.id === currentPackageResponse.plan.id);
        if (plan) {
          setSelectedPlan({
            label: `${plan.price} - ${plan.amount} practitioner ${plan.amount > 1 ? 'licenses' : 'license'} (+G.S.T.)`,
            amount: plan.amount,
            price: plan.price,
            value: plan.id,
          });
        }
      }
    } catch (e) {
      const message = (e as ResponseError).message;
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="MySubcription">
      <div className="heading">
        <BaseText type="title">My subscription</BaseText>
        <StatusBox status={isCancel ? EPaymentStatus.CANCELED : currentSubscription?.status || ''} />
      </div>
      {isLoading ? (
        <Row className="pricing-loading">
          <Spin size="large" />
        </Row>
      ) : (
        <>
          <div className="pricing-cards-subcription">
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
                className={`button ${isOwner || isCancel ? 'disable' : 'active'}`}
                disabled={isDisabledSoloAction}
              >
                <BaseText inline={true}>{getActionTextPricingPlan(!!isCancel, true)}</BaseText>
              </Button>
            </Card>

            <Card className={`card ${isOwner ? 'active' : ''}`}>
              <BaseText type="subHeading" className="package-name" inline={false}>
                {ownerPackage?.name}
              </BaseText>
              <div className="package-price">
                <BaseText type="xl" inline={false}>
                  ${ownerPlanPrice}
                </BaseText>
                <div>
                  <BaseText inline={false} type="headline" className="currency">
                    AUD
                  </BaseText>
                  <BaseText type="small">(plus GST) /month</BaseText>
                </div>
              </div>
              <BaseText className="license">
                {ownerPlanAmount} practitioner&nbsp;
                {(ownerPlanAmount ?? 0) > 1 ? 'licenses' : 'license'}
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
                    data={[]}
                    disabled
                    defaultValue={`$${ownerPlanPrice} - ${ownerPlanAmount} practitioner ${
                      (ownerPlanAmount ?? 1) > 1 ? 'licenses' : 'license'
                    } (+G.S.T.)`}
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <Button
                  className={`button ${!isOwner || isCancel ? 'disable' : 'active'}`}
                  onClick={handleOpenChangePlanModal}
                  disabled={isDisabledOwnerAction}
                >
                  <BaseText inline={true}>{getActionTextPricingPlan(!!isCancel, false)}</BaseText>
                </Button>
              </div>
            </Card>
          </div>
          {isCancel && (
            <div className="pricing-cards-subcription pricing-cards-subcription-time">
              <BaseText className="card cancel-time-text" type="small">
                {!isOwner &&
                  `Your subscription will end on ${dayjs(currentSubscription.cancelAt).format(
                    'DD/MM/YYYY',
                  )}.\nYou can only resume your subscription after it ends.`}
              </BaseText>
              <BaseText className="card cancel-time-text" type="small">
                {isOwner &&
                  `Your subscription will end on ${dayjs(currentSubscription.cancelAt).format(
                    'DD/MM/YYYY',
                  )}.\nYou can only resume your subscription after it ends.`}
              </BaseText>
            </div>
          )}
        </>
      )}

      <CanceSubscription totalMember={totalMember} currentSubscription={currentSubscription} />
      <Footer isOwner={isOwner} currentSubscription={currentSubscription} />

      <ConfirmModal
        open={isShowChangePlanModal}
        onCancelButton={handleCloseChangePlanModal}
        txtBtnConfirm="Change plan"
        className="PricingPackage__modal"
        closable={false}
        onCancel={handleCloseChangePlanModal}
        onsubmit={handleSubmitChangePlan}
        loading={loadingPractitioners}
      >
        <div className="MySubcription-main-package">
          <BaseText>Clinic rates</BaseText>
          <div className="heading-package">
            <BaseText className="money">{`$${selectedPlan?.price}`}</BaseText>
            <div className="month">
              <BaseText>/month</BaseText>
            </div>
          </div>
          <BaseText>{`$${selectedPlan?.amount} practitioner ${
            selectedPlan?.amount && selectedPlan.amount > 1 ? 'licenses' : 'license'
          } (+G.S.T.)`}</BaseText>
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
                amount: plan.amount,
                price: plan.price,
                value: plan.id,
              }))}
              defaultValue={selectedPlan?.value}
              onChange={(_, option) => setSelectedPlan(option as TNewSubscriptionPlan)}
              style={{ marginTop: '4px' }}
            />
          </div>
        </div>
      </ConfirmModal>

      {selectedPlan && currentSubscription && (
        <ConfirmChangePlan
          onCloseConfirmChangePlanModal={handleCloseConfirmChangePlanModal}
          openConfirmUpdateModal={isShowConfirmChangePlanModal}
          currentSubscription={currentSubscription}
          newSubscription={selectedPlan}
          handleDone={handleDoneRemovePractitionerModal}
        />
      )}

      {currentSubscription && selectedPlan && (
        <RemovePractitionerModal
          open={isShowRemovePractitionerModal}
          onClose={handleCloseRemovePractitionerModal}
          practitioners={practitioners}
          currentSubscription={currentSubscription}
          newSubscription={selectedPlan}
          totalPractitioner={totalMember?.totalPractitioner}
          handleDone={handleDoneRemovePractitionerModal}
        />
      )}
    </div>
  );
};

export default PricingPackage;
