import { Typography } from 'antd';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import OwnerManCardBgImg from 'src/assets/images/dashboard-owner-man-background.png';
import OwnerGirlCardBgImg from 'src/assets/images/dashboard-owner-girl-background.png';
import PractitionerManCardBgImg from 'src/assets/images/dashboard-practitioner-man-background.png';
import PractitionerGirlCardBgImg from 'src/assets/images/dashboard-practitioner-girl-background.png';
import DashboardWelcomeBgImg from 'src/assets/images/dashboard-welcome-background.png';
import { BaseText } from 'src/components/typography';
import './Dashboard.scss';

import { TGetDashboardResponse } from 'src/interfaces/common-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { TRootState } from 'src/stores';
import { truncateString } from 'src/utils/common-utils';
import ChatItem from './ChatItem';
import StatisticCard from './StatisticCard';

interface IDashboardProps {
  dashboardDetail: TGetDashboardResponse;
}

const Dashboard: FC<IDashboardProps> = ({ dashboardDetail }) => {
  const navigate = useNavigate();
  const quote = useSelector((state: TRootState) => state.user.quote);

  const {
    firstName,
    lastName,
    statistic: { numberActiveClient, numberActivePractitioner, numberAssignedTask },
    newMessages,
  } = dashboardDetail;

  return (
    <div className="Dashboard">
      <BaseText type="display1" textAlign="left">
        Dashboard
      </BaseText>
      <div className="WelcomeCard">
        <StatisticCard
          className="WelcomeCard__left"
          title={`Welcome to ANTSA, ${truncateString(`${firstName} ${lastName}`, 20)}`}
          decorColor="#35d6af"
        >
          <div className="WelcomeCard__left--quote">
            <BaseText type="headline">“{quote?.message}”</BaseText>
            <BaseText type="body1" className="WelcomeCard__left--quote-author">
              – {quote?.author}
            </BaseText>
          </div>
        </StatisticCard>
        <div className="WelcomeCard__right">
          <img src={DashboardWelcomeBgImg} />
        </div>
      </div>
      <div className="StatisticCards">
        <StatisticCard
          title="Active clients"
          decorColor="#19BCFE"
          imgSrc={numberAssignedTask !== undefined ? PractitionerManCardBgImg : OwnerManCardBgImg}
        >
          <BaseText type="display2">{numberActiveClient}</BaseText>
        </StatisticCard>
        <StatisticCard
          title={`${numberAssignedTask !== undefined ? 'Assigned tasks' : 'Active practitioners'}`}
          decorColor="#5A73D8"
          imgSrc={numberAssignedTask !== undefined ? PractitionerGirlCardBgImg : OwnerGirlCardBgImg}
        >
          <BaseText type="display2">{numberActivePractitioner ?? numberAssignedTask}</BaseText>
        </StatisticCard>
        {newMessages && (
          <StatisticCard className="MessagesCard" title="Last messages" decorColor="#ABB3FE">
            <Typography.Link className="MessagesCard__link" onClick={() => navigate(RoutePaths.MESSAGES)}>
              View all
            </Typography.Link>
            {newMessages.length > 0 ? (
              <div className="MessageCard__conversationBox">
                {newMessages.map((chatItem, index) => (
                  <ChatItem key={index} chatItemDetail={chatItem} />
                ))}
              </div>
            ) : (
              <BaseText textAlign="center" className="MessagesCard__footer">
                No messages found
              </BaseText>
            )}
          </StatisticCard>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
