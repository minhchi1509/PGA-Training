import { Container } from 'src/components/containers';
import SummaryComponent from './summary/SummaryComponent';
import './ReportPage.scss';
import ReportChartComponent from './report-chart/ReportChartComponent';

const ReportPage = () => {
  return (
    <Container className="ReportPage">
      <SummaryComponent />
      <ReportChartComponent />
    </Container>
  );
};

export default ReportPage;
