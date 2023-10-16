import ViewPdf from 'src/containers/view-pdf/ViewPdf';
import { STATIC_PAGE } from 'src/variables/constants';

export default function TermPage() {
  return <ViewPdf title="Terms and Conditions" url={STATIC_PAGE.TERM} />;
}
