import ViewPdf from 'src/containers/view-pdf/ViewPdf';

import './Privacy.scss';
import { STATIC_PAGE } from 'src/variables/constants';

const Privacy = () => {
  return (
    <div className="Privacy">
      <ViewPdf title="Privacy Policy" url={STATIC_PAGE.PRIVACY} removeHeader isSmallPage />
    </div>
  );
};

export default Privacy;
