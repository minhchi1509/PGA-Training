import { Suspense, useMemo } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import { AuthLayout, NonAuthLayout } from 'src/layouts';
import { CreateNewProfilePage } from 'src/pages/auth';
import PricingPackage from 'src/pages/pricing-package/PricingPackage';
import { RoutePaths } from './routes-constants';

// pages
import ClientsPage, { ClientDetailsPage } from 'src/pages/clients';
import Home from 'src/pages/home/Home';
import {
  ConfirmEmailPage,
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from 'src/pages/non-auth';
import VerifyPractitionerPage from 'src/pages/non-auth/verify-practitioner/VerifyPractitionerPage';
import PractitionersPage, { PractitionerDetailsPage } from 'src/pages/practitioners';
import Homework from 'src/pages/homework';
import PaymentPage from 'src/pages/payment/PaymentPage';
import ProfilePage from 'src/pages/profile';
import MessagesPages from 'src/pages/messages';
import PsychoeducationPage from 'src/pages/psycho-education';
import FilesPages from 'src/pages/files';
import TermPage from 'src/pages/term';
import VerifyOTPPage from 'src/pages/non-auth/verify-otp/VerifyOTPPage';
import PrivacyPage from 'src/pages/privacy';
import ReportPage from 'src/pages/report/ReportPage';

const Routes = () => {
  const routes = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <>
            {/* public route */}
            <Route path={RoutePaths.EMAIL_VERIFY()} element={<VerifyEmailPage />} />

            {/* non auth */}
            <Route element={<NonAuthLayout />}>
              <Route path={RoutePaths.SIGN_IN} element={<LoginPage />} />
              <Route path={RoutePaths.OTP_VERIFICATION} element={<VerifyOTPPage />} />
              <Route path={RoutePaths.SIGN_UP()} element={<RegisterPage />} />
              <Route path={RoutePaths.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              <Route path={RoutePaths.RESET_PASSWORD} element={<ResetPasswordPage />} />
              <Route path={RoutePaths.PRACTITIONER_SIGN_UP} element={<RegisterPage />} />
              <Route path={RoutePaths.CONFIRM_EMAIL} element={<ConfirmEmailPage />} />
              <Route path={RoutePaths.VERIFY_PROFILE()} element={<VerifyPractitionerPage hasAccount />} />
              <Route path={RoutePaths.TERM} element={<TermPage />} />
              <Route path={RoutePaths.PRIVACY} element={<PrivacyPage />} />
              <Route path={RoutePaths.REGISTER_PROFILE()} element={<VerifyPractitionerPage hasAccount={false} />} />
              <Route path="*" element={<LoginPage />} />
            </Route>

            {/*auth */}
            <Route element={<AuthLayout />}>
              <Route index element={<Home />} />
              <Route path={RoutePaths.PRACTITIONER} element={<PractitionersPage />} />
              <Route path={RoutePaths.PROFILE} element={<ProfilePage />} />
              <Route path={RoutePaths.PRACTITIONER_DETAILS()} element={<PractitionerDetailsPage />} />
              <Route path={RoutePaths.CREATE_CLINIC_PROFILE()} element={<CreateNewProfilePage />} />
              <Route path={RoutePaths.PRICING_PACKAGE} element={<PricingPackage />} />
              <Route path={RoutePaths.PAYMENT()} element={<PaymentPage />} />
              <Route path={RoutePaths.CLIENTS} element={<ClientsPage />} />
              <Route path={RoutePaths.CLIENT_DETAILS()} element={<ClientDetailsPage />} />
              <Route path={RoutePaths.HOMEWORK} element={<Homework />} />
              <Route path={RoutePaths.PSYCHOEDUCATION} element={<PsychoeducationPage />} />
              <Route path={RoutePaths.FILES} element={<FilesPages />} />
              <Route path={RoutePaths.FILES_FOLDER()} element={<FilesPages />} />
              <Route path={RoutePaths.REPORT} element={<ReportPage />} />
              <Route path="*" element={<Home />} />
            </Route>
            <Route
              path={RoutePaths.MESSAGES}
              element={<AuthLayout>{(socket) => <MessagesPages socket={socket} />}</AuthLayout>}
            />
          </>,
        ),
      ),
    [],
  );

  return (
    <Suspense>
      <RouterProvider router={routes} />
    </Suspense>
  );
};

export default Routes;
