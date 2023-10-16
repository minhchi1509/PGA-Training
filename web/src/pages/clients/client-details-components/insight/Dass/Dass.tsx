import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Empty, Spin } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import './Dass.scss';
import ChartLegend from './ChartLegend';
import ChartLabel from './ChartLabel';
import ModalSeverity from './ModalSeverity';
import { BaseText } from 'src/components/typography';
import { getTrackDass } from 'src/services/client-service';
import { EDASS_HOMEWORK } from 'src/variables/enum-variables';
import { TDass } from 'src/interfaces/clients-interface';
import { showErrorToast } from 'src/components/toast/Toast';
import { DassChartOptions, convertDassChartData } from '../util';
import ResponseError from 'src/interfaces/error-response-interface';

type DassChart = {
  title: string;
  type: string;
  values: TDass | undefined;
};

const Dass = () => {
  const params = useParams();
  const clientId = params?.clientId || '';
  const [dass, setDass] = useState<DassChart>();
  const [isShowSeverity, setIsShowSeverity] = useState<boolean>(false);
  const [listDass, setListDass] = useState<DassChart[]>([
    {
      title: 'DASS-21 Result',
      type: EDASS_HOMEWORK.DASS21,
      values: undefined,
    },
    {
      title: 'DASS-42 Result',
      type: EDASS_HOMEWORK.DASS42,
      values: undefined,
    },
  ]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const listDassNew = JSON.parse(JSON.stringify(listDass));
      for (const dass of listDassNew) {
        const response = await getTrackDass(clientId, dass.type);
        listDassNew.forEach((item: DassChart) => {
          if (item.type === dass.type) {
            item.values = response;
          }
        });
      }

      setListDass(listDassNew);
    } catch (e) {
      showErrorToast((e as ResponseError).message);
    }
  };

  const convertChart = (type: string) => {
    const dass = listDass.find((dass) => dass.type === type);
    if (dass) {
      const { labels, values } = convertDassChartData(dass.values?.data);
      return {
        labels,
        datasets: values.map((item) => ({
          label: item.type,
          data: item.values,
          borderColor: item.color,
          backgroundColor: item.color,
          borderWidth: 1.5,
          pointRadius: 0.5,
        })),
      };
    }

    return {
      labels: [],
      datasets: [],
    };
  };

  const toggleShowServerity = () => {
    setIsShowSeverity(!isShowSeverity);
  };

  const handeShowSeveriry = (dass: DassChart) => {
    setDass(dass);
    toggleShowServerity();
  };

  return (
    <div className="Dass">
      {listDass.map((dass, index) => (
        <div className="Dass__item" key={index}>
          <BaseText type="title" className="Dass__item--title">
            {dass.title}
          </BaseText>
          <div className="Dass__chart--container">
            {!dass.values && (
              <div className="Dass__item--loading">
                <Spin tip="Loading" size="small">
                  <div className="content" />
                </Spin>
              </div>
            )}
            {dass.values?.data.length ? (
              <>
                <BaseText type="caption" className="Dass__chart--title">
                  Score
                </BaseText>

                <div className="Dass__chart--line">
                  <ChartLabel />
                  <Line options={DassChartOptions} data={convertChart(dass.type)} className="Dass__chart--svg" />
                </div>
                <div className="Dass__chart--footer">
                  <ChartLegend />
                  <div onClick={() => handeShowSeveriry(dass)} className="Dass__chart--btn-severity">
                    <BaseText className="Dass__chart--footer-title">Severity</BaseText>
                  </div>
                </div>
              </>
            ) : null}
            {dass.values && !dass.values?.data.length ? <Empty description="No data" /> : null}
          </div>
        </div>
      ))}
      <ModalSeverity open={isShowSeverity} data={dass?.values?.severity} onCancel={toggleShowServerity} />
    </div>
  );
};

export default Dass;
