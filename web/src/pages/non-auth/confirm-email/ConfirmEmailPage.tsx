import { useState } from 'react';
import { Space, Typography } from 'antd';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { ConfirmEmailIcon, InfoCircleIcon } from 'src/assets/icons';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import ResponseError from 'src/interfaces/error-response-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { resendEmailVerify } from 'src/services/auth-service';
import { EReft } from 'src/variables/enum-variables';
import './ConfirmEmailPage.scss';

const ConfirmEmailPage = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resending, setResending] = useState<boolean>(false);
  const type = searchParams.get('ref');
  const id = searchParams.get('id') || '';
  const isLoggedIn = type === EReft.SIGN_IN;

  const onResend = async () => {
    try {
      setResending(true);
      await resendEmailVerify(id);
      showSuccessToast('The confirmation email has been re-sent');
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    } finally {
      setResending(false);
    }
  };

  if (!id) {
    navigate(RoutePaths.SIGN_IN);
  }

  return (
    <Space direction="vertical" size="middle" className={`container ${isLoggedIn ? 'resend' : ''}`}>
      <ConfirmEmailIcon className="confirm-email-icon" />
      <BaseText className="confirm-email-text" inline={false} type="display1" textAlign="center">
        Confirm your email
      </BaseText>
      <div className="info-box">
        <InfoCircleIcon className="info-icon" />
        <BaseText type="caption" inline={false}>
          {isLoggedIn
            ? 'Your account has been created but not activated yet. Click on the verification link that has been sent to your email to get started'
            : 'A verification link has been sent to your email. Click on the link to get started.'}
        </BaseText>
      </div>
      <BaseText className="more-info-text" inline={false} type="body1">
        {`We've sent an email to ${location.state?.email} to verify your email address and activate your account. `}
      </BaseText>
      <BaseText className="more-info-text" inline={false} type="body1">
        If you did not receive the verification email, please check your Junk/Spam folders.
      </BaseText>
      <BaseText inline={false} type="caption" className="end-text" textAlign="center">
        Didn&apos;t receive the email?{' '}
        <Typography.Link className="link" target="_blank" onClick={onResend} disabled={resending}>
          Re-send
        </Typography.Link>
      </BaseText>
    </Space>
  );
};

export default ConfirmEmailPage;
