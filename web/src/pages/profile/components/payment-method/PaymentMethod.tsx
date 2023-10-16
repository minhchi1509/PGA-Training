import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Empty, MenuProps, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './PaymentMethod.scss';
import { DeleteIcon } from 'src/assets/icons';
import Button from 'src/components/button';
import Dropdown from 'src/components/dropdown/Dropdown';
import { ConfirmModal } from 'src/components/popup';
import Tag from 'src/components/tag';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import ResponseError from 'src/interfaces/error-response-interface';
import { TCreateNewCardParams, TUpdateCardParams } from 'src/interfaces/profile-interface';
import { TRootState, useAppDispatch } from 'src/stores';
import {
  EProfileActions,
  createNewCard,
  deleteCard,
  getListCard,
  setCardAsDefault,
  updateCard,
} from 'src/stores/profile';
import { formatCardNumber } from 'src/utils/common-utils';
import { ECardBrand, ECardBrandName } from 'src/variables/enum-variables';
import { EConfirmModalType, ICardInfo } from '../../profile-page-constants';
import AddNewCardModal from '../add-new-card-modal/AddNewCardModal';
import { AmericanExpressCard, DiscoverCard, JcbCard, MasterCardLogo, VisaCardLogo } from 'src/assets/images';

const CardLogos = {
  [ECardBrand.JCB]: JcbCard,
  [ECardBrand.VISA]: VisaCardLogo,
  [ECardBrand.MASTER_CARD]: MasterCardLogo,
  [ECardBrand.AMERICAN_EXPRESS]: AmericanExpressCard,
  [ECardBrand.DISCOVER]: DiscoverCard,
};

const PaymentMethod = () => {
  const dispatch = useAppDispatch();
  const { loadingState, cards } = useSelector((state: TRootState) => ({
    cards: state.profile.cards,
    loadingState: state.loading,
  }));

  const [confirmModalType, setConfirmModalType] = useState<EConfirmModalType>();
  const [isOpenAddNewCardModal, setOpenAddNewCardModal] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<ICardInfo>();

  const renderOptions = (card: ICardInfo): MenuProps['items'] => {
    const isDefault = card.isDefault;

    let options: MenuProps['items'] = [
      {
        key: '2',
        label: <BaseText type="small">Edit</BaseText>,
        onClick: () => handleSelectCard(card, undefined, true),
      },
    ];

    if (!isDefault) {
      options = [
        {
          key: '1',
          label: <BaseText type="small">Set as default payment method</BaseText>,
          onClick: () => handleSelectCard(card, EConfirmModalType.SET_DEFAULT),
        },
        ...options,
        {
          key: '3',
          label: <BaseText type="small">Remove</BaseText>,
          onClick: () => handleSelectCard(card, EConfirmModalType.REMOVE),
        },
      ];
    }

    return options;
  };

  const handleSelectCard = (card: ICardInfo, confirmType: EConfirmModalType | undefined, isEdit?: boolean) => {
    setConfirmModalType(confirmType);
    setSelectedCard(card);
    if (isEdit) {
      handleOpenAddNewCardModal();
    }
    document.getElementById(`Btn__Circle--${card.id}`)?.click();
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalType(undefined);
    setSelectedCard(undefined);
  };

  const handleOpenAddNewCardModal = () => {
    setOpenAddNewCardModal(true);
  };

  const handleCloseAddNewCardModal = () => {
    setOpenAddNewCardModal(false);
    setSelectedCard(undefined);
  };

  const handleSubmitAddNewCard = async (token: string, isDefault: boolean) => {
    try {
      const payload: TCreateNewCardParams = {
        cardToken: token,
        isDefault: isDefault,
      };
      await dispatch(createNewCard(payload)).unwrap();
      showSuccessToast('Payment method has been added successfully');
      handleCloseAddNewCardModal();
      fetchCardList();
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    }
  };

  const handleSubmitEditCard = async (exp_month: string, exp_year: string, isDefault: boolean) => {
    try {
      if (selectedCard) {
        const payload: TUpdateCardParams = {
          cardId: selectedCard.id,
          expMonth: exp_month,
          expYear: exp_year,
          isDefault: isDefault,
        };
        await dispatch(updateCard(payload)).unwrap();
        showSuccessToast('Payment method has been updated successfully');
        handleCloseAddNewCardModal();
        fetchCardList();
      }
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    }
  };

  const fetchCardList = async () => {
    try {
      await dispatch(getListCard()).unwrap();
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    }
  };

  const handleSubmitCardAction = async () => {
    try {
      if (!selectedCard) return;

      if (confirmModalType === EConfirmModalType.SET_DEFAULT) {
        await dispatch(setCardAsDefault({ cardId: selectedCard.id }));
        showSuccessToast('Payment method has been set as default successfully');
      }

      if (confirmModalType === EConfirmModalType.REMOVE) {
        await dispatch(deleteCard({ cardId: selectedCard.id }));
        showSuccessToast('Payment method has been removed successfully');
      }

      handleCloseConfirmModal();
      fetchCardList();
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    }
  };

  useEffect(() => {
    fetchCardList();
  }, []);

  return (
    <div className="PaymentMethod">
      <div className="PaymentMethod__header">
        <BaseText type="title">My payment method</BaseText>
        <div className="PaymentMethod__header-btnContainer">
          <BaseText inline type="caption">
            Add a card
          </BaseText>
          <Button
            className="PaymentMethod__header-btnContainer--btn"
            icon={<PlusOutlined />}
            shape="circle"
            onClick={handleOpenAddNewCardModal}
          />
        </div>
      </div>
      <div className="PaymentMethod__body">
        {loadingState[EProfileActions.GET_CARD_LIST] ? (
          <Spin size="large" />
        ) : (
          cards?.map((card) => (
            <Row align="middle" className={`PaymentMethod__body-cardContainer`} key={card.id}>
              <Col span={2} className="PaymentMethod__body-cardContainer-item">
                <img src={CardLogos[card.brand] || VisaCardLogo} className="PaymentMethod__body-cardContainer-brand" />
              </Col>
              <Col span={7} className="PaymentMethod__body-cardContainer-item">
                <BaseText type="body1">{ECardBrandName[card.brand] || card.brand}</BaseText>
                {card.isDefault && (
                  <Tag color="default">
                    <BaseText type="x-small">Default</BaseText>
                  </Tag>
                )}
              </Col>
              <Col span={7} className="PaymentMethod__body-cardContainer-item">
                <BaseText type="small">{formatCardNumber(card.last4)}</BaseText>
              </Col>
              <Col span={7} className="PaymentMethod__body-cardContainer-item">
                <BaseText type="small">
                  Expiry {card.exp_month}/{card.exp_year}
                </BaseText>
              </Col>
              <Col span={1} className="PaymentMethod__body-cardContainer-item">
                <Dropdown trigger={['click']} placement="bottomRight" menu={{ items: renderOptions(card) }}>
                  <Button
                    shape="circle"
                    icon={<EllipsisOutlined />}
                    id={`Btn__Circle--${card.id}`}
                    className={`PaymentMethod__body-cardContainer-item-moreOptionBtn`}
                  />
                </Dropdown>
              </Col>
            </Row>
          ))
        )}
        {!loadingState[EProfileActions.GET_CARD_LIST] && !cards?.length && <Empty />}
      </div>
      <ConfirmModal
        open={Boolean(confirmModalType)}
        onCancelButton={handleCloseConfirmModal}
        onsubmit={handleSubmitCardAction}
        icon={confirmModalType === EConfirmModalType.REMOVE && <DeleteIcon />}
        danger={confirmModalType === EConfirmModalType.REMOVE}
        titleModal={
          confirmModalType === EConfirmModalType.REMOVE
            ? 'Remove payment method'
            : confirmModalType === EConfirmModalType.SET_DEFAULT
            ? 'Set a new payment method'
            : ''
        }
        txtBtnCancel="Cancel"
        txtBtnConfirm={confirmModalType === EConfirmModalType.REMOVE ? 'Remove' : 'Confirm'}
        loading={loadingState[EProfileActions.DELETE_CARD] || loadingState[EProfileActions.SET_CARD_DEFAULT]}
      >
        <BaseText type="caption" textAlign="center">
          {confirmModalType === EConfirmModalType.REMOVE
            ? 'This card will no longer be used to pay your ANTSA subscription. If you change your mind, you can always add it again later'
            : confirmModalType === EConfirmModalType.SET_DEFAULT
            ? 'You cannot remove a default payment method. Please set a new default payment method before removing this card'
            : ''}
        </BaseText>
      </ConfirmModal>
      {isOpenAddNewCardModal && (
        <AddNewCardModal
          open={isOpenAddNewCardModal}
          onCancel={handleCloseAddNewCardModal}
          handleSubmit={handleSubmitAddNewCard}
          hasCard={!!(cards && cards.length)}
          selectedCard={selectedCard}
          handleSubmitEditCard={handleSubmitEditCard}
        />
      )}
    </div>
  );
};

export default PaymentMethod;
