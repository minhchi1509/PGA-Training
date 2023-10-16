import { InfoCircleOutlined } from '@ant-design/icons';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import {
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
} from '@stripe/stripe-js';
import { Checkbox, Modal, Spin, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import Button from 'src/components/button';
import { ElementContainer } from 'src/components/containers';
import DatePicker from 'src/components/date-picker';
import { showErrorToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import ResponseError from 'src/interfaces/error-response-interface';
import { ECardType, ICardInfo } from '../../profile-page-constants';
import './AddNewCardModal.scss';

interface IAddNewCardModalProps {
  open: boolean;
  hasCard: boolean;
  handleSubmit: (token: string, isDefault: boolean) => void;
  onCancel: () => void;

  selectedCard?: ICardInfo;
  handleSubmitEditCard?: (exp_month: string, exp_year: string, isDefault: boolean) => void;
}

const AddNewCardModal = ({
  open,
  onCancel,
  handleSubmit,
  hasCard,
  selectedCard,
  handleSubmitEditCard,
}: IAddNewCardModalProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDefault, setDefault] = useState<boolean>(false);
  const [cardNumberError, setCardNumberError] = useState<string>('');
  const [cardExpiryError, setCardExpiryError] = useState<string>('');
  const [cardCvcError, setCardCvcError] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<dayjs.Dayjs | null>(
    dayjs()
      .month(Number(selectedCard?.exp_month) - 1)
      .year(Number(selectedCard?.exp_year)),
  );
  const isEditting = useMemo(() => !!selectedCard, [selectedCard]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isEditting && expiryDate && handleSubmitEditCard) {
      setLoading(true);
      await handleSubmitEditCard((expiryDate.month() + 1).toString(), expiryDate.year().toString(), isDefault);
      setLoading(false);
      return;
    }

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

      await handleSubmit(token.id, isDefault);
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (selectedCard) {
      setDefault(selectedCard.isDefault);
    } else {
      setDefault(!hasCard);
    }
  }, [selectedCard, hasCard]);

  return (
    <Modal open={open} centered closable={false} footer={null} width={570} className="AddNewCardModal">
      <form onSubmit={onSubmit} className="AddNewCardModal__form">
        <BaseText type="title" textAlign="center">
          {isEditting ? 'Update the credit card' : 'Add a credit card'}
        </BaseText>

        <div className="AddNewCardModal__body" style={{ display: isReady || isEditting ? 'flex' : 'none' }}>
          {!isEditting ? (
            <>
              <ElementContainer leftLabel="Card number">
                <CardNumberElement
                  onReady={() => setIsReady(true)}
                  options={{ showIcon: true, classes: { invalid: 'invalid' } }}
                  className="AddNewCardModal__body-cardElement"
                  onChange={(event) => handleChangeCardElement(event, ECardType.CARD_NUMBER)}
                />
                <BaseText type="caption" color="error" className={cardNumberError ? 'show' : 'hide'}>
                  {cardNumberError}
                </BaseText>
              </ElementContainer>

              <div className="AddNewCardModal__body-cardRow">
                <ElementContainer leftLabel="Expiry date" rightLabel="MM/YY">
                  <CardExpiryElement
                    options={{ placeholder: '- - / - -', classes: { invalid: 'invalid' } }}
                    className="AddNewCardModal__body-cardElement"
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
                    className="AddNewCardModal__body-cardElement"
                    onChange={(event) => handleChangeCardElement(event, ECardType.CARD_CVC)}
                  />
                  <BaseText type="caption" color="error" className={cardCvcError ? 'show' : 'hide'}>
                    {cardCvcError}
                  </BaseText>
                </ElementContainer>
              </div>
            </>
          ) : (
            <ElementContainer leftLabel="Expiry date" rightLabel="MM/YY">
              <DatePicker
                size="small"
                disabledDate={(date) => date.isBefore(new Date())}
                defaultValue={expiryDate ?? undefined}
                onChange={(value) => setExpiryDate(value)}
                picker="month"
                placeholder="- - / - -"
                format="MM/YY"
                allowClear={false}
              />
            </ElementContainer>
          )}

          <Checkbox
            checked={isDefault}
            className="AddNewCardModal__body--checkbox"
            onChange={(e) => setDefault(e.target.checked)}
            disabled={!hasCard || selectedCard?.isDefault}
          >
            Make this my default payment method
          </Checkbox>
        </div>

        <div className="AddNewCardModal__body" style={{ display: isReady || isEditting ? 'none' : 'flex' }}>
          <div className="AddNewCardModal__loading">
            <Spin />
          </div>
        </div>

        <div className="AddNewCardModal__footer">
          <Button type="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading} disabled={!stripe}>
            {isEditting ? 'Update card' : 'Add card'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddNewCardModal;
