import { InfoCircleOutlined } from '@ant-design/icons';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import {
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
} from '@stripe/stripe-js';
import { Spin, Tooltip } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from 'src/components/button';
import { ElementContainer } from 'src/components/containers';
import { PricingLayout } from 'src/components/layout';
import { AlertModal } from 'src/components/popup';
import { showErrorToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import ResponseError from 'src/interfaces/error-response-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { createSubscription } from 'src/services/payment-service';
import { useAppDispatch } from 'src/stores';
import { createNewCard, getCurrentSubscriptionAction } from 'src/stores/profile';
import { ECardType } from '../profile/profile-page-constants';
import './PaymentPage.scss';

const PaymentPage = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const params = useParams();
  const packageId = params?.packageId;
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
  const [cardNumberError, setCardNumberError] = useState<string>('');
  const [cardExpiryError, setCardExpiryError] = useState<string>('');
  const [cardCvcError, setCardCvcError] = useState<string>('');

  const [isLoading, setLoading] = useState(false);

  const handleChangeCardElement = (
    event: StripeCardNumberElementChangeEvent | StripeCardExpiryElementChangeEvent | StripeCardCvcElementChangeEvent,
    type: ECardType,
  ) => {
    const { error } = event;
    switch (type) {
      case ECardType.CARD_NUMBER:
        setCardNumberError(error?.message || '');
        break;
      case ECardType.CARD_EXPIRY:
        setCardExpiryError(error?.message || '');
        break;
      case ECardType.CARD_CVC:
        setCardCvcError(error?.message || '');
        break;
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    if (!packageId) {
      return;
    }

    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardNumberElement);

    if (!card) {
      return;
    }

    try {
      setLoading(true);
      const { token, error } = await stripe.createToken(card);
      if (error) {
        return;
      }

      try {
        const payload = {
          cardToken: token.id,
          isDefault: true,
        };

        await dispatch(createNewCard(payload)).unwrap();
        await createSubscription({ planId: packageId });
        setIsShowAlert(true);
      } catch (error) {
        const message = (error as ResponseError).message;
        showErrorToast(message);
      }
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PricingLayout headerText="Payment" containerClassName="PaymentPage" contentClassname="PaymentPage__content">
      <form onSubmit={onSubmit} className="PaymentPage__form">
        <BaseText type="title" textAlign="center">
          Select the payment method
        </BaseText>

        <div className="PaymentPage__body" style={{ display: isReady ? 'flex' : 'none' }}>
          <ElementContainer leftLabel="Card number">
            <CardNumberElement
              onReady={() => setIsReady(true)}
              options={{ showIcon: true, classes: { invalid: 'invalid' } }}
              className="PaymentPage__body-cardElement"
              onChange={(event) => handleChangeCardElement(event, ECardType.CARD_NUMBER)}
            />
            <BaseText type="caption" color="error" className={cardNumberError ? 'show' : 'hide'}>
              {cardNumberError}
            </BaseText>
          </ElementContainer>

          <div className="PaymentPage__body-cardRow">
            <ElementContainer leftLabel="Expiry date" rightLabel="MM/YY">
              <CardExpiryElement
                options={{ placeholder: '- - / - -', classes: { invalid: 'invalid' } }}
                className="PaymentPage__body-cardElement"
                onChange={(event) => handleChangeCardElement(event, ECardType.CARD_EXPIRY)}
              />
              <BaseText type="caption" color="error" className={cardExpiryError ? 'show' : 'hide'}>
                {cardExpiryError}
              </BaseText>
            </ElementContainer>

            <ElementContainer
              leftLabel="CVV"
              rightLabel={
                <Tooltip placement="top" title="CVV">
                  <InfoCircleOutlined width={16} height={16} />
                </Tooltip>
              }
            >
              <CardCvcElement
                options={{ placeholder: '- - -', classes: { invalid: 'invalid' } }}
                className="PaymentPage__body-cardElement"
                onChange={(event) => handleChangeCardElement(event, ECardType.CARD_CVC)}
              />
              <BaseText type="caption" color="error" className={cardCvcError ? 'show' : 'hide'}>
                {cardCvcError}
              </BaseText>
            </ElementContainer>
          </div>
        </div>

        <div className="AddNewCardModal__body" style={{ display: isReady ? 'none' : 'flex' }}>
          <div className="AddNewCardModal__loading">
            <Spin />
          </div>
        </div>

        <div className="PaymentPage__footer">
          <Button type="default" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Make payment
          </Button>
        </div>
      </form>
      <AlertModal
        open={isShowAlert}
        txtBtnOk="Go to Dashboard"
        title="Payment success"
        closable={false}
        content="Great! Your payment was successful"
        onOk={() => {
          location.replace(RoutePaths.HOME);
          dispatch(getCurrentSubscriptionAction());
        }}
      />
    </PricingLayout>
  );
};

export default PaymentPage;
