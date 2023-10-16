import React from 'react';
import { Dimensions, Image, ScrollView, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import theme from '@src/themes';
import { TTrackMood } from '@src/interfaces/trackmood-interfaces';
import {
  AngryEmotionImage,
  GreatEmotionImage,
  HappyEmotionImage,
  SadEmotionImage,
  UnHappyEmtionImage,
} from '@src/assets/images';
import { MOOD_CHART_HEIGHT } from '@src/variables/constants';
import { convertDate } from '@src/utils/datetime-utils';
import { statusChartStyles } from './styles';

interface IProps {
  data: TTrackMood[];
}

const StatusChart = (props: IProps) => {
  const { data } = props;

  const chartDatas = data.map((item) => {
    if (item.point > 0 && item.point % 2 === 0) {
      return Math.floor((item.point - 1) / 2);
    }
    return Math.floor(item.point / 2);
  });

  const chartLabels = data.map((item) => convertDate(item.createdAt));

  return (
    <View
      style={{
        position: 'relative',
        justifyContent: 'flex-end',
        paddingRight: 16,
        paddingLeft: 30,
      }}
    >
      <View
        style={{
          height: MOOD_CHART_HEIGHT - 50,
          justifyContent: 'space-between',

          position: 'absolute',
          top: 10,
          left: 0,
        }}
      >
        <Image style={statusChartStyles.image} source={GreatEmotionImage} />
        <Image style={statusChartStyles.image} source={HappyEmotionImage} />
        <Image style={statusChartStyles.image} source={UnHappyEmtionImage} />
        <Image style={statusChartStyles.image} source={SadEmotionImage} />
        <Image style={statusChartStyles.image} source={AngryEmotionImage} />
      </View>
      <ScrollView
        horizontal={true}
        style={{
          flex: 1,
        }}
      >
        <LineChart
          data={{
            labels: chartLabels,
            datasets: [
              {
                data: chartDatas,
              },
              {
                data: [0],
              },
              {
                data: [4],
              },
            ],
          }}
          width={
            chartDatas.length > 7
              ? ((Dimensions.get('window').width - 46 - 20) / 7) * chartDatas.length
              : Dimensions.get('window').width - 46 - 20
          }
          height={MOOD_CHART_HEIGHT}
          chartConfig={{
            backgroundColor: 'white',
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            decimalPlaces: 2,
            color: (_) => theme.colors.warning,
            labelColor: (_) => `black`,
            propsForLabels: {
              fontSize: 10,
              fontWeight: '500',
            },
            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: `${theme.colors.lightGrey}`,
              strokeWidth: 1,
            },
            style: {
              paddingTop: 10,
              borderWidth: 1,
            },
          }}
          bezier
          style={{
            borderRadius: 10,
            paddingRight: 13,
          }}
          withDots={false}
          withShadow={false}
          withHorizontalLabels={false}
        />
      </ScrollView>
    </View>
  );
};

export default StatusChart;
