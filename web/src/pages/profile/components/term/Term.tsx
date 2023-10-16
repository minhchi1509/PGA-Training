import ViewPdf from 'src/containers/view-pdf/ViewPdf';

import './Term.scss';
import { STATIC_PAGE } from 'src/variables/constants';

const Term = () => {
  return (
    <div className="Term">
      <ViewPdf title="Terms and Conditions" url={STATIC_PAGE.TERM} removeHeader isSmallPage />
    </div>
  );
};

export default Term;
