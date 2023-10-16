import './StatusBox.scss';
import { EProfileStatus } from 'src/variables/common';
import { capitalizeFirstLetter } from 'src/utils/common-utils';
import { EPaymentStatus } from 'src/variables/enum-variables';

interface IProps {
  status: string;
  isShowDischarge?: boolean;
}

const StatusBox = ({ status, isShowDischarge }: IProps) => {
  const isDischarge = status === EProfileStatus.INACTIVE && isShowDischarge;
  const title = status === EPaymentStatus.TRIALING ? 'Free trial' : capitalizeFirstLetter(status, isShowDischarge);

  return (
    <div className={`StatusBox__container ${status} ${isDischarge ? 'discharge' : ''}`}>
      {status === EProfileStatus.ACTIVE && <div className="StatusBox__dot" />}
      <div className="StatusBox__status">{title}</div>
    </div>
  );
};

export default StatusBox;
