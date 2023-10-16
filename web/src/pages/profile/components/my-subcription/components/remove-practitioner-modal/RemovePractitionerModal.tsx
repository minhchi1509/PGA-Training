import { Checkbox, Col, Modal, ModalProps, Row, Steps } from 'antd';
import { useMemo, useState } from 'react';

import { IconSuccess } from 'src/assets/icons';
import Button from 'src/components/button';
import Select from 'src/components/select';
import { showErrorToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import ResponseError from 'src/interfaces/error-response-interface';
import { TPractitioner } from 'src/interfaces/practitioners-interface';
import { TCurrentPayment, TNewSubscriptionPlan } from 'src/interfaces/profile-interface';
import { updateSubscription } from 'src/services/payment-service';
import './RemovePractitionerModal.scss';

interface IProps extends ModalProps {
  handleDone: () => void;
  onClose: () => void;
  practitioners: TPractitioner[];
  currentSubscription: TCurrentPayment;
  newSubscription: TNewSubscriptionPlan;
  totalPractitioner?: number;
}

const RemovePractitionerModal = (props: IProps) => {
  const { open, onClose, practitioners, currentSubscription, newSubscription, handleDone, totalPractitioner } = props;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [selectedPractitioners, setSelectedPractitioners] = useState<TPractitioner[]>([]);
  const selectedPractitionerIds = useMemo(() => selectedPractitioners.map((prac) => prac.id), [selectedPractitioners]);
  const totalActiveClients = useMemo(
    () =>
      selectedPractitioners.reduce(
        (accumulator, currentValue) => accumulator + (currentValue.totalActiveClient || 0),
        0,
      ),
    [selectedPractitioners],
  );
  const [selectedPractitionerIdsDeactivateClient, setSelectedPractitionerIdsDeactivateClient] = useState<string[]>([]);
  const practitionersRellocateClient = useMemo(
    () =>
      practitioners
        .filter((prac) => !selectedPractitionerIds.includes(prac.id))
        .map((prac) => ({ label: prac.firstName + ' ' + prac.lastName, value: prac.id })),
    [practitioners, selectedPractitionerIds],
  );
  const [selectedPractitionerRellocateClient, setSelectedPractitionerRellocateClient] = useState<
    { oldPractitionerId: string; newPractitionerId: string }[]
  >([]);
  const [totalDeativateClients, setTotalDeativateClients] = useState<number>(0);
  const [totalRellocateClients, setTotalRellocateClients] = useState<number>(0);

  const handleCancel = () => {
    if (step === 1) {
      onClose();
    } else {
      setStep(step - 1);
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      setStep(step + 1);
      setSelectedPractitionerIdsDeactivateClient([]);
      setSelectedPractitionerRellocateClient([]);
    } else if (step === 2) {
      try {
        setIsSubmitting(true);
        const rellocateClients = selectedPractitionerRellocateClient.map((prac) => ({
          oldPractitionerId: prac.oldPractitionerId,
          newPractitionerId: prac.newPractitionerId,
          inactive: false,
        }));

        const deactivateClients = selectedPractitionerIdsDeactivateClient.map((pId) => ({
          oldPractitionerId: pId,
          inactive: true,
        }));

        await updateSubscription({
          planId: newSubscription.value,
          clientAssigns: [...rellocateClients, ...deactivateClients],
        });
        setStep(step + 1);
      } catch (error) {
        const message = (error as ResponseError).message;
        showErrorToast(message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      onClose();
      handleDone();
    }
  };

  const handleSelectPractitioner = (practitioner: TPractitioner) => {
    let newSelectedPractitioners;

    if (selectedPractitionerIds.includes(practitioner.id)) {
      newSelectedPractitioners = selectedPractitioners.filter((prac) => prac.id !== practitioner.id);
    } else {
      newSelectedPractitioners = [...selectedPractitioners, practitioner];
    }

    setSelectedPractitioners(newSelectedPractitioners);
  };

  const handleSelectPractitionerDeactivateClient = (practitioner: TPractitioner) => {
    let newSelectedPractitioners;
    let newTotalDeativateClients;
    const practitionerId = practitioner.id;

    if (selectedPractitionerIdsDeactivateClient.includes(practitionerId)) {
      newSelectedPractitioners = selectedPractitionerIdsDeactivateClient.filter((pId) => pId !== practitionerId);
      newTotalDeativateClients = totalDeativateClients - (practitioner.totalActiveClient || 0);
    } else {
      if (selectedPractitionerRellocateClient.find((prac) => prac.oldPractitionerId === practitionerId)) {
        const newSelectedPractitionerRellocateClient = selectedPractitionerRellocateClient.filter(
          (prac) => prac.oldPractitionerId !== practitionerId,
        );

        setTotalRellocateClients(totalRellocateClients - (practitioner.totalActiveClient || 0));
        setSelectedPractitionerRellocateClient(newSelectedPractitionerRellocateClient);
      }
      newTotalDeativateClients = totalDeativateClients + (practitioner.totalActiveClient || 0);
      newSelectedPractitioners = [...selectedPractitionerIdsDeactivateClient, practitionerId];
    }

    setTotalDeativateClients(newTotalDeativateClients);
    setSelectedPractitionerIdsDeactivateClient(newSelectedPractitioners);
  };

  const handleSelectPractitionerRellocateClient = (oldPractitioner: TPractitioner, newPractitionerId: string) => {
    const oldPractitionerId = oldPractitioner.id;
    const isExistPractitionerRellocateClient = selectedPractitionerRellocateClient.find(
      (prac) => prac.oldPractitionerId === oldPractitionerId,
    );
    let newSelectedPractitionerRellocateClient;

    if (isExistPractitionerRellocateClient) {
      newSelectedPractitionerRellocateClient = selectedPractitionerRellocateClient.map((prac) => ({
        oldPractitionerId: prac.oldPractitionerId,
        newPractitionerId: isExistPractitionerRellocateClient ? newPractitionerId : prac.newPractitionerId,
      }));
    } else {
      newSelectedPractitionerRellocateClient = [
        ...selectedPractitionerRellocateClient,
        { oldPractitionerId, newPractitionerId },
      ];

      setTotalRellocateClients(totalRellocateClients + (oldPractitioner.totalActiveClient || 0));
    }

    if (selectedPractitionerIdsDeactivateClient.includes(oldPractitionerId)) {
      const newSelectedPractitionerIdsDeactivateClient = selectedPractitionerIdsDeactivateClient.filter(
        (pId) => pId !== oldPractitionerId,
      );

      setTotalDeativateClients(totalDeativateClients - (oldPractitioner.totalActiveClient || 0));
      setSelectedPractitionerIdsDeactivateClient(newSelectedPractitionerIdsDeactivateClient);
    }

    setSelectedPractitionerRellocateClient(newSelectedPractitionerRellocateClient);
  };

  const getTotalRemovePractitioner = () => {
    if (currentSubscription.plan.amount > Number(totalPractitioner)) {
      return Number(totalPractitioner) - newSubscription.amount;
    } else {
      return currentSubscription.plan.amount - newSubscription.amount;
    }
  };

  const disableSubmitButton = useMemo(() => {
    const length = selectedPractitioners.length;
    if (step === 1) {
      return length < getTotalRemovePractitioner();
    } else if (step === 2) {
      return length > selectedPractitionerIdsDeactivateClient.length + selectedPractitionerRellocateClient.length;
    }
    return false;
  }, [
    selectedPractitioners,
    currentSubscription,
    totalPractitioner,
    newSubscription,
    selectedPractitionerIdsDeactivateClient,
    selectedPractitionerRellocateClient,
    step,
  ]);

  return (
    <Modal
      open={open}
      width={1020}
      footer={null}
      closable={false}
      bodyStyle={{ alignItems: step === 3 ? 'center' : 'inherit', justifyContent: step === 3 ? 'center' : 'inherit' }}
      className="RemovePractitionerModal"
    >
      <div className="RemovePractitionerModal__header">
        {step === 1 && (
          <>
            <BaseText type="title">Remove Practitioners</BaseText>
            <BaseText type="small">
              Your current plan: {currentSubscription.plan.amount}{' '}
              {currentSubscription.plan.amount > 1 ? 'practitioners' : 'practitioner'} licenses
            </BaseText>
            <BaseText type="small">
              Your new plan: {newSubscription.amount} {newSubscription.amount > 1 ? 'practitioners' : 'practitioner'}{' '}
              licenses
            </BaseText>
            <BaseText type="small">
              Please select to deactivate at least {getTotalRemovePractitioner()}{' '}
              {getTotalRemovePractitioner() > 1 ? 'practitioners' : 'practitioner'} to proceed with the next step (the
              selected practitioners will be deactivated from now on):
            </BaseText>
          </>
        )}
        {step === 2 && (
          <>
            <BaseText type="title">Remove Practitioners</BaseText>
            <BaseText type="small">
              There are {totalActiveClients} {totalActiveClients > 1 ? 'clients' : 'client'} that are being treated by
              the selected practitioners. Please select if you would like to deactivate these clients’ account or
              allocate them to other practitioners in your clinic:
            </BaseText>
            <BaseText type="caption" textAlign="right">
              *Deactivate or allocate clients to other practitioners
            </BaseText>
          </>
        )}
        {step === 3 && (
          <>
            <IconSuccess style={{ margin: 'auto' }} />
            <BaseText type="title" textAlign="center">
              Remove and Reallocate clients <br /> successfully
            </BaseText>
          </>
        )}
      </div>

      <div className="RemovePractitionerModal__body">
        {step === 1 && (
          <div className="RemovePractitionerModal__body-table">
            <Row gutter={10} className="RemovePractitionerModal__body-table--header">
              <Col span={6}>
                <BaseText type="caption">Practitioner name</BaseText>
              </Col>
              <Col span={6}>
                <BaseText type="caption">Number of active clients</BaseText>
              </Col>
            </Row>
            {practitioners.map((practitioner) => (
              <Row
                gutter={10}
                className={`RemovePractitionerModal__body-table--row ${
                  selectedPractitionerIds.includes(practitioner.id) ? 'selected' : ''
                }`}
                key={practitioner.id}
              >
                <Col span={6} className="RemovePractitionerModal__body-table--col">
                  <Checkbox
                    onChange={() => handleSelectPractitioner(practitioner)}
                    checked={selectedPractitionerIds.includes(practitioner.id)}
                  />
                  <BaseText type="caption">{practitioner.firstName + ' ' + practitioner.lastName}</BaseText>
                </Col>
                <Col span={6} className="RemovePractitionerModal__body-table--col">
                  <BaseText type="caption">{practitioner.totalActiveClient}</BaseText>
                </Col>
              </Row>
            ))}
          </div>
        )}
        {step === 2 && (
          <>
            <div className="RemovePractitionerModal__body-table">
              <Row gutter={10} className="RemovePractitionerModal__body-table--header">
                <Col span={7}>
                  <BaseText type="caption">Number of active clients</BaseText>
                </Col>
                <Col span={7}>
                  <BaseText type="caption">Current Practitioner</BaseText>
                </Col>
                <Col span={7}>
                  <BaseText type="caption">Reallocate</BaseText>
                </Col>
                <Col span={3} style={{ display: 'flex', justifyContent: 'center' }}>
                  <BaseText type="caption">Deactivate</BaseText>
                </Col>
              </Row>
              {selectedPractitioners.map((practitioner) => (
                <Row gutter={10} className="RemovePractitionerModal__body-table--row" key={practitioner.id}>
                  <Col span={7}>
                    <BaseText type="caption">{practitioner.totalActiveClient}</BaseText>
                  </Col>
                  <Col span={7}>
                    <BaseText type="caption">{practitioner.firstName + ' ' + practitioner.lastName}</BaseText>
                  </Col>
                  <Col span={7}>
                    <Select
                      placeholder="- -"
                      style={{ width: '100%' }}
                      options={practitionersRellocateClient}
                      value={
                        selectedPractitionerRellocateClient.find((prac) => prac.oldPractitionerId === practitioner.id)
                          ?.newPractitionerId
                      }
                      onChange={(value) => handleSelectPractitionerRellocateClient(practitioner, value)}
                    />
                  </Col>
                  <Col span={3} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Checkbox
                      onChange={() => handleSelectPractitionerDeactivateClient(practitioner)}
                      checked={selectedPractitionerIdsDeactivateClient.includes(practitioner.id)}
                    />
                  </Col>
                </Row>
              ))}
            </div>
            <BaseText type="small">Deactivate: {totalDeativateClients} clients</BaseText>
            <BaseText type="small">Reallocate: {totalRellocateClients} clients</BaseText>
          </>
        )}
        {step === 3 && (
          <BaseText type="small" className="RemovePractitionerModal__body-description" textAlign="center">
            {totalDeativateClients} clients will be removed and {totalRellocateClients} clients have been <br />
            allocated to other practitioners in your clinic from now <br /> on
          </BaseText>
        )}
      </div>

      <div className="RemovePractitionerModal__footer" style={{ justifyContent: step === 3 ? 'center' : 'inherit' }}>
        <Button type="default" onClick={handleCancel} disabled={isSubmitting} hidden={step === 3}>
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>
        <Button type="primary" onClick={handleNextStep} disabled={disableSubmitButton} loading={isSubmitting}>
          {step === 1 ? 'Next' : step === 2 ? 'Confirm' : 'Done'}
        </Button>
      </div>

      <Steps
        direction="horizontal"
        size="small"
        current={step - 1}
        style={{ margin: step === 3 ? '124px auto 0 auto' : 'auto auto 0 auto' }}
        items={[{}, {}, {}]}
        className="RemovePractitionerModal__stepView"
      />
    </Modal>
  );
};

export default RemovePractitionerModal;
