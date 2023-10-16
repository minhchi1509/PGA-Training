import './LoginSuccess.scss';
import { SucessfullyVerifyIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';

const LoginSuccess = () => {
  return (
    <div className="LoginSuccess">
      <SucessfullyVerifyIcon className="spin-around" width={64} height={64} />
      <BaseText className="LoginSuccess__title" type="headline">
        Login Successfully
      </BaseText>
      <BaseText className="LoginSuccess__subtitle" type="body1">
        You will be directed to ANTSA system in some seconds
      </BaseText>
    </div>
  );
};

export default LoginSuccess;
