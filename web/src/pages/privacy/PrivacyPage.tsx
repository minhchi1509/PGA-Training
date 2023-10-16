import ViewPdf from 'src/containers/view-pdf/ViewPdf';
import { STATIC_PAGE } from 'src/variables/constants';

export default function PrivacyPage() {
  return <ViewPdf title="Privacy Policy" url={STATIC_PAGE.PRIVACY} />;
}
