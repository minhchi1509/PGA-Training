import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ErrorVerifyIcon, SucessfullyVerifyIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import { RoutePaths } from 'src/routes/routes-constants';
import { verifyAccount } from 'src/services/auth-service';
import { getItem } from 'src/utils/storage-utils';
import { EAuthToken } from 'src/variables/storage';

import './VerifyEmailPage.scss';

const VerifyEmailPage = () => {
  const params = useParams();
  const [isSuccessfully, setIsSuccessfully] = useState<boolean>(true);

  const accessToken = getItem(EAuthToken.ACCESS_TOKEN);

  const verifyEmail = async (id: string) => {
    try {
      await verifyAccount(id);
      setTimeout(() => {
        if (accessToken) {
          localStorage.clear();
        }
        window.location.replace(RoutePaths.SIGN_IN);
      }, 2000);
    } catch (error) {
      setIsSuccessfully(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      verifyEmail(params.id);
    }
  }, [params?.id]);

  return (
    <div className="verify-email-container">
      {isSuccessfully ? (
        <SucessfullyVerifyIcon className="spin-around" width={64} height={64} />
      ) : (
        <ErrorVerifyIcon width={64} height={64} />
      )}
      <div className="verify-email-container__description">
        <BaseText type="headline" inline={false}>
          {isSuccessfully ? 'Your email is verified successfully.' : 'Oops, something went wrong'}
        </BaseText>
        <BaseText type="body1" inline={false} className="verify-email-container__description--explain-text">
          {isSuccessfully ? 'You will be directed to ANTSA system in some seconds' : 'Please try again later'}
        </BaseText>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
