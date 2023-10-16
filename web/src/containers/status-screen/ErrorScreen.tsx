import { ErrorVerifyIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import './ErrorScreen.scss';

interface IProps {
  title?: string;
  subTitle?: string;
  action?: React.ReactNode;
}

const ErrorScreen = ({ title = 'Oops, something went wrong', subTitle = 'Please try again later', action }: IProps) => {
  return (
    <div className="ErrorScreen">
      <ErrorVerifyIcon width={64} height={64} className="ErrorScreen__icon" />
      <BaseText type="headline">{title}</BaseText>
      <BaseText type="body1" inline={false} className="ErrorScreen__note">
        {subTitle}
      </BaseText>

      {action && <div className="ErrorScreen__action">{action}</div>}
    </div>
  );
};

export default ErrorScreen;
