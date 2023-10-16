import { Divider } from 'antd';
import dayjs from 'dayjs';

import { BaseText } from 'src/components/typography';
import { TCurrentPayment } from 'src/interfaces/profile-interface';

interface IFooterProps {
  isOwner: boolean;
  currentSubscription?: TCurrentPayment;
}

const Footer = ({ isOwner, currentSubscription }: IFooterProps) => {
  const amount = isOwner ? currentSubscription?.plan?.amount : 1;

  return (
    <>
      <Divider className="divider-footer" />
      <div className="footer">
        <BaseText type="title">Activities this month</BaseText>
        {!currentSubscription?.cancelAt && (
          <BaseText type="small">
            Next payment due: {dayjs(currentSubscription?.nextPaymentAt).format('DD/MM/YYYY')}
          </BaseText>
        )}

        <BaseText type="small">
          {`Pricing plan this month: `}
          <span className="current-pricing-plan">{`$${currentSubscription?.plan?.oldPrice ?? 0} - ${amount} ${
            Number(amount) > 1 ? 'practitioners' : 'practitioner'
          } ${Number(amount) > 1 ? 'licenses (+G.S.T.)' : 'license (+G.S.T.)'}`}</span>
        </BaseText>
      </div>
    </>
  );
};

export default Footer;
