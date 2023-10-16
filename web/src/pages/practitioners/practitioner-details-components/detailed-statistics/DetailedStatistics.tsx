import './DetailedStatistics.scss';
import { BaseText } from 'src/components/typography';
import { EStatisticType } from '../../practitioner-details-constants';
import { TDetailStatisticResponse } from 'src/interfaces/practitioners-interface';

interface IDetailedStatisticsProps {
  statistic?: TDetailStatisticResponse;
}

const DetailedStatistics = ({ statistic }: IDetailedStatisticsProps) => {
  const getTotal = (type: string) => {
    switch (type) {
      case EStatisticType.PENDING_CLIENTS:
        return statistic?.pendingClient ? statistic?.pendingClient : 0;
      case EStatisticType.ACTIVE_CLIENTS:
        return statistic?.activeClient;
      case EStatisticType.DEACTIVE_CLIENTS:
        return statistic?.dischargedClient ? statistic?.dischargedClient : 0;
      case EStatisticType.MESSAGES:
        return statistic?.message ? statistic?.message : 0;
      case EStatisticType.HOMEWORK_TASKS:
        return statistic?.activeHomeWork ? statistic?.activeHomeWork : 0;
      default:
        return 0;
    }
  };

  return (
    <div className="DetailedStatistics">
      <div style={{ width: '50%' }}>
        {Object.values(EStatisticType)
          .filter((item) => ![EStatisticType.MESSAGES, EStatisticType.HOMEWORK_TASKS].includes(item))
          .map((value) => {
            if (value !== EStatisticType.MESSAGES) {
              const subHeading =
                value === EStatisticType.PENDING_CLIENTS
                  ? 'Number of pending clients'
                  : value === EStatisticType.DEACTIVE_CLIENTS
                  ? 'Number of discharged'
                  : 'Number of active clients';

              const color =
                value === EStatisticType.PENDING_CLIENTS
                  ? 'pending'
                  : value === EStatisticType.DEACTIVE_CLIENTS
                  ? 'discharged'
                  : 'active';

              return (
                <div className="DetailedStatistics__container" key={value}>
                  <div className="DetailedStatistics__container-card">
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                      <div className={`decor ${color}`}></div>
                      <div>
                        <BaseText type="subHeading">{subHeading}</BaseText>
                      </div>
                    </div>
                    <BaseText type="display2" className={`total-color__${color}`}>
                      {getTotal(value)}
                    </BaseText>
                  </div>
                </div>
              );
            }
          })}
      </div>
      <div style={{ width: '50%' }}>
        {Object.values(EStatisticType)
          .filter((item) => item === EStatisticType.MESSAGES)
          .map((value) => {
            const subHeading = value === EStatisticType.MESSAGES ? 'Number of messages' : 'Number of active homework';
            const color = 'message';
            return (
              <div className="DetailedStatistics__container" key={value}>
                <div className="DetailedStatistics__container-card">
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                    <div className={`decor ${color}`}></div>
                    <div>
                      <BaseText type="subHeading">{subHeading}</BaseText>
                    </div>
                  </div>
                  <BaseText type="display2" className={`total-color__${color}`}>
                    {getTotal(value)}
                  </BaseText>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DetailedStatistics;
