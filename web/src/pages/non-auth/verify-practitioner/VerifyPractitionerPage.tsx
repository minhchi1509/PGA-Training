import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { AntsaIconBlack } from 'src/assets/icons';
import VerifyPractitionerBackground1 from 'src/assets/images/verify-practitioner-bg1.png';
import VerifyPractitionerBackground2 from 'src/assets/images/verify-practitioner-bg2.png';
import Button from 'src/components/button';
import { BaseText } from 'src/components/typography';
import { ErrorScreen, LoadingScreen } from 'src/containers/status-screen';
import ResponseError from 'src/interfaces/error-response-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { checkVerifyProfileStatus, verifyProfile } from 'src/services/auth-service';
import { asyncDelay, decodeTokenInvitePractitioner } from 'src/utils/common-utils';
import { changeCurrentProfileId } from 'src/utils/storage-utils';
import { EVerifyPractitionerErrorType } from 'src/variables/enum-variables';
import './VerifyPractitionerPage.scss';

interface IVerifyPractitionerPageProps {
  hasAccount: boolean;
}

const VerifyPractitionerPage = ({ hasAccount }: IVerifyPractitionerPageProps) => {
  const [search] = useSearchParams();
  const { profileId = '' } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [hasAccountRegister, setHasAccountRegister] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<EVerifyPractitionerErrorType>();
  const { inviterName, clinicName, email } = decodeTokenInvitePractitioner(search.get('token') || '');

  const onClickSignUp = () => {
    navigate(RoutePaths.PRACTITIONER_SIGN_UP, { state: { email: email, profileId: profileId } });
  };

  const onClickLogin = (hasAccount?: boolean) => {
    if (hasAccount) {
      navigate(RoutePaths.SIGN_IN, { state: { email: email } });
    } else {
      navigate(RoutePaths.SIGN_IN);
    }
  };

  const verifyExistProfile = async () => {
    try {
      await verifyProfile(profileId);
    } catch (error) {
      const errorType = (error as ResponseError).data?.errorType;

      if (errorType === EVerifyPractitionerErrorType.EXISTED) {
        setHasAccountRegister(true)
        return;
      }
      setErrorType(errorType);
    } finally {
      setLoading(false);
      changeCurrentProfileId(profileId);
    }
  };

  const checkVerifyInvite = async () => {
    try {
      const { status } = await checkVerifyProfileStatus(profileId);
      setHasAccountRegister(status);

      if (status) {
        verifyExistProfile();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setErrorType(EVerifyPractitionerErrorType.DELETED);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkVerifyInvite();
  }, []);

  useEffect(() => {
    if (hasAccountRegister) {
      verifyExistProfile();
    }
  }, [hasAccountRegister]);

  if (loading) return <LoadingScreen isShowTip />;

  return errorType ? (
    <ErrorScreen />
  ) : (
    <div
      className="VerifyPractitionerContentPage"
      style={{
        background: !hasAccountRegister
          ? 'linear-gradient(179.63deg, #3a85be 0.5%, #3a85be 24.73%, #3b86bf 51.56%, #3a85be 78.47%, #3b86bf 99.87%)'
          : 'linear-gradient(179.76deg, #DF9998 0.24%, #DC9C9B 24.75%, #DCA1A0 51.89%, #DCA09E 79.11%, #DD9C9C 100.75%), #B1CBE4',
      }}
    >
      <img
        src={!hasAccountRegister ? VerifyPractitionerBackground1 : VerifyPractitionerBackground2}
        alt="Verify Practitioner Background Image"
      />
      <div className="VerifyPractitionerContentPage__header">
        <AntsaIconBlack />
        <BaseText type="caption" className="VerifyPractitionerContentPage__header-text">
          FOR PROFESSIONALS
        </BaseText>
      </div>
      <BaseText type="headline" className="VerifyPractitionerContentPage__welcome-header">
        Welcome to ANTSA
      </BaseText>
      <BaseText type="display1" className="VerifyPractitionerContentPage__welcome-content">
        {inviterName} from {clinicName} <br /> has invited you to join ANTSA.
      </BaseText>

      <div className="VerifyPractitionerContentPage__footer">
        {!hasAccountRegister ? (
          <>
            <Button
              className="VerifyPractitionerContentPage__footer-button"
              type="primary"
              onClick={onClickSignUp}
              size="large"
              loading={loading}
            >
              Sign up
            </Button>
            <BaseText type="caption" textAlign="center">
              Already have an account? <Typography.Link onClick={() => onClickLogin()}>Log in</Typography.Link>
            </BaseText>
          </>
        ) : (
          <>
            <BaseText type="title" textAlign="center" className="VerifyPractitionerContentPage__footer-notice">
              We noticed that you&apos;ve already had an account in ANTSA, <br /> please login and update your profile
              for {clinicName}
            </BaseText>

            <Button
              className="VerifyPractitionerContentPage__footer-button"
              type="primary"
              onClick={() => onClickLogin(true)}
              loading={loading}
            >
              Log in
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPractitionerPage;
