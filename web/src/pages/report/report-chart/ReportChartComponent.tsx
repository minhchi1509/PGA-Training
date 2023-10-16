import { CommonContent } from 'src/components/containers';
import './ReportChartComponent.scss';
import ClientEngagementChart from './client-engagement/ClientEngagementChart';
import PractitionerEngagementChart from './practitioner-engagement/PractitionerEngagementChart';
import { useSelector } from 'react-redux';
import { TRootState } from 'src/stores';

const ReportChartComponent = () => {
  const profile = useSelector((state: TRootState) => state.user.profile);
  const role = profile?.role;
  return (
    <CommonContent title="Report" className="ReportComponent">
      <div className="ReportComponent__left">
        <PractitionerEngagementChart role={role} />
      </div>
      <div className="ReportComponent__right">
        <ClientEngagementChart />
      </div>
    </CommonContent>
  );
};

export default ReportChartComponent;
